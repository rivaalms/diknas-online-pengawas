<template>
<div>
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
                  color="cyan"
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
   <!-- //!SECTION -->

   <!-- //SECTION - Dialog -->
   <v-dialog
      v-model="dialogTrigger"
      persistent
   >
      <v-card>
         <v-card-title class="justify-space-between">
            Detail Statistik {{ targetItem.name }}
            <v-tooltip left color="black">
               <template #activator="{on, attrs}">
                  <v-btn
                     v-bind="attrs"
                     icon
                     v-on="on"
                     @click.stop="closeDialog()"
                  >
                     <v-icon>mdi-window-close</v-icon>
                  </v-btn>
               </template>
               <span>Tutup</span>
            </v-tooltip>
         </v-card-title>
         
         <v-card-text>
            <v-tabs
               v-model="tab"
               grow
            >
               <v-tab>Siswa</v-tab>
               <v-tab>Guru</v-tab>
            </v-tabs>
         </v-card-text>
         <v-card-text>
            <v-tabs-items
               v-model="tab"
            >
               <v-tab-item class="py-4 px-1">
                  <v-row>
                     <v-col cols="12" md="3">
                        <v-card>
                           <v-card-text>
                              <p class="mb-2">Jumlah Siswa</p>
                              <p class="text-h4 font-weight-medium grey--text text--darken-4">{{ targetItem.total_students }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col v-for="students in targetItem.students" :key="students.grade" cols="12" md="3">
                        <v-card>
                           <v-card-text>
                              <p class="mb-2">Kelas {{ students.grade }}</p>
                              <p class="text-h4 font-weight-medium grey--text text--darken-4">{{ students.total }}</p>
                           </v-card-text>
                        </v-card>
                     </v-col>
                     <v-col cols="12" class="mt-6">
                        <p class="text-h6">Data Siswa Berdasarkan Agama</p>
                        <v-data-table
                           hide-default-footer
                           :headers="studentHeaders"
                           :items="targetItem.students"
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
                     items-per-page="5"
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
      </v-card>
   </v-dialog>
   <!-- //!SECTION -->
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
   },

   data() {
      return {
         current: this.currentPage ?? 1,
         dialogTrigger: false,
         targetItem: [],
         tab: null,

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

         teacherItems: []
      }
   },

   methods: {
      dialog(item) {
         this.dialogTrigger = true
         this.targetItem = item


         for (const prop in this.targetItem.teachers) {
            if (prop !== 'id' && prop !== 'school_id' && prop !== 'year' && prop !== 'created_at' && prop !== 'updated_at') {
               this.teacherItems.push({subject: prop, value: this.targetItem.teachers[prop]})
            }
         }
         this.teacherItems.unshift({subject: 'total', value: this.targetItem.total_teachers})
      },

      closeDialog() {
         this.dialogTrigger = false
         this.targetItem = []
         this.teacherItems = []
      }
   }
}
</script>