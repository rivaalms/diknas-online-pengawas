<template>
<v-card-text>
   <p>Catatan revisi data <code>{{ data.id }}</code></p>
   <div class="text-center pb-4">
      <v-progress-circular
         v-if="loading"
         indeterminate
         color="primary"
      />
   </div>
   <v-card
      v-if="!loading && notes.length > 0"
      flat
      class="overflow-y-auto overflow-x-hidden"
      height="250"
   >
      <v-row dense>
         <v-col v-for="item in notes" :key="item.id" cols="12">
            <v-card flat outlined>
               <v-card-title class="text-caption">
                  {{ item.date }}
               </v-card-title>
               <v-card-text>
                  {{ item.note }}
               </v-card-text>
            </v-card>
         </v-col>
      </v-row>
   </v-card>

   <v-alert
      v-else-if="!loading && notes.length < 1"
      color="warning"
      text
      class="d-flex justify-center"
   >
      Tidak ada data
   </v-alert>
</v-card-text>
</template>

<script>
import { mapState } from 'vuex'

export default {
   props: {
      data: {
         type: Object,
         default: () => {}
      }
   },

   data() {
      return {
         notes: [],
         loading: true,
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),
   },

   mounted() {
      this.$axios.get('/getRevision', {
         params: {
            id: this.data.id
         }
      }).then(resp => {
         this.loading = false
         this.notes = resp.data.data
      })
   }

   // watch: {
   //    dialogTrigger() {
   //       if (this.dialogTrigger) {
   //          console.log(this.dialog)
   //       }
         
   //       // if (this.dialogTrigger && this.dialog.type === 'notes' && (this.data.data_status_id === 3 || this.data.data_status_id === 4)) {
   //       //    this.$axios.get('/getRevision', {
   //       //       params: {
   //       //          id: this.data.id
   //       //       }
   //       //    }).then(resp => {
   //       //       this.notes = resp.data.data
   //       //    })
   //       // } else {
   //       //    this.notes = []
   //       // }
   //    },
   // }
}
</script>