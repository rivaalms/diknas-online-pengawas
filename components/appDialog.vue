<template>
<v-dialog
   v-model="dialogTrigger"
   persistent
   :max-width="width"
>
   <v-card>
      <v-card-title class="justify-space-between">
         <span class="text-subtitle-1 font-weight-medium">{{ dialog ? dialog.title : '' }}</span>
         <v-tooltip
            left
            color="black"
         >
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
      
      <lazy-school-dialog
         v-if="dialog && dialog.type === 'school'"
         :data="dialog.item"
         @close="closeDialog"
      />

      <lazy-verify-data-dialog
         v-if="dialog && dialog.type === 'verify'"
         :data="dialog.data"
         @close="closeDialog"
         @submit="submit"
      />

      <lazy-revision-data-dialog
         v-if="dialog && dialog.type === 'revision'"
         :data="dialog.data"
         @close="closeDialog"
         @submit="submit"
      />

      <lazy-revision-note-list-dialog
         v-if="dialog && dialog.type === 'notes'"
         :data="dialog.data"
      />

      <lazy-logout-dialog
         v-if="dialog && dialog.type === 'logout'"
         @close="closeDialog"
      />
      
   </v-card>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
   data() {
      return {
         width: null,
      }
   },
   
   computed: {
      ...mapState(['dialog', 'dialogTrigger']),
   },

   watch: {
      dialogTrigger() {
         if (this.dialogTrigger) {
            switch (this.dialog.type) {
               case 'verify':
               case 'revision':
               case 'logout':
                  this.width = 500
                  break
               case 'notes':
                  this.width = 700
                  break
               default:
                  break
            }
         }
      }
   },

   methods: {
      closeDialog() {
         this.$store.dispatch('closeDialog')
         this.$store.dispatch('clearDialog')
      },
      
      submit() {
         this.closeDialog()
         this.$emit('submit')
      }
   }
}
</script>