<template>
  <v-app>
    <v-navigation-drawer
      v-if="isAuth"
      v-model="drawer"
      class="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
    <div class="h-100 d-flex flex-column justify-space-between">
      <v-list dense>
        <template v-for="(item, i) in items">
          <template v-if="item.child">
              <v-list-group
                :key="item.title"
                :append-icon="submenuIcon"
              >
                <template #activator>
                  <v-list-item-icon @click="miniVariant = false">
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
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
        <v-list-item
        to="/students"
        router
        exact
        >
          <v-list-item-icon>
            <v-icon>mdi-account-school</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Data Statistik Siswa</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
        to="/teachers"
        router
        exact
        >
          <v-list-item-icon>
            <v-icon>mdi-human-male-board</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Data Statistik Guru</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


      </v-list>

      <v-menu offset-y top>
        <template #activator="{on, attrs}">
          <v-list dense>
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ user.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
        <v-list>
          <v-list-item
            @click.stop="logout"
          >
            <v-list-item-title class="red--text">Keluar</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            to="/profile"
            router exact
          >
            <v-list-item-title>
              Profil
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  
    </v-navigation-drawer>

    <v-app-bar
      v-if="isAuth"
      :clipped-left="clipped"
      fixed
      app
      flat
    >
      <v-app-bar-nav-icon class="d-none d-lg-block" @click.stop="miniVariant = !miniVariant" />
      <v-app-bar-nav-icon class="d-block d-lg-none" @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    
    <v-main>
      <Nuxt/>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'DefaultLayout',
  
  data() {
    return {
      clipped: true,
      drawer: false,

      user: {name: ''},
      
      items: [
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
      ],
      categories: [],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'SIPADI',
      submenuIcon: 'mdi-chevron-down'
    }
  },

  computed: {
    ...mapState(['isAuth']),

    dListGroup() {
      let display = ''
      if (this.miniVariant === false) {
        display = 'd-none'
      }
      return display
    },
  },

  created() {
    if (process.browser < 960) {
      this.miniVariant = false
    } else {
      this.drawer = false
    }
  },
  
  mounted() {
    if (window.innerWidth < 960) {
      this.miniVariant = false
    } else {
      this.drawer = false
    }

    if (this.isAuth) {
      this.fetchCategories()
      this.user = this.$auth.user
    }

  }, 

  methods: {
    ...mapMutations(['SET_IS_AUTH']),

    async logout() {
        await this.$auth.logout()
        this.SET_IS_AUTH(false)
        this.$router.push('/login')
    },
    
    async fetchCategories() {
      await this.$axios.get('/getCategories').then((response) => {
        const categories = []
        response.data.data.forEach(function(item) {
          categories.push({
            title: item.name,
            to: item.slug
          })
        })
  
        this.items.forEach(function(item) {
          if (item.title === "Kategori") {
            item.child = categories
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>