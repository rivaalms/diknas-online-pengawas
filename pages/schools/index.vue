<template>
<v-container fluid>
   <div class="mb-6">
      <div class="d-flex justify-space-between align-center mt-5 mb-8">
         <p class="text-h6 mb-0">Statistik Sekolah Binaan</p>
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
                  Data Statistik Sekolah Binaan
               </v-card-title>
               <v-card-text>
                  <schools-table
                     :headers="headers"
                     :items="data.data"
                  />
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </div>
</v-container>
</template>

<script>
import schoolsTable from '@/pages/components/schoolsTable'

export default {
   components: { schoolsTable },

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
               value: 'actions'
            }
         ],
         data: [],
      }
   },

   computed: {
      breadcrumb() {
         const data = [
            {text: 'Dashboard', disabled: false, href: '/'},
            {text: 'Statistik Sekolah Binaan', disabled: true, href: '/school'}
         ]
         return data
      }
   },

   async mounted() {
      await this.getSchools()
   },

   methods: {
      async getSchools() {
         await this.$axios.get(`/supervisor/getPaginatedSchoolBySupervisor/${this.user.id}`).then((resp) => {
            this.data = resp.data.data
         })
      }
   }
}
</script>