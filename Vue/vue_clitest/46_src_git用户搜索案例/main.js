
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    // 初始化全局事件总线
    beforeCreate(){
        Vue.prototype.$bus = this
    },
    render: h => h(App)
})