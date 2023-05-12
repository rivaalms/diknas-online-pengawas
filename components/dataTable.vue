<!-- eslint-disable vue/no-mutating-props -->
<template>
<div>
   <app-alert/>

   <!-- //SECTION - Status Filter & New Data Btn -->
   <div class="d-flex align-center flex-wrap">
      <div class="me-2">
         <p class="mb-0 text-subtitle-2">Filter:</p>
      </div>
      <v-col cols="6" md="2">
         <v-select
            v-model="schoolId"
            :items="schools"
            item-text="name"
            item-value="id"
            label="Sekolah"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col>

      <v-col cols="6" md="2">
         <v-select
            v-model="statusId"
            :items="status"
            item-text="name"
            item-value="id"
            label="Status"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col>
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION - Data table -->
   <v-data-table
      :headers="tableHeader"
      :items="items"
      :page.sync="current"
      :loading="loading"
      hide-default-footer
      class="mb-3"
   >
      <!-- //SECTION - Status Chips -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.data_status.name="{item}">
         <v-chip
            class="font-weight-medium"
            :class="getColor(item.data_status_id)"
            pill
         >
            {{ item.data_status.name }}
         </v-chip>
      </template>
      <!-- //!SECTION -->

      <!-- //SECTION - Action Buttons -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="light-blue darken-2"
                  v-on="on"
                  @click="downloadFile(item)"
               >
                  <v-icon>mdi-file-download</v-icon>
               </v-btn>
            </template>
            <span>Download</span>
         </v-tooltip>

         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="(item.data_status_id === 2) ? true : false"
                  class="me-2"
                  color="green darken-2"
                  v-on="on"
                  @click.stop="dialog(item, 'verify')"
               >
                  <v-icon>mdi-file-document-check</v-icon>
               </v-btn>
            </template>
            <span>Verifikasi</span>
         </v-tooltip>

         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  :disabled="(item.data_status_id === 2 || item.data_status_id === 3) ? true : false"
                  class="me-2"
                  color="deep-orange darken-1"
                  v-on="on"
                  @click.stop="dialog(item, 'revision')"
               >
                  <v-icon>mdi-file-document-edit</v-icon>
               </v-btn>
            </template>
            <span>Kembalikan untuk revisi</span>
         </v-tooltip>
      </template>
      <!-- //!SECTION -->
   </v-data-table>
   <!-- //!SECTION -->

   <!-- //SECTION - Table footer & Pagination -->
   <div v-if="items" class="d-flex justify-space-between align-center">
      <p class="text-caption mb-0">
         {{ from }}-{{ to }} dari {{ total }} data
      </p>
      <v-pagination
         v-model="current"
         :length="totalPage"
         total-visible="7"
         prev-icon="mdi-menu-left"
         next-icon="mdi-menu-right"
         @input="dataHandler()"
      ></v-pagination>
   </div>
   <!-- //!SECTION -->

   <lazy-verify-revision-dialog
      @submit="dataHandler()"
   />

   <lazy-app-snackbar/>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
   // SECTION - Props
   props: {
      items: {
         type: Array,
         default: () => {}
      },
      totalPage: {
         type: Number,
         default: 0
      },
      currentPage: {
         type: Number,
         default: 0
      },
      loading: {
         type: Boolean,
         default: false
      },
      from: {
         type: Number,
         default: 0
      },
      to: {
         type: Number,
         default: 0
      },
      total: {
         type: Number,
         default: 0
      },
   },
   // !SECTION
   
   // SECTION - Data
   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         statusId: null,
         schoolId: null,

         schools: [],
         status: [],
      }
   },
   // !SECTION

   computed: {
      ...mapState(['tableHeader', 'dialogTrigger', 'snackbarTrigger']),
   },
   
   watch: {
      dialogTrigger() {
         if (this.dialogTrigger === false) {
            setTimeout(() => {
               this.$store.dispatch('clearDialog')
            }, 500)
         }
      },

      snackbarTrigger() {
         if (this.snackbarTrigger === false) {
            setTimeout(() => {
               this.$store.dispatch('clearSnackbar')
            }, 500)
         }
      }
   },
   
   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })

      await this.$axios.get(`/supervisor/getSchoolBySupervisor/${this.$auth.user.id}`).then((resp) => {
         this.schools = resp.data.data
      })
   },

   methods: {
      dataHandler() {
         this.$emit('data-handler', this.current, this.statusId, this.schoolId)
      },

      getColor(status) {
         if (status === 1) return "grey lighten-4"
         if (status === 2) return "green darken-1 white--text"
         if (status === 3) return "deep-orange darken-1 white--text"
         if (status === 4) return "cyan lighten-1 white--text"
      },

      getFileExtension(name) {
         const fileName = name
         const extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
         return extension
      },

      async downloadFile(item) {
         const fileExtension = this.getFileExtension(item.path)
         const filename = item.school.name + '_' + item.category + '_' + item.data_type.name + '_' + item.year + fileExtension

         try {
            await this.$axios({
               url: `/downloadFile`,
               method: "POST",
               responseType: 'blob',
               data: {
                  path: item.path
               }
            })
            .then((resp) => {
               const url = window.URL.createObjectURL(new Blob([resp.data]))
               const link = document.createElement('a')
               link.href = url
               link.setAttribute('download', filename)
               document.body.appendChild(link)
               link.click()
               document.body.removeChild(link)

               this.$store.dispatch('setSnackbar', {
                  color: 'green darken-3',
                  text: 'File berhasil diunduh'
               })
            })
         } catch (e) {
            this.$store.dispatch('setSnackbar', {
               color: 'red darken-2',
               text: 'File tidak ditemukan'
            })
         } finally {
            this.$store.dispatch('showSnackbar')
         }
      },

      dialog(item, type) {
         this.$store.dispatch('setDialog', {
            type,
            title: type === 'verify' ? 'Verifikasi data?' : 'Kembalikan data untuk direvisi?',
            targetItem: item
         })
         this.$store.dispatch('showDialog')
      },
   }
}
</script>

<style>
.v-pagination__navigation {
   transition: 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.v-pagination__navigation, .v-pagination__item {
   box-shadow: none!important;
}

.v-pagination__navigation:hover, .v-pagination__item:hover:not(.v-pagination__item--active) {
   background-color: #eeeeee!important;
}
</style>