<template>
<v-dialog
   v-model="dialogTrigger"
   :max-width="dialog.type === 'notes' ? '700' : '500'"
   persistent
>
   <v-card>
      <v-card-title class="justify-space-between">
         <span class="text-subtitle-1">{{ dialog ? dialog.title : '' }}</span>
         <v-tooltip left color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  v-on="on"
                  @click="closeDialog()"
               >
                  <v-icon>mdi-window-close</v-icon>
               </v-btn>
            </template>
            <span>Tutup</span>
         </v-tooltip>
      </v-card-title>
      <v-card-text v-if="dialog && dialog.type === 'verify'">
         <p>
            Anda yakin ingin memverifikasi data <code>{{ dialog ? dialog.targetItem.id : '' }}</code>?
         </p>
         <div class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialog">Batal</v-btn>
            <v-btn color="success" depressed class="white--text" @click.stop="verifyData">Verifikasi Data</v-btn>
         </div>
      </v-card-text>

      <v-card-text v-else-if="dialog && dialog.type === 'revision'">
         <p>Anda yakin ingin mengembalikan data <code>{{ dialog ? dialog.targetItem.id : ''}}</code> untuk direvisi?</p>
         <v-form
            ref="revisionNotesText"
            @submit.prevent="revisionData"
         >
            <v-textarea
               v-model="revisionNotes"
               auto-grow
               label="Catatan Revisi"
               :rules="textareaRules"
            ></v-textarea>
         </v-form>
         <div class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialog">Batal</v-btn>
            <v-btn color="warning" depressed class="white--text" @click.stop="revisionData">Kembalikan Data</v-btn>
         </div>
      </v-card-text>

      <v-card-text v-else-if="dialog && dialog.type === 'notes'">
         <p>Catatan revisi data <code>{{ dialog.targetItem.id }}</code></p>
         <v-card v-if="targetItem.length > 0" flat class="overflow-y-auto overflow-x-hidden" height="250">
            <v-row dense>
               <v-col v-for="item in targetItem" :key="item.id" cols="12">
                  <v-card flat outlined>
                     <v-card-title class="text-caption">{{ item.date }}</v-card-title>
                     <v-card-text>{{ item.note }}</v-card-text>
                  </v-card>
               </v-col>
            </v-row>
         </v-card>
         <v-alert v-else color="warning" outlined class="d-flex justify-center">
            Tidak ada data
         </v-alert>
      </v-card-text>
   </v-card>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
   data() {
      return {
         revisionNotes: null,
         targetItem: [],
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),

      textareaRules() {
         return [v => !!v || 'Wajib diisi']
      }
   },

   watch: {
      dialog() {
         if (this.dialog) {
            if (this.dialog.targetItem.data_status_id === 3 || this.dialog.targetItem.data_status_id === 4) {
               this.$axios.get('/getRevision', {
                  params: {
                     id: this.dialog.targetItem.id
                  }
               }).then((resp) => {
                  this.targetItem = resp.data.data
               })
            }
         }
      }, 

      dialogTrigger() {
         if (!this.dialogTrigger) {
            this.targetItem = []
         }
      }
   },

   methods: {
      async verifyData() {
         this.$store.dispatch('clearAlert')
         await this.$axios.post(`/supervisor/verifyData`, this.dialog.targetItem).then(() => {
            this.$store.dispatch('setAlert', {
               type: 'success',
               icon: 'mdi-check',
               message: `Data dengan ID <code>${this.dialog.targetItem.id}</code> berhasil diverifikasi`
            })
         }).catch((e) => {
            this.$store.dispatch('setAlert', {
               type: 'error',
               icon: 'mdi-alert',
               message: e
            })
         }).finally(() => {
            this.closeDialog()
            this.$store.dispatch('showAlert')
            this.$emit('submit')
         })
      },

      async revisionData() {
         this.$store.dispatch('clearAlert')
         if (this.$refs.revisionNotesText.validate()) {
            this.targetItem = this.dialog.targetItem
            this.targetItem.revision_notes = this.revisionNotes
            await this.$axios.post(`/supervisor/revisionData`, this.targetItem).then(() => {
               this.$store.dispatch('setAlert', {
                  type: 'warning',
                  icon: 'mdi-alert',
                  message: `Data dengan ID <code>${this.targetItem.id}</code> berhasil dikembalikan untuk direvisi`
               })
            }).catch((e) => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  icon: 'mdi-alert',
                  message: e
               })
            }).finally(() => {
               this.closeDialog()
               this.$store.dispatch('showAlert')
               this.$emit('submit')
            })
         }
      },
      
      closeDialog() {
         if (this.dialog.type === 'revision') {
            this.$refs.revisionNotesText.reset()
         }
         this.$store.dispatch('closeDialog')
      }
   },
}
</script>