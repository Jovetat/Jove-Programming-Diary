
import Vue from 'vue'
import App from './App.vue'

// 完整引入
// 引入 Element UI
// import ElementUI from 'element-ui'
// 引入 Element UI 全部样式
// import 'element-ui/lib/theme-chalk/index.css'

// 按需引入，按组件名去掉 el 并按大驼峰命名
import { Button, DatePicker } from 'element-ui'

Vue.config.productionTip = false
// 应用 Element UI (完整引入)
// Vue.use(ElementUI)

// 按需引入全局组件
Vue.component(Button.name, Button);
Vue.component(DatePicker.name, DatePicker);

new Vue({
    el: '#app',
    render: h => h(App),
})