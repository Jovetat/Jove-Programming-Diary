/* 
    官方文档中推荐配置此文件写法
        store/index.js      我不理解，故依旧采用民间写法

    该文件用于创建 Vuex 中最为核心的 store
*/

// 引入 Vuex，Vue
import Vuex from 'vuex'
import Vue from 'vue'
// 应用插件
Vue.use(Vuex)
// 准备 actions 对象 —— 响应组件中的动作
const actions = {
    addSum(context,value){
        console.log('actions addSum被调用')
        context.commit('ADDSUM',value)
    },
    sunSum(context,value){
        context.commit('SUBSUM',value)
    },
    oddAdd(context,value){
        // 调用其他动作
        /* if(context.state.sum % 2 != 0){
            context.commit('ADDSUM',value)
        } */
        context.dispatch('demo',value)
    },
    demo(context,value){
        console.log('被动作调用的动作')
        if(context.state.sum % 2 != 0){
            context.commit('ADDSUM',value)
        }
    },
    addWait(context,value){
        // 延时++
        setTimeout(()=>{
            context.commit('ADDSUM',value)
        },500)
    }
}
// 准备 mutations 对象 —— 修改 state 中的数据
const mutations = {
    ADDSUM(state,value){
        console.log('mutations ADDSUM被调用')
        state.sum += value
    },
    SUBSUM(state,value){
        state.sum -= value
    }
}
// 准备 state 对象 —— 保存具体的数据
const state = {
    sum: 0,                     // 当前的和
    song: '红颜如霜'
}
// 准备 getters 对象 —— 加工呈现数据
const getters ={
    bigsum(state){
        return state.sum * 10
    }
}


// 创建并暴露 store
export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})


