<template>
<div>
   <div class="d-flex align-center flex-wrap">
      <div class="me-2">
         <p class="mb-0 text-subtitle-2">Filter:</p>
      </div>
      <v-col cols="6" md="3">
         <v-autocomplete
            v-model="schoolId"
            :items="schools"
            :loading="schoolFilterLoading"
            :search-input.sync="schoolInputSync"
            hide-no-data
            hide-selected
            item-text="name"
            item-value="id"
            label="Sekolah"
            placeholder="Ketik untuk mencari"
            clearable
            hide-details="auto"
            class="pt-0 mt-0"
            @input="dataHandler()"
         ></v-autocomplete>
      </v-col>
      <v-col cols="3">
         <v-text-field
            v-model="year"
            label="Tahun ajaran"
            clearable
            append-icon="mdi-magnify"
            hide-details="auto"
            class="pt-0 mt-0"
            placeholder="Enter untuk mencari"
            @keydown.enter="dataHandler()"
            @click:clear="emptyYearDataHandler()"
            @click:append="dataHandler()"
         ></v-text-field>
      </v-col>
   </div>
   
   <!-- //SECTION - Schools table -->
   <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="current"
      :loading="loading"
      hide-default-footer
      class="mb-3"
   >
      <!-- //SECTION - Action Buttons -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="info"
                  v-on="on"
                  @click="dialog(item)"
               >
                  <v-icon>mdi-eye-outline</v-icon>
               </v-btn>
            </template>
            <span>Lihat detail</span>
         </v-tooltip>
      </template>
      <!-- //!SECTION -->
   </v-data-table>
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

   <lazy-school-dialog/>
</div>
</template>

<script>
export default {
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
      items: {
         type: Array,
         default: () => {}
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
      totalPage: {
         type: Number,
         default: 0
      }
   },

   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,
         schoolId: null,
         schools: [],
         schoolFilterLoading: false,
         schoolInputSync: null,
         year: null,

         teacherItems: []
      }
   },

   watch: {
      schoolInputSync(val) {
         if (this.schools.length > 0) return
         if (this.schoolFilterLoading) return
         this.schoolFilterLoading = true
         this.$axios.get(`/supervisor/getSchoolBySupervisor/${this.$auth.user.id}`, {
            params: {
               school: this.schoolId
            }
         }).then((resp) => {
            this.schools = resp.data.data
         }).catch((e) => {
            console.log(e)
         }).finally(() => {
            this.schoolFilterLoading = false
         })
      },
   },

   methods: {
      dialog(item) {
         this.$store.dispatch('setDialog', {
            type: 'school',
            title: `Detail Statistik ${item.name}`,
            item,
         })
         this.$store.dispatch('showDialog')
      },

      dataHandler() {
         this.$emit('data-handler', this.current, this.schoolId, this.year)
      },
   }
}
</script>