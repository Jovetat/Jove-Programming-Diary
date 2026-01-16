import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import { setupNaive } from './plugins/naive'
import { setupAOS } from './plugins/aos'
import { naiveThemeOverrides } from './config/naive'
import { NConfigProvider } from 'naive-ui'
import '@/styles/global.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

setupNaive(app)
setupAOS()

app.component('NConfigProvider', NConfigProvider)

app.provide('naiveThemeOverrides', naiveThemeOverrides)

app.mount('#app')
