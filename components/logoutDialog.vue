<template>
<v-card-text>
   <p class="text-body-1">Anda yakin ingin keluar?</p>
   <div class="d-flex justify-end">
      <v-btn
         class="me-2"
         text
         @click.stop="closeDialog"
      >
         Batal
      </v-btn>
      <v-btn
         class="white--text"
         color="red darken-2"
         depressed
         :loading="loading"
         @click.stop="logout"
      >
         Keluar
      </v-btn>
   </div>
</v-card-text>
</template>

<script>
export default {
   data() {
      return {
         loading: false,
      }
   },

   methods: {
      closeDialog() {
         this.$emit('close')
      },

      async logout() {
         this.loading = true
         await this.$auth.logout().then(() => { this.loading = false })
         this.$store.commit('SET_IS_AUTH', false)
         this.closeDialog()
         this.$router.push('/login')
      }
   }
}
</script>