<template>
   <v-container fluid>
      <div>
         <page-header
            :title="category.name"
         />
         <v-row dense>
            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Data {{ category.name }} Sekolah Binaan
                  </v-card-title>
                  <v-card-text>
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
                  </v-card-text>
               </v-card>
            </v-col>

            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Tipe Data Kategori {{ category.name }}
                  </v-card-title>
                  <v-card-text>
                     <v-row dense>
                        <v-col
                           v-for="item in dataTypes" :key="item.id"
                           cols="6"
                           sm="4"
                           md="2"
                        >
                           <v-card
                              flat
                              outlined
                              height="100%"
                              class="v-btn text-capitalize"
                              router
                              :to="{name: 'category-slug-type', params: { slug: category.slug, type: item.slug }}"
                              exact
                           >
                              <v-card-text>{{ item.name }}</v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-col>

            <v-col cols="12">
               <v-card flat>
                  <v-card-title class="text-subtitle-1">
                     Kategori Lainnya
                  </v-card-title>
                  <v-card-text>
                     <v-row dense>
                        <v-col
                           v-for="item in categories" :key="item.id"
                           cols="6"
                           sm="4"
                           md="2"
                        >
                           <v-card
                              flat
                              outlined
                              height="100%"
                              class="v-btn text-capitalize"
                              router
                              :to="{name: 'category-slug', params: { slug: item.slug }}"
                              exact
                           >
                              <v-card-text>{{ item.name }}</v-card-text>
                           </v-card>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-col>
         </v-row>
      </div>
   </v-container>
</template>

<script>
export default {
   data() {
      return {
         dataTypes: [],
         category: [],
         categories: [],
         headers: [
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

   head() {
      return {
         title: this.category ? this.category.name : 'Kategori'
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

      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: this.category.name, disabled: true, href: `/category/${this.category.slug}`}
      ])

      this.dataHandler()
   },

   methods: {
      dataHandler(current, statusId, schoolId, dataTypeId) {
         this.loading = true
         this.$axios.get(`/supervisor/getData`, {
            params: {
               supervisor: this.$auth.user.id,
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