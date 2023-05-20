<template>
<v-container fluid>
   <div>
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Dashboard</p>
         <app-breadcrumb/>
      </div>
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Semua Data dari Sekolah Binaan
               </v-card-title>
               <v-card-text>
                  <data-table
                     :items="data.data"
                     :total-page="data.last_page"
                     :current-page="data.current_page"
                     :from="data.from"
                     :to="data.to"
                     :total="data.total"
                     :loading="loading"
                     @data-handler="(current, status_id, school_id, year) => dataHandler(current, status_id, school_id, year)"
                  />
               </v-card-text>
            </v-card>
         </v-col>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Kategori Data
               </v-card-title>
               <v-card-text>
                  <v-row dense>
                     <v-col
                        v-for="item in categories"
                        :key="item.slug"
                        cols="3" sm="4" md="2">
                        <v-card
                           flat
                           outlined
                           class="v-btn text-capitalize"
                           router exact
                           :to="{name: 'category-slug', params: { slug: item.slug }}"
                        >
                           <v-card-text>
                              {{ item.name }}
                           </v-card-text>
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
   name: 'IndexPage',

   data() {
      return {
         user: this.$auth.user,

         data: [],
         loading: true,

         categories: []
      }
   },

   head() {
      return {
         title: 'Dashboard'
      }
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: true, href: '/' }
      ])
   },

   async mounted() {
      await this.dataHandler()
      await this.$axios.get(`/getCategories`).then((resp) => {
         this.categories = resp.data.data
      })
   },

   methods: {
      dataHandler(current, statusId, schoolId, year) {
         this.loading = true
         this.$axios.get(`/supervisor/getData`, {
            params: {
               supervisor: this.user.id,
               page: current,
               status: statusId,
               school: schoolId,
               year,
               // category: categoryId,
               // data_type: categoryId ? dataTypeId : null,
            }
         }).then((resp) => {
            this.data = resp.data.data
            this.loading = false
         })
      },
   }
}
</script>
