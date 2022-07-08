
/* 
    该文件是整个项目的入口文件
*/
// 引入 vue
import Vue from 'vue'
// import Vue from 'vue/dist/vue' // 引入完整版 Vue 写法
// 引入 App 组件，它是所有组件的父组件
import App from './App.vue'
// 关闭 Vue 的生产提示
Vue.config.productionTip = false
// 创建 Vue 实例对象 --> vm
new Vue({
    // 指定容器
    el: '#app',
    // 将 App 组件放入容器中
    render: h => h(App),                    // 创建组件时只需传入组件一个参数

    /* template: '<App></App>',
    components: { App }, */
    /* 
        原先的写法因为 vue 脚手架中缺少 template 解析器，无法运行所以只能
            1、 使用 render 配置项 (节省打包后的体积)
                new Vue({
                    render(createElement){
                        createElement： render 会传入一个函数型参数，用于创建具体的元素并编写具体的内容
                        return createElement('h1','你好啊')
                    }
                    简写为箭头函数
                        render: h => h('h1','贡巴瓦')
                            (创建组件时只需传入组件一个参数)
                })
            2、 引入完整版的 Vue
                (1) import Vue from 'vue/dist/vue.js'
                (2) 使用残缺版 Vue 的原因
                    以使用精简版节省空间，且缺失的功能可以使用 render 代替
            3、关于不同版本的 Vue：
                (1) 组件中标签类型的 template 有单独的库 vue-template-compiler 解析
                (2) vue.js 与 vue.runtime.xxx.js 的区别
                    1) vue,js 是完整版的 vue，包含：核心功能 + 模板解析器
                    2) vue.runtime.xxx.js 是运行版的 vue，只包含核心功能
                        (默认使用的是带有 es6 的 vue.runtime.esm.js
                        带有 common 的是使用 common 语法而不是 es6 的 Vue 文件)
                (3) 因为 vue.runtime.xxx.js 没有模板解析器，所以不能使用 template 配置项，需要使用
                    render 函数接收到的 createElement 函数去编译具体的内容
    */
})
// 指定容器 }).$mount('#app')，这里使用另一种写法 el(我就乐意这么写)