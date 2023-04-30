<!-- eslint-disable vue/no-mutating-props -->
<template>
<div>
   <!-- //SECTION - Alert -->
   <v-alert
      :type="alertType"
      :color="alertColor"
      :icon="alertIcon"
      dismissible
      text
      transition="fade-transition"
      :value="alertTrigger"
      >
      <span id="alertMessage"></span>
   </v-alert>
   <!-- //!SECTION -->

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

      <!-- <v-col cols="6" md="2">
         <v-select
            v-model="categoryId"
            :items="categories"
            item-text="name"
            item-value="id"
            label="Kategori"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col>

      <v-col cols="6" md="2">
         <v-select
            v-model="dataTypeId"
            :items="dataTypes"
            item-text="name"
            item-value="id"
            label="Tipe Data"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-select>
      </v-col> -->
      <!-- <v-btn
         color="primary"
         @click.stop="dialog()"
      >
         Input Data
      </v-btn> -->
   </div>
   <!-- //!SECTION -->

   <!-- //SECTION - Data table -->
   <v-data-table
      :headers="headers"
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

   <!-- //SECTION - Dialog -->
   <v-dialog
      v-model="dialogTrigger"
      max-width="500px"
      persistent
   >
      <v-card v-if="isVerify">
         <v-card-title>Verifikasi data?</v-card-title>
         <v-card-text>
            Anda yakin ingin memverifikasi data <code>{{ targetItem.id }}</code>?
         </v-card-text>
         <v-card-text class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialog">Batal</v-btn>
            <v-btn color="green darken-2" depressed class="white--text" @click="verifyData">Verifikasi Data</v-btn>
         </v-card-text>
      </v-card>

      <v-card v-else-if="isRevision">
         <v-card-title>Kembalikan data untuk direvisi?</v-card-title>
         <v-card-text>
            <p>Anda yakin ingin mengembalikan data <code>{{ targetItem.id }}</code> untuk direvisi?</p>
            <v-form
               ref="revisionNotesText"
               @submit.prevent
            >
               <v-textarea
                  v-model="revisionNotes"
                  auto-grow
                  label="Catatan Revisi"
                  :rules="textareaRules"
               ></v-textarea>
            </v-form>
         </v-card-text>
         <v-card-text class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialog">Batal</v-btn>
            <v-btn color="deep-orange darken-1" depressed class="white--text" @click="revisionData">Kembalikan Data</v-btn>
         </v-card-text>
      </v-card>
   </v-dialog>
   <!-- //!SECTION -->

   <!-- //SECTION - Snackbar -->
   <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      text
   >
      {{ snackbarText }}

      <template #action="{ attrs }">
         <v-btn
            :color="snackbarColor"
            text
            v-bind="attrs"
            @click="snackbar = false"
         >
            Tutup
         </v-btn>
      </template>
   </v-snackbar>
   <!-- //!SECTION -->
</div>
</template>

<script>
// import crypto from 'crypto'
// import { renameFile } from '~/utils/fileUtils.js'

export default {
   // SECTION - Props
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
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
         categoryId: null,
         dataTypeId: null,

         schools: [],
         status: [],
         categories: [],
         dataTypes: [],

         alertTrigger: false,
         alertColor: null,
         alertIcon: null,
         alertType: null,
         alertMessage: null,

         dialogTrigger: false,
         isVerify: false,
         isRevision: false,
         revisionNotes: '',

         targetItem: [],
         dialogTitle: '',

         snackbarText: '',
         snackbar: false,
         snackbarColor: '',
      }
   },
   // !SECTION

   computed: {
      // dataTypes() {
      //    const category = this.categoryId ?? null
      //    const data = this.getDataTypes(category)
      //    return data
      // }

      textareaRules() {
         return [v => !!v || 'Wajib diisi']
      }
   },
   
   // SECTION - Watch
   watch: {
      // closeDialog (val) {
      //    val || this.closeDialog()
      // },

      // dialogDelete(val) {
      //    val || this.closeDelete()
      // },

      categoryId() {
         this.getDataTypes(this.categoryId)
      },

      alertTrigger() {
         if (this.alertTrigger === true) {
            setTimeout(() => {
               this.onTriggeredAlert()
            }, 5000)
         }
      },
   },
   // !SECTION
   
   async mounted() {
      await this.$axios.get(`/getStatus`).then((resp) => {
         this.status = resp.data.data
      })

      await this.$axios.get(`/supervisor/getSchoolBySupervisor/${this.$auth.user.id}`).then((resp) => {
         this.schools = resp.data.data
      })

      // await this.$axios.get('/getCategories').then((resp) => {
      //    this.categories = resp.data.data
      // })

      // this.getDataTypes(this.categoryId)
   },

   methods: {
      onTriggeredAlert() {
         this.alertTrigger = false
         this.alertColor = null
         this.alertIcon = null
         this.alertType = null
         this.alertMessage = null
         document.getElementById('alertMessage').innerHTML = this.alertMessage
      },

      async getDataTypes(category) {
         let selectedCategory = ''
         this.dataTypes = []

         if (category) {
            this.categories.forEach((item) => {
               if (item.id === category) {
                  selectedCategory = item
               }
            })
         }

         await this.$axios.get(`/getDataTypes`, {
            params: {
               slug: selectedCategory.slug
            }
         }).then((resp) => {
            this.dataTypes = resp.data.data
            this.dataTypeId = 0
         })
      },

      dataHandler() {
         this.$emit('data-handler', this.current, this.statusId, this.schoolId, this.categoryId, this.dataTypeId)
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
               this.snackbarText = 'File berhasil diunduh.'
               this.snackbarColor = 'green darken-3'
               this.snackbar = true
            })
         } catch (e) {
            this.snackbarText = 'File tidak ditemukan.'
            this.snackbarColor = 'red darken-2'
            this.snackbar = true
         }
      },

      dialog(item, type) {
         this.dialogTrigger = true
         this.targetItem = item
         
         if (type === 'verify') {
            this.isVerify = true
         } else if (type === 'revision') {
            this.isRevision = true
         }
      },

      closeDialog() {
         this.dialogTrigger = false
         this.targetItem = []
         this.revisionNotes = ''
         this.isVerify = false
         this.isRevision = false
      },

      async verifyData() {
         // console.log(item)
         await this.$axios.post(`/supervisor/verifyData`, this.targetItem)
         this.alertType = 'success'
         this.alertColor = 'green darken-2'
         this.alertIcon = 'mdi-check'
         this.alertMessage = `Data dengan ID <code>${this.targetItem.id}</code> berhasil diverifikasi`
         document.getElementById('alertMessage').innerHTML = this.alertMessage
         this.alertTrigger = true

         this.closeDialog()
         this.dataHandler()
      },

      async revisionData() {
         if (this.$refs.revisionNotesText.validate()) {
            this.targetItem.revision_notes = this.revisionNotes
            await this.$axios.post(`/supervisor/revisionData`, this.targetItem)
            this.onTriggeredAlert()
            this.alertType = 'success'
            this.alertColor = 'deep-orange darken-1'
            this.alertIcon = 'mdi-alert'
            this.alertMessage = `Data dengan ID <code>${this.targetItem.id}</code> berhasil dikembalikan untuk direvisi`
            document.getElementById('alertMessage').innerHTML = this.alertMessage
            this.alertTrigger = true
   
            this.closeDialog()
            this.dataHandler()
         }
      }
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