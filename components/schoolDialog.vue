<template>   
<v-card-text>
   <v-tabs
      v-model="tab"
      grow
   >
      <v-tab>Siswa</v-tab>
      <v-tab>Guru</v-tab>
   </v-tabs>
   <v-tabs-items
      v-model="tab"
   >
      <v-tab-item class="py-4 px-1">
         <v-row>
            <v-col cols="12" md="3">
               <v-card flat outlined>
                  <v-card-text>
                     <p class="mb-2">Jumlah Siswa</p>
                     <p class="text-h4 font-weight-medium grey--text text--darken-3">{{ data ? data.total_students : ''}}</p>
                  </v-card-text>
               </v-card>
            </v-col>
            <template v-if="data">
               <v-col v-for="students in data.students" :key="students.grade" cols="12" md="3">
                  <v-card flat outlined>
                     <v-card-text>
                        <p class="mb-2">Kelas {{ students.grade }}</p>
                        <p class="text-h4 font-weight-medium grey--text text--darken-3">{{ students.total }}</p>
                     </v-card-text>
                  </v-card>
               </v-col>
            </template>
            <v-col cols="12" class="mt-6">
               <p class="text-subtitle-1">Data Siswa Berdasarkan Agama</p>
               <v-data-table
                  hide-default-footer
                  :headers="studentHeaders"
                  :items="data ? data.students : []"
               >
                  <!-- eslint-disable-next-line vue/valid-v-slot -->
                  <template #item.grade="{item}">
                     Kelas {{ item.grade }}
                  </template>
               </v-data-table>
            </v-col>
         </v-row>
      </v-tab-item>

      <v-tab-item class="py-4 px-1">
         <v-data-table
            :headers="teacherHeaders"
            :items="teacherItems"
            :items-per-page="5"
         >
         <!-- eslint-disable-next-line vue/valid-v-slot -->
         <template #item.subject="{ item }">
            {{ (item.subject === 'math') ? 'Matematika' 
            : (item.subject === 'ind_lit') ? 'Bahasa Indonesia' 
            : (item.subject === 'eng_lit') ? 'Bahasa Inggris' 
            : (item.subject === 'science') ? 'Ilmu Pengetahuan Alam' 
            : (item.subject === 'social') ? 'Ilmu Pengetahuan Sosial' 
            :(item.subject === 'civic') ? 'Pendidikan Kewarganegaraan' 
            : (item.subject === 'islam') ? 'Pendidikan Agama Islam' 
            : (item.subject === 'catholic') ? 'Pendidikan Agama Katolik' 
            : (item.subject === 'protestant') ? 'Pendidikan Agama Protestan' 
            : (item.subject === 'hindu') ? 'Pendidikan Agama Hindu' 
            : (item.subject === 'buddha') ? 'Pendidikan Agama Buddha' 
            : (item.subject === 'konghucu') ? 'Pendidikan Agama Konghucu' 
            : (item.subject === 'counseling') ? 'Bimbingan Konseling' 
            : (item.subject === 'sports') ? 'Pendidikan Jasmani, Olahraga dan Kesehatan' 
            : (item.subject === 'art') ? 'Seni Budaya dan Keterampilan'
            : (item.subject === 'entrepreneurship') ? 'Kewirausahaan'
            : 'Total' }}
         </template>
         </v-data-table>
      </v-tab-item>
   </v-tabs-items>
</v-card-text>
</template>

<script>
export default {
   props: {
      data: {
         type: Object,
         default: () => {}
      }
   },

   data() {
      return {
         studentHeaders: [
            {
               text: 'Kelas',
               value: 'grade'
            },
            {
               text: 'Islam',
               value: 'islam',
            },
            {
               text: 'Katolik',
               value: 'catholic'
            },
            {
               text: 'Protestan',
               value: 'protestant'
            },
            {
               text: 'Hindu',
               value: 'hindu'
            },
            {
               text: 'Buddha',
               value: 'buddha'
            },
            {
               text: 'Konghucu',
               value: 'konghucu'
            }
         ],
         teacherHeaders: [
            {
               text: 'Mata Pelajaran',
               value: 'subject',
            },
            {
               text: 'Jumlah',
               value: 'value'
            },
         ],
         teacherItems: [],
         tab: null,
      }
   },

   methods: {
      closeDialog() {
         this.tab = null
         this.teacherItems = []
         this.$emit('close')
      }
   }
}
</script>