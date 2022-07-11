
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
    el: '#app',
    beforeCreate(){
        Vue.prototype.$bus = this
    },
    render: h => h(App)
})

/* 
    全局事件总线(GlobalEventBus)        $bus

        1. 定义：
            一种组件间通信的方式，适用于 任意组件间通信 
            (并非 Vue 中提供，而是一种通讯常用的解决办法)
        
        2. 原理：
            根据 28_一个重要的内置关系 VueComponent.prototype.__proto__ === Vue.prototype 和 $on/$off/$emit
            (1) 通过在 Vue.prototype 上挂载属性可以让所有组件都获取到
            (2) 只有 vm/vc 才可以触发 $on/$off/$emit 将 vm 挂载在 Vue.prototype 上
                (将这个挂载的 vm 称为 $bus[习惯这么命名，可改但没必要]，bus 是总线的含义，$是为了迎合 Vue 的设计)
                (挂载 vc 也可以，只是挂载 vm 不需要构造组件等，比较方便)
            (3) 在需接收数据的组件上为 $bus 绑定自定义事件，在需发送数据的组件上，触发 $bus 上对应的事件并传递参数
            (4) 数据就会传入到 $bus 绑定自定义事件的函数内，而 $bus 绑定自定义事件是在 接收数据的组件 内完成，所以数据就成功接收了
            (5) 这样挂载在 Vue.prototype 上的 $bus 就可以称为所有组件数据沟通的中转站，也就是 全局事件总线

        3. 初始化全局事件总线：

            new Vue({
                ......
                beforeCreate() {
                    Vue.prototype.$bus = this
                    // 安装全局事件总线，$bus 挂载当前应用的 vm
                },
            }) 

        4. 使用事件总线：

            (1) 接收数据：A 组件想接收数据，则在 A 组件中给 $bus 绑定自定义事件，事件的 回调留在A组件自身

                methods(){
                    demo(data){ ...... }
                }
                ......
                mounted() {
                    this.$bus.$on('xxxx',this.demo)
                }

                或者直接
                methods(){
                    this.$bus.$on('xxxx',(data)=>{ ...... })    
                }

            (2) 发送数据：
                this.$bus.$emit('xxxx',数据)        直接出发时间

        5. 最好在 beforeDestroy 钩子中，用 $off 去解绑 当前组件所用到的 事件
            (1) this.$bus.$off('xxxx')
            (2) 这样在被销毁的组件使用过的自定义事件就会重新空出来，不占用 $bus 的位置
                (而先前组件自定义事件不需要解绑是因为自定义事件被需接收数据的组件绑定在自身上，当自身销毁时会自动销毁自身自定义事件
                现在自定义事件被绑定在 $bus 上，而 $bus 需一直存在，所以需手动销毁自定义事件)
        
        6. 全局事件总线在 Vue 开发者工具内看到的触发的对象为 Root

*/