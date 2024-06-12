import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/style.scss'

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')
