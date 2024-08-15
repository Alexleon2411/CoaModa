import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import router from './router';
import { createPinia } from 'pinia';
// Firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firebase'
// vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
//formit
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config';
import axios from 'axios';


// configuracin de axios
const origins = 'http://localhost:3000';
axios.defaults.baseURL = origins;

const pinia = createPinia();
const app = createApp(App)

//vuetify
const vuetify = createVuetify({
  components,
  directives
})

//firebase
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})
app.use(axios);
app.use(vuetify)
app.use(plugin, defaultConfig(config))
app.use(router)
app.use(pinia)
app.mount('#app')
