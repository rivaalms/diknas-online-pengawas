<template>
<v-navigation-drawer
   v-model="drawer"
   clipped
   app
   mobile-breakpoint="960"
>
   <v-list dense nav>
      <v-list-item
         v-if="isMobile"
      >
         <v-list-item-title class="text-subtitle-1">diknas-online-pengawas</v-list-item-title>
         <v-list-item-action>
            <v-btn icon @click.stop="drawer = !drawer">
               <v-icon>mdi-menu</v-icon>
            </v-btn>
         </v-list-item-action>
      </v-list-item>

      <v-list-item-group active-class="primary--text">
         <template v-for="(item, i) in routes">
            <template v-if="item.child">
               <v-list-group
               :key="item.title"
               :append-icon="submenuIcon"
               >
                  <template #activator>
                     <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                     </v-list-item-icon>

                     <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                     </v-list-item-content>
                  </template>

                  <template v-for="(child, j) in item.child">
                     <v-list-item :key="j" :to="{name: 'category-slug', params: {slug: child.to}}" router exact>
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-content>
                           <v-list-item-title>{{ child.title }}</v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                  </template>
               </v-list-group>
            </template>

            <template v-else>
               <v-list-item
                  :key="i"
                  :to="item.to"
                  router exact
               >
                  <v-list-item-icon>
                     <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                     <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
               </v-list-item>
            </template>
         </template>
      </v-list-item-group>
   </v-list>

   </v-navigation-drawer>
</template>

<script>
export default {
   props: {
      sidebar: {
         type: Boolean,
         default: false
      }
   },

   data() {
      return {
         routes: [
            {
               icon: 'mdi-view-dashboard',
               title: 'Dashboard',
               to: '/',
               child: null,
            },
            {
               icon: 'mdi-bookshelf',
               title: 'Kategori',
               to: 'category',
               child: []
            },
            {
               icon: 'mdi-school',
               title: 'Statistik Sekolah Binaan',
               to: '/schools',
               child: null
            }
         ],
         categories: [],
         submenuIcon: 'mdi-chevron-down',
         drawer: false,
         isMobile: false,
      }
   },

   watch: {
      sidebar() {
         if (this.sidebar === true) {
            this.drawer = this.sidebar
         }
      },

      drawer() {
         this.checkIsMobile()

         if (this.drawer === false || window.innerWidth >= 960) {
            this.$emit('toggle-sidebar')
         }
      }
   },

   mounted() {
      this.fetchCategories()
      this.checkIsMobile()
      if (!this.isMobile) {
         this.drawer = true
      }
   },

   methods: {
      async fetchCategories() {
         await this.$axios.get('/getCategories').then((response) => {
            const categories = []
            response.data.data.forEach(function(item) {
               categories.push({
                  title: item.name,
                  to: item.slug
               })
            })
      
            this.routes.forEach(function(item) {
               if (item.title === "Kategori") {
                  item.child = categories
               }
            })
         })
      },

      checkIsMobile() {
         if (window.innerWidth >= 960) {
            this.isMobile = false
         } else this.isMobile = true
      }
   }
}
</script>