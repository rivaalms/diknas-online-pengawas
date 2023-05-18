<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Statistik Sekolah Binaan</p>
         <app-breadcrumb/>
      </div>
      <v-row dense>
         <v-col cols="12">
            <v-card flat>
               <v-card-title class="text-subtitle-1">
                  Data Statistik Sekolah Binaan
               </v-card-title>
               <v-card-text>
                  <schools-table
                     :headers="headers"
                     :items="data.data"
                     :current-page="data.current_page"
                     :from="data.from"
                     :to="data.to"
                     :total="data.total"
                     :total-page="data.last_page"
                     :loading="loading"
                     @data-handler="(current, schoolId, year) => getSchools(current, schoolId, year)"
                  />
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
         user: this.$auth.user,
         headers: [
            {
               text: 'Nama Sekolah',
               value: 'name'
            },
            {
               text: 'Kepala Sekolah',
               value: 'principal'
            },
            {
               text: 'Email',
               value: 'email'
            },
            {
               text: 'Jumlah Siswa',
               value: 'total_students'
            },
            {
               text: 'Jumlah Guru',
               value: 'total_teachers'
            },
            {
               text: 'Aksi',
               sortable: false,
               value: 'actions'
            }
         ],
         data: [],
         loading: false,
         year: null,
         yearList: []
      }
   },

   head() {
      return {
         title: 'Statistik Sekolah Binaan'
      }
   },

   created() {
      this.$store.dispatch('setBreadcrumb', [
         { text: 'Dashboard', disabled: false, href: '/' },
         { text: 'Statistik Sekolah Binaan', disabled: true, href: '/school' }
      ])
   },

   async mounted() {
      await this.getSchools()
      // await this.getYearList()
   },

   methods: {
      async getSchools(current, schoolId, year) {
         this.loading = true
         await this.$axios.get(`/supervisor/getPaginatedSchoolBySupervisor/${this.$auth.user.id}`, {
            params: {
               page: current,
               school: schoolId,
               year: year ?? ''
            }
         }).then((resp) => {
            this.data = resp.data.data
         }).catch((e) => {
            this.$store.dispatch('setAlert', {
               type: 'error',
               icon: 'mdi-alert',
               message: e
            })
            this.$store.dispatch('showAlert')
         }).finally(() => {
            this.loading = false
         })
      },

      // async getYearList() {
      //    await this.$axios.get(`/supervisor/getStudentsYear/${this.$auth.user.id}`).then((resp) => {
      //       this.yearList = resp.data.data
      //       this.year = this.yearList[0]
      //    })
      // }
   }
}
</script>