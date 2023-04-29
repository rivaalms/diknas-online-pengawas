<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Dashboard</p>
         <v-breadcrumbs
            :items="breadcrumb"
            class="px-0 py-2"
         >
            <template #item="{item}">
               <v-breadcrumbs-item
                  exact
                  :to="item.href"
                  :disabled="item.disabled"
               >{{ item.text }}</v-breadcrumbs-item>
            </template>
         </v-breadcrumbs>
      </div>
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Semua Data dari Sekolah Binaan
               </v-card-title>
               <v-card-text>
                  <data-table
                     :headers="tableHeaders"
                     :items="data.data"
                     :total-page="data.last_page"
                     :current-page="data.current_page"
                     :from="data.from"
                     :to="data.to"
                     :total="data.total"
                     :loading="loading"
                     @data-handler="(current, status_id, school_id, category_id, data_type_id) => dataHandler(current, status_id, school_id, category_id, data_type_id)"
                  />
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div>

   <!-- <div class="mb-6">
      <p class="text-h6">Kategori Data</p>
      <v-row>
         <v-col
            v-for="item in categories" :key="item.slug"
            cols="6" sm="4" md="3"
         >
            <v-card
               class="v-btn text-capitalize"
               router
               :to="{name: 'category-slug', params: {slug: item.slug}}"
               exact
            >
               <v-card-text>{{ item.name }}</v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div> -->
</v-container>
</template>

<script>
import dataTable from '~/pages/components/table'

export default {
   name: 'IndexPage',

   components: { dataTable },

   data() {
      return {
         user: this.$auth.user,

         tableHeaders: [
            {
               text: 'ID',
               value: 'id'
            },
            {
               text: 'Nama Sekolah',
               value: 'school.name'
            },
            {
               text: 'Tipe data',
               value: 'data_type.name',
            },
            {
               text: 'Kategori',
               sortable: false,
               value: 'data_category.name',
            },
            {
               text: 'Tahun ajaran',
               value: 'year',
            },
            {
               text: 'Status',
               sortable: false,
               value: 'data_status.name',
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions',
            },
         ],
         data: [],
         loading: true,

         categories: []
      }
   },

   computed: {
      breadcrumb() {
         const data = [
            {text: 'Dashboard', disabled: true, href: '/'},
         ]
         return data
      }
   },

   async mounted() {
      await this.$axios.get(`/supervisor/getData/${this.user.id}`).then((resp) => {
         this.data = resp.data.data
         this.loading = false
      })
   },

   methods: {
      dataHandler(current, statusId, schoolId, categoryId, dataTypeId) {
         this.loading = true
         this.$axios.get(`/supervisor/getData/${this.user.id}`, {
            params: {
               page: current,
               status: statusId,
               school: schoolId,
               category: categoryId,
               data_type: categoryId ? dataTypeId : null,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },
   }
}
</script>
