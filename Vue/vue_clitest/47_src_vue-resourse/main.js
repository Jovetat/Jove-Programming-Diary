
import Vue from 'vue'
import App from './App.vue'

// 引入 vue-resource
import vueResource from 'vue-resource'

Vue.config.productionTip = false
// 使用插件
Vue.use(vueResource)

new Vue({
    el: '#app',
    // 初始化全局事件总线
    beforeCreate(){
        Vue.prototype.$bus = this
    },
    render: h => h(App)
})