/* 
    Vuex 简介                                                          https://github.com/vuejs/vuex
        1. 概念：
            (1) 在 Vue 中实现集中式 状态(数据) 管理的一个 Vue 插件
            (2) 对 Vue 应用中多个组件的共享状态进行集中式的管理（读/写）
            (3) 是一种组件间通信的方式，且适用于任意组件间通信
        2. 作用
            多组件的数据共享(共同读写)
        3. 什么时候使用 Vuex
            (1) 多组件依赖同一状态
            (2) 来自不同组件的行为需要变更同一状态
        4. Vuex 工作原理
            查看 48_Vuex工作原理图 理解

    使用 Vuex
        1. 搭建 Vuex 的使用环境
            1) 安装
                npm i vuex
                (vue2 使用 vuex3版本，vue3 使用 vuex4版本)

            2) 创建 store
                在 store.js/index.js 中
                (0) 引入 Vuex： import Vuex from 'vuex'
                    引入 Vue：  import Vue  from 'vue'
                (1) 应用 Vuex 插件
                    Vue.use(Vuex)
                    a、在这里应用插件而不是在 main.js 中应用的原因时(这里为应用插件上面(0)需引用 Vue)
                        Vuex 规定需在 Vue.use(Vuex) 之后构造 store，而 js 文件执行顺序导致无法在 main 中按顺序执行
                        (扫描文件所有的 import 语句并汇总到最上方执行，所有 import 会最优先执行)
                    b、使用插件后才可以在创建 vm 的过程中配置 store 项，否则 store 不会挂载于 vm/vc(无法被所有组件获取，就更无法通信)
                        [Vue 不认识配置的项在创建过程中直接忽略，应用插件后就可以配置 store 了，挂载在所有 vm/vc 上]
                (2) 准备 actions 对象 —— 响应组件中的动作
                    const actions = {}
                (3) 准备 mutations 对象 —— 修改 state 中数据
                    const mutations = {}
                (4) 准备 state 对象 —— 存储数据
                    const state = {}
                (5) 创建并暴露 store    (key与value重名，这里简写了)
                    export default new Vuex.Store({
                        actions,
                        mutations,
                        state,
                        (getter 非必须配置项)
                    })
                (6) 在 main.js 创建 vm 时传入 store 配置项
                    import store from './vuex/store'或'./store/index'                   (这里关于文件命名此后就不再多提了)
                    new Vue({ ... store, ... })

            3) 初始化数据
                (1) 在 state 中配置 数据
                    state = { data }
                (2) 在 actions 中配置 动作
                    actions = {
                        动作名(context, value){
                            a、参数
                                context -- 迷你版的store，封装了：
                                    commit --> 提交
                                    dispatch --> 调用后其他动作
                                    state --> 当前数据[有时需根据当前数据做判断]，虽然这里可以对数据直接操作，但请不要这样做
                                value：     数据更改传来的值
                            b、可以执行提交给 Mutations
                                context.commit('加工名',value)
                                    这里加工名一般使用大写的动作名，这样便于区分
                            c、动作内可以调用其他动作
                        }
                    }
                (3) 在 mutations 中配置 加工
                    mutations = {
                        加工名(state,value){
                            a、加工名使用动作名的全大写形式
                            b、参数
                                state：     Vuex 存储的数据 (Vuex对State做了数据代理)
                                value：     数据更改传来的值
                            c、执行对数据的实际操作
                                state.数据名 =  ... 
                        }
                    }
                (4) getters 加工呈现数据(相当于 Vuex 内的计算属性)
                    a、*非必须配置项
                    b、在 store.js 追加 getters 配置
                        const getters = {
                            getter名(state){
                                return 加工后的值(eg: state.sum *10)
                            }
                        }
                    c、创建 store 中添加 getters 配置
                    d、组件中读取 getter
                        $store.getters.getter名


        2. 组件中使用 Vuex 中的数据
            1) 组件中读取 Vuex.state 中的数据
                $store.state.数据名
            2) 组件中读取 Vuex.getters 中的数据
                $store.getters.getter名
            3) 组件中修改 Vuex 中的数据
                (1) 通过 actions 修改数据
                    this.$store.dispatch('动作名',数据)         动作名为 actions 中的方法名
                (2) 越过 actions 修改数据
                    this.$store.commit('加工名',数据)           加工名为 mutations 中的方法名
                (3) 若没有网络请求或其他业务逻辑，组件中也可以越过 actions，直接编写 commit
        
        3. map 方法的使用
            1) mapState
                作用
                    用于组件映射 state 中的数据为计算属性(自己写也可以，这样写会一次映射多个，较为方便，mapGetters同)
                使用方式
                    (1) import {mapState} from 'vuex'
                    computed: {
                        (2) 对象写法 (指定计算属性名)
                            ...mapState({ 计算属性名1:'state数据名1', school:'school', …… }),
                        (3) 数组写法 (默认计算属性名为 state 数据名)
                            ...mapState([ 'state数据名1', 'school', ……]),
                        (4) ... 为扩展运算符，将对象中属性拆开放入 computed
                    }
                    (5) 虽然映射为计算属性了，但在 Vue 开发者工具中数据显示为 vuex bindings
                    
            2) mapGetters
                作用
                    用于组件映射 getters 中的数据为计算属性
                使用方式
                    (1) import {mapGetters} from 'vuex'
                    computed: {
                        (2) 对象写法 (指定计算属性名)
                            ...mapGetters({ 计算属性名1:'getters数据名1', bigsum:'bigsum', …… }),
                        (3) 数组写法 (默认计算属性名为 getters数据名)
                            ...mapGetters([ 'getters数据名1', 'bigsum', ……]),
                        (4) ... 为扩展运算符，将对象中属性拆开放入 computed
                    }
                    (5) 数据仍在 Vue 开发者工具内显示为 vuex bindings

            3) mapActions
                作用
                    用于组件映射 actions 中的动作为 methods中的函数，将函数调用映射到动作调用，这样调用事件就会直接去调用动作
                        调用函数(事件传参){} --> $store.dispatch('被映射动作',事件传参)
                使用方式
                    (1) import {mapActions} from 'vuex'
                    methods: {
                        (2) 对象写法 (指定函数名)
                            ...mapActions({ 函数名1:'actions动作名1', oddAdd:'oddAdd', …… }),
                        (3) 数组写法 (默认函数名为 actions动作名)
                            ...mapActions([ 'actions动作名1', 'oddAdd', ……]),
                        (4) ... 为扩展运算符，将函数 拆开放入 methods
                    }
                    (5) 使用时，若函数需要传递参数，在模板中绑定事件时传递参数，否则传入参数为默认的 event

            4) mapMutations
                作用
                    用于组件映射 mutations 中的加工为 methods中的函数，将函数调用映射到加工调用，这样调用事件就会直接去调用加工
                        调用函数(事件传参){} --> $store.commit('被映射加工',事件传参)
                使用方式
                    (1) import {mapMutations} from 'vuex'
                    methods: {
                        (2) 对象写法 (指定函数名)
                            ...mapMutations({ 函数名1:'mutations加工名1', increment:'increment', …… }),
                        (3) 数组写法 (默认函数名为 mutations加工名)
                            ...mapMutations([ 'mutations加工名1', 'increment', ……]),
                        (4) ... 为扩展运算符，将函数 拆开放入 methods
                    }
                    (5) 使用时，若函数需要传递参数，在模板中绑定事件时传递参数，否则传入参数为默认的 event


        4. Vuex 开发者工具
            Inspector --> Vuex              观察数据变化
            Timeline --> Vuex Actions       观察动作事件
            Timeline --> Vuex Mutations     观察加工事件
            
            可以在时间线窗口观看页面由事件引起的变化(按照时间顺序)

*/