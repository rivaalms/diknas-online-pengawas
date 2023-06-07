<template>
<v-card-text>
   <p>Anda yakin ingin mengembalikan data <code>{{ data.id }}</code> untuk direvisi?</p>
   <v-form
      ref="revisionNoteText"
      @submit.prevent
   >
      <v-textarea
         v-model="revisionNote"
         auto-grow
         label="Catatan revisi"
         :rules="textareaRules"
      />
   </v-form>
   <div class="d-flex justify-between justify-md-end">
      <v-btn
         class="me-2 flex-grow-1 flex-md-grow-0"
         text
         @click.stop="closeDialog"
      >
         Batal
      </v-btn>
      <v-btn
         class="white--text"
         color="warning"
         depressed
         :loading="loading"
         @click.stop="revisionData(data, revisionNote)"
      >
         Kembalikan Data
      </v-btn>
   </div>
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
         revisionNote: null,
         loading: false,
      }
   },

   computed: {
      textareaRules() {
         return [v => !!v || 'Wajib diisi']
      }
   },

   methods: {
      closeDialog() {
         this.$emit('close')
      },

      async revisionData(data, note) {
         this.$store.dispatch('clearAlert')
         if (this.$refs.revisionNoteText.validate()) {
            const targetItem = data
            targetItem.revision_notes = note
            this.loading = true
            await this.$axios.post(`/supervisor/revisionData`, targetItem).then(() => {
               this.$store.dispatch('setAlert', {
                  type: 'warning',
                  message: `Data dengan ID <code>${targetItem.id}</code> berhasil dikembalikan untuk direvisi`
               })
            }).catch(e => {
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  message: e
               })
            }).finally(() => {
               this.loading = false
               this.$store.dispatch('showAlert')
               this.$emit('submit')
            })
         }
      }
   }
}
</script>