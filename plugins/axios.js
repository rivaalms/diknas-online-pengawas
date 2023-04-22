export default function ({ $axios, store }) {
   $axios.setHeader('Content-Type', 'application/json')
   $axios.setHeader('User-Type', 2)
   $axios.setToken(store.state.api_token, 'Bearer')
}