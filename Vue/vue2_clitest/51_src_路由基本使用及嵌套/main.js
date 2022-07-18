
import Vue from 'vue'
import App from './App.vue'

// 引入 vue-router
import VueRouter from 'vue-router'
// 引入路由器
import router from './router/index'

Vue.config.productionTip = false

// 应用插件
Vue.use(VueRouter)

new Vue({
    el: '#app',
    render: h => h(App),
    router
})