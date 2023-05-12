<template>
<v-dialog
   v-model="dialogTrigger"
   max-width="500px"
   persistent
>
      <v-card v-if="dialog && dialog.type === 'verify'">
         <v-card-title>Verifikasi data?</v-card-title>
         <v-card-text>
            Anda yakin ingin memverifikasi data <code>{{ dialog ? dialog.targetItem.id : '' }}</code>?
         </v-card-text>
         <v-card-text class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialog">Batal</v-btn>
            <v-btn color="green darken-2" depressed class="white--text" @click.stop="verifyData">Verifikasi Data</v-btn>
         </v-card-text>
      </v-card>

      <v-card v-if="dialog && dialog.type === 'revision'">
         <v-card-title>Kembalikan data untuk direvisi?</v-card-title>
         <v-card-text>
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
         </v-card-text>
         <v-card-text class="d-flex justify-end">
            <v-btn class="me-2" text @click="closeDialog">Batal</v-btn>
            <v-btn color="deep-orange darken-1" depressed class="white--text" @click.stop="revisionData">Kembalikan Data</v-btn>
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
         targetItem: {},
      }
   },

   computed: {
      ...mapState(['dialog', 'dialogTrigger']),

      textareaRules() {
         return [v => !!v || 'Wajib diisi']
      }
   },

   methods: {
      async verifyData() {
         this.$store.dispatch('clearAlert')
         await this.$axios.post(`/supervisor/verifyData`, this.dialog.targetItem).then(() => {
            this.$store.dispatch('setAlert', {
               type: 'success',
               color: 'green darken-2',
               icon: 'mdi-check',
               message: `Data dengan ID <code>${this.dialog.targetItem.id}</code> berhasil diverifikasi`
            })
         }).catch((e) => {
            this.$store.dispatch('setAlert', {
               type: 'error',
               color: 'red darken-2',
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
                  type: 'success',
                  color: 'deep-orange darken-1',
                  icon: 'mdi-alert',
                  message: `Data dengan ID <code>${this.targetItem.id}</code> berhasil dikembalikan untuk direvisi`
               })
            }).catch((e) => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  color: 'red darken-1',
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
         this.$store.dispatch('closeDialog')
      }
   },
}
</script>