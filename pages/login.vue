<template>
   <div id="container">
      <v-row dense>
         <v-col cols="4" class="bg-primary d-flex flex-column justify-center" align-self="stretch">
            <v-container class="mw-75 mb-12 pb-12">
               <div class="d-flex justify-center mb-6">
                  <p class="text-h4 white--text font-weight-bold">{{ project_name }}</p>
               </div>
               <app-alert/>
               <v-card flat color="transparent">
                  <v-card-text>
                     <v-form ref="form" @submit.prevent="onSubmit">
               
                        <v-text-field
                           v-model="nip"
                           dark
                           :rules="rules"
                           label="NIP"
                           required
                           @keypress="numberOnly"
                           @focus="resetValidation"
                        ></v-text-field>
                  
                        <v-text-field
                           v-model="password"
                           dark
                           :rules="rules"
                           label="Kata Sandi"
                           type="password"
                           required
                           @focus="resetValidation"
                        ></v-text-field>
                        <div class="d-flex justify-end">
                           <v-btn depressed type="submit" :loading="loading" color="yellow accent-4" class="mt-5">Login</v-btn>
                        </div>
                     </v-form>
                  </v-card-text>
            
               </v-card>
            </v-container>
         </v-col>
         <v-col cols="8" class="d-flex flex-column justify-center align-center bg-light" align-self="stretch">
            <v-img
               width="75%"
               contain
               src="/Metrics-pana.svg"
            ></v-img>
            <p class="text-caption ma-0 align-self-end">Illustration by <a href="https://storyset.com" target="_blank">Storyset</a></p>
         </v-col>
      </v-row>
   </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
   auth: 'guest',

   data() {
      return {
         nip: '',
         password: '',
         loading: false,
         
         rules: [
         v => !!v || 'Wajib diisi',
         ],

         project_name: process.env.PROJECT_NAME
      }
   },
   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      async onSubmit() {
         if (this.$refs.form.validate()) {
            this.loading = true
            await this.$auth.loginWith('local', {
               data: {
                  nip: this.nip,
                  password: this.password
               }
            }).then((resp) => {
               this.SET_IS_AUTH(true)
               this.$store.dispatch('clearAlert')
               this.$router.push('/')
            }).catch(() => { 
               this.$store.dispatch('setAlert', {
                  type: 'error',
                  icon: 'mdi-alert-outline',
                  message: 'NIP atau kata sandi yang Anda masukkan tidak cocok dengan kredensial kami'
               })
               this.$store.dispatch('showAlert')
            }).finally(() => {
               this.loading = false
            })
         }
      },

      numberOnly() {
         const e = window.event
         const expect = e.target.value.toString() + e.key.toString();
         if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
            e.preventDefault();
         } else {
            return true;
         }
      },

      resetValidation() {
         this.$refs.form.resetValidation()
      }
   }
}
</script>

<style>
#container {
   min-height: 100%!important;
   padding: 0;
   overflow: hidden;
   display: flex;
   justify-content: center;
   align-items: stretch;
}

.bg-primary {
   background-color: #2979FF;
}

.bg-light {
   background-color: #f8f9fa;
}

.mw-75 {
   max-width: 75%;
}

.v-application .error--text {
   color: #D50000!important;
   caret-color: #D50000!important;
}
</style>