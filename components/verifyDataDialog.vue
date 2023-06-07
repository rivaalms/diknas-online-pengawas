<template>
<v-card-text>
   <p>Anda yakin ingin memverifikasi data <code>{{ data.id }}</code>?</p>
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
         color="success"
         :loading="loading"
         depressed
         @click.stop="verifyData(data)"
      >
         Verifikasi Data
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
         loading: false,
      }
   },

   methods: {
      closeDialog() {
         this.$emit('close')
      },

      async verifyData(data) {
         this.$store.dispatch('clearAlert')
         this.loading = true
         await this.$axios.post(`/supervisor/verifyData`, data).then(() => {
            this.$store.dispatch('setAlert', {
               type: 'success',
               message: `Data dengan ID <code>${data.id}</code> berhasil diverifikasi`
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
</script>