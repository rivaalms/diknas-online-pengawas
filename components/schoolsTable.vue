<template>
<div>
   <!-- //SECTION - Schools table -->
   <v-data-table
      :headers="headers"
      :items="items"
      :page.sync="current"
      :loading="loading"
      hide-default-footer
      class="mb-3"
   >
      <!-- //SECTION - Action Buttons -->
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
         <v-tooltip top color="black">
            <template #activator="{on, attrs}">
               <v-btn
                  v-bind="attrs"
                  icon
                  class="me-2"
                  color="cyan"
                  v-on="on"
                  @click="dialog(item)"
               >
                  <v-icon>mdi-eye-outline</v-icon>
               </v-btn>
            </template>
            <span>Lihat detail</span>
         </v-tooltip>
      </template>
      <!-- //!SECTION -->
   </v-data-table>
   <div v-if="items" class="d-flex justify-space-between align-center">
      <p class="text-caption mb-0">
         {{ from }}-{{ to }} dari {{ total }} data
      </p>
      <v-pagination
         v-model="current"
         :length="totalPage"
         total-visible="7"
         prev-icon="mdi-menu-left"
         next-icon="mdi-menu-right"
         @input="dataHandler()"
      ></v-pagination>
   </div>
   <!-- //!SECTION -->

   <lazy-school-dialog/>
</div>
</template>

<script>
export default {
   props: {
      headers: {
         type: Array,
         default: () => {}
      },
      items: {
         type: Array,
         default: () => {}
      },
      currentPage: {
         type: Number,
         default: 0
      },
      loading: {
         type: Boolean,
         default: false
      },
      from: {
         type: Number,
         default: 0
      },
      to: {
         type: Number,
         default: 0
      },
      total: {
         type: Number,
         default: 0
      },
      totalPage: {
         type: Number,
         default: 0
      }
   },

   data() {
      return {
         current: this.currentPage ? this.currentPage : 1,

         teacherItems: []
      }
   },

   methods: {
      dialog(item) {
         this.$store.dispatch('setDialog', {
            type: 'school',
            title: `Detail Statistik ${item.name}`,
            item,
         })
         this.$store.dispatch('showDialog')
      },
   }
}
</script>