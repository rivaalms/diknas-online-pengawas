<template>
<v-container>
   <v-row class="justify-center">
      <v-col cols="6">
         <v-card>
            <v-card-text>
               <v-form @submit.prevent="onSubmit">
         
                  <v-text-field
                     v-model="nip"
                     :rules="rules"
                     label="NIP"
                     required
                     @keypress="numberOnly"
                  ></v-text-field>
            
                  <v-text-field
                     v-model="password"
                     :rules="rules"
                     label="Password"
                     type="password"
                     required
                  ></v-text-field>
            
                  <v-btn type="submit" color="primary" class="mt-5">Login</v-btn>
         
               </v-form>
            </v-card-text>
      
         </v-card>
      </v-col>
   </v-row>
</v-container>
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
      }
   },
   methods: {
      ...mapMutations(['SET_IS_AUTH']),

      async onSubmit() {
         await this.$auth.loginWith('local', {
            data: {
               nip: this.nip,
               password: this.password
            }
         }).then((resp) => {
            this.SET_IS_AUTH(true)
            this.$auth.setUser({
               nip: this.nip,
               password: this.password,
            })
            this.$router.push('/')
         }).catch((error) => { return error })
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
