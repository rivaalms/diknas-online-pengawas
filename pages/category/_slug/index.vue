<template>
   <v-container fluid>
      <div class="mb-6">
         <p class="text-h5">Data {{ category.name }}</p>
         <data-table
            :headers="headers"
            :items="data.data"
            :total-page="data.last_page"
            :current-page="data.current_page"
            :loading="loading"
            :from="data.from"
            :to="data.to"
            :total="data.total"
            @data-handler="(current, status_id, school_id, data_type_id) => dataHandler(current, status_id, school_id, data_type_id)"
         ></data-table>
   </div>
      
      <div class="mb-6">
         <p class="text-h5">Tipe Data Kategori {{ category.name }}</p>
         <v-row class="mb-6">
            <v-col
               v-for="item in dataTypes" :key="item.id"
               cols="12"
               sm="4"
               md="3"
            >
               <v-card class="v-btn text-capitalize" router :to="{name: 'category-slug-type', params: { slug: category.slug, type: item.slug }}" exact>
                  <v-card-text>
                     {{ item.name }}
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>
      <div class="mb-6">
         <p class="text-h5">Kategori Lainnya</p>
         <v-row>
            <v-col
               v-for="item in categories" :key="item.id"
               cols="12"
               sm="4"
               md="3"
            >
               <v-card class="v-btn text-capitalize" router :to="{name: 'category-slug', params: {slug: item.slug}}" exact>
                  <v-card-text>
                     {{ item.name }}
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>
   </v-container>
</template>

<script>
import dataTable from '@/pages/components/table'

export default {
   components: {
      dataTable
   },
   
   data() {
      return {
         dataTypes: [],
         category: [],
         categories: [],
         headers: [
            {
               text: 'Nama Sekolah',
               value: 'school.name'
            },
            {
               text: 'Tipe data',
               value: 'data_type.name'
            },
            {
               text: 'Kategori',
               sortable: false,
               value: 'data_category.name'
            },
            {
               text: 'Tahun ajaran',
               value: 'year'
            },
            {
               text: 'Status',
               sortable: false,
               value: 'data_status.name'
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions'
            }
         ],
         data: [],
         loading: true,
      }
   },

   async mounted() {
      await this.$axios.get(`/getDataTypes`, {
         params: {
            slug: this.$route.params.slug
         }
      }).then((resp) => { this.dataTypes = resp.data.data })

      await this.$axios.get(`/getCategories`).then((resp) => {
         let category = null
         const categories = []
         const slug = this.$route.params.slug

         resp.data.data.forEach(function(item, index) {
            if (item.slug === slug) {
               category = item
            } else {
               categories.push(item)
            }
         })

         this.category = category
         this.categories = categories
      })

      this.dataHandler()
   },

   methods: {
      dataHandler(current, statusId, schoolId, dataTypeId) {
         this.loading = true
         this.$axios.get(`/supervisor/getData/${this.$auth.user.id}`, {
            params: {
               page: current,
               status: statusId,
               school: schoolId,
               category: this.category.id,
               data_type: this.category.id ? dataTypeId : null,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      }
   }
}
</script>