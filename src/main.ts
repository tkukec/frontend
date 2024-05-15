import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import { db, firebaseApp } from './firebase'


const app = createApp(App)


app.use(VueFire, {
  firebaseApp: firebaseApp,
  modules: [VueFireFirestoreOptionsAPI]
})


app.use(router)


app.mount('#app')

