export const state = () => ({
   isAuth: false,
   api_token: null,

   tableHeader: [
      {
         text: 'ID',
         value: 'id'
      },
      {
         text: 'Nama Sekolah',
         value: 'school.name'
      },
      {
         text: 'Tipe data',
         value: 'data_type.name',
      },
      {
         text: 'Kategori',
         sortable: false,
         value: 'data_category.name',
      },
      {
         text: 'Tahun ajaran',
         value: 'year',
      },
      {
         text: 'Status',
         sortable: false,
         value: 'data_status.name',
      },
      {
         text: 'Terakhir diperbarui',
         value: 'date'
      },
      {
         text: 'Aksi',
         sortable: false,
         value: 'actions',
      },
   ],

   alert: {
      type: null,
      color: null,
      icon: null,
      message: null
   },
   alertTrigger: false,

   dialog: {
      type: null,
      title: null,
   },
   dialogTrigger: false,

   snackbar: {
      color: null,
      text: null,
   },
   snackbarTrigger: false,

   breadcrumb: {
      text: null,
      disabled: true,
      to: null,
   },
})

export const mutations = {
   SET_IS_AUTH(state, payload) {
      state.isAuth = payload
   },
   SET_API_TOKEN(state, payload) {
      state.api_token = payload
   },

   SET_ALERT(state, payload) {
      state.alert = payload
   },
   SHOW_ALERT(state) {
      state.alertTrigger = true
   },
   CLEAR_ALERT(state) {
      state.alert = {
         type: null,
         color: null,
         icon: null,
         message: null
      }
      state.alertTrigger = false
   },

   SET_DIALOG(state, payload) {
      state.dialog = payload
   },
   SHOW_DIALOG(state) {
      state.dialogTrigger = true
   },
   CLEAR_DIALOG(state) {
      state.dialog = {
         type: null,
         title: null
      }
   },
   CLOSE_DIALOG(state) {
      state.dialogTrigger = false
   },

   SET_SNACKBAR(state, payload) {
      state.snackbar = payload
   },
   SHOW_SNACKBAR(state, paylaod) {
      state.snackbarTrigger = true
   },
   CLEAR_SNACKBAR(state) {
      state.snackbar = {
         color: null,
         text: null,
      }
   },
   CLOSE_SNACKBAR(state) {
      state.snackbarTrigger = false
   },

   SET_BREADCRUMB(state, payload) {
      state.breadcrumb = payload
   },
   CLEAR_BREADCRUMB(state) {
      state.breadcrumb = {
         text: null,
         disabled: true,
         href: null,
      }
   }
}

export const actions = {
   nuxtServerInit({commit}, context) {
      commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
      if(context.app.$auth.$state.loggedIn) {
         commit('SET_API_TOKEN', context.app.$auth.$state.user.api_token)
      }
   },

   setAlert({commit}, payload) {
      commit('SET_ALERT', payload)
   },

   showAlert({commit}) {
      commit('SHOW_ALERT')
   },

   clearAlert({commit}) {
      commit('CLEAR_ALERT')
   },

   setDialog({commit}, payload) {
      commit('SET_DIALOG', payload)
   },

   showDialog({commit}) {
      commit('SHOW_DIALOG')
   },

   closeDialog({commit}) {
      commit('CLOSE_DIALOG')
   },

   clearDialog({commit}) {
      commit('CLEAR_DIALOG')
   },

   setSnackbar({commit}, payload) {
      commit('SET_SNACKBAR', payload)
   },

   showSnackbar({commit}) {
      commit('SHOW_SNACKBAR')
   },

   clearSnackbar({commit}) {
      commit('CLEAR_SNACKBAR')
   },

   closeSnackbar({commit}) {
      commit('CLOSE_SNACKBAR')
   },

   setBreadcrumb({commit}, payload) {
      commit('SET_BREADCRUMB', payload)
   }
}