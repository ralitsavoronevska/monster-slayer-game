import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './main.css' // TailwindCSS v4 import

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')