// 引入的不再是 Vue 构造函数了，引入的是一个名为 createApp 的工厂函数
import { createApp } from 'vue'
import App from './App.vue'

// vue3 写法，创建应用示例对象 —— app (类似于之间 vue2 中的 vm，但 app 比 vm 更"轻")
const app = createApp(App)
console.log(app)
// mount 指定容器，挂载
app.mount('#app')
// 卸载
/* setTimeout(()=>{
    app.unmount('#app')
},2000) */

/* 
    原先写法
    const vm = new Vue({
        render: h => h(App),
    })
    vm.$mount('#app')
*/