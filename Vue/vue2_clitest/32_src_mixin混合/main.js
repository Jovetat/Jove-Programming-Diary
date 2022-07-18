
import Vue from 'vue'
import App from './App.vue'
// 1、全局引入混合
import {hunhe,hunhe2} from './mixin'
// 2、全局混入
/* Vue.mixin(hunhe)
Vue.mixin(hunhe2) */

Vue.config.productionTip = false

new Vue({
    el: '#app',
    render: h => h(App)
})