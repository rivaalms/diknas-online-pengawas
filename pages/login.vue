<template>
   <div id="container">
      <v-row dense>
         <v-col cols="6" class="bg-primary d-flex flex-column justify-center" align-self="stretch">
            <v-container class="mw-75 mb-12 pb-12">
               <div class="d-flex justify-center mb-6">
                  <p class="text-h4 white--text font-weight-bold">{{ project_name }}</p>
               </div>
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
                        ></v-text-field>
                  
                        <v-text-field
                           v-model="password"
                           dark
                           :rules="rules"
                           label="Password"
                           type="password"
                           required
                        ></v-text-field>
                        <div class="d-flex justify-end">
                           <v-btn depressed type="submit" color="yellow accent-4" class="mt-5">Login</v-btn>
                        </div>
                     </v-form>
                  </v-card-text>
            
               </v-card>
            </v-container>
         </v-col>
         <v-col cols="6" class="d-flex flex-column justify-center align-center bg-light" align-self="stretch">
            <v-img
               width="75%"
               contain
               src="/Metrics-pana.svg"
            ></v-img>
            <p class="text-caption ma-0 align-self-end">Illustration by <a href="https://storyset.com">Storyset</a></p>
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
            await this.$auth.loginWith('local', {
               data: {
                  nip: this.nip,
                  password: this.password
               }
            }).then((resp) => {
               this.SET_IS_AUTH(true)
               this.$router.push('/')
            }).catch((error) => { return error })
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
   }
}
</script>

<style>
#container {
   min-height: 100%!important;
   padding: 0;
   display: flex;
   justify-content: center;
   align-items: stretch;
}

/* .row {
   height: inherit!important;
} */

.bg-primary {
   background-color: #26A69A;
}

.bg-light {
   background-color: #f5f5f5;
}

.mw-75 {
   max-width: 75%;
}

.v-application .error--text {
   color: #FFCDD2!important;
   caret-color: #FFCDD2!important;
}
</style>