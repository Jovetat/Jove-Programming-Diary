/* 
    官方文档中推荐配置此文件写法
        store/index.js      vuex 中的介绍使用了民间写法 vuex/store.js

    该文件用于创建 Vuex 中最为核心的 store
*/

// 引入 Vuex，Vue
import Vuex from 'vuex'
import Vue from 'vue'
// 引入 分类模块
import countOptions from './count'
// 应用插件
Vue.use(Vuex)

// 歌曲管理相关的配置
import axios from 'axios'
const songOptions = {
    namespaced: true,
    actions:{
        // 发请求的动作
        addSongServer(context){
            axios.get('https://api.uixsj.cn/hitokoto/get?type=social').then(
                response =>{
                    context.commit('ADD_SONG',{id: Date.now(), lyric: response.data})
                },
                error => {
                    alert(error.message)
                }
            )
        }
    },
    mutations:{
        ADD_SONG(state,value){
            state.songList.push(value)
        }
    },
    state:{
        song: '敢爱敢做',
        songList: [
            {id:'001',lyric:'千吨高温波涛 由你涌起'},
            {id:'002',lyric:'个个笑我太狂 笑我不羁'}
        ],
    },
    getters:{}
}


// 创建并暴露 store
export default new Vuex.Store({
    // 模块化
    modules:{
        countOptions,
        songOptions
    }
})


/* 
    Vuex 模块化 + namespace命名空间

        1. 目的：让代码更好维护，让多种数据分类更加明确，避免命名冲突
            当 Vuex 业务逻辑变多全部写在一起难以维护，并且容易引起 git 版本控制的冲突，所以引入模块化编程
        
        2. vuex 模块化
            1) 分类整合(模块化拆解，将相同类型的相关配置写入一个对象内)
                (1) 直接写在 index.js/store.js 内
                    const 分类模块对象名 = {
                        namespaced: true,                   //开启命名空间
                        actions: { ... },
                        mutations: { ... },
                        state:{ ... },
                        getters: { ...getters(state){ 为局部模块内的state } }
                    }
                (2) 单独的分类模块对象文件 (分类模块名.js)
                    export default {
                        同理  namespaced、actions、state、getters
                    }

            2) 模块引用
                (1) 直接写在 index.js/store.js 内，模块引用
                    const store = new Vuex.Store({
                        modules: {
                            模块引用名1:分类模块对象名1,
                            分类模块对象名2,
                            (默认模块引用名为分类模块对象名)
                            personAbout,
                            ……
                        }
                    })
                (2) 单独的分类模块对象文件引用
                    a、引入分类模块
                        import 分类模块对象名 from './分类模块名.js'
                    b、同理 modules:{ 分类模块对象名,…… }
            
            3) 开启命名空间后，组件内 vuex 的使用
                (0) 相当于在原先的基础上通过不同方式添加了 对应命名空间 的指定
                (1) 读取 state 数据：
                    a、直接读取
                        this.$store.state.分类模块对象名.数据名
                            ( eg:this.$store.state.personAbout.list )
                    b、mapState
                        ...mapState('分类模块对象名',['分类模块对象内数据名1',……,'sum','subject']),
                            ( eg:...mapState('countAbout',['sum','number','countNum']) )
                (2) 调用 dispatch：
                    a、直接调用
                        this.$store.dispatch('分类模块对象名/分类模块对象内动作名',value数据)
                            ( eg:this.$store.dispatch('personAbout/addPersonWang',person) )
                    b、mapActions
                        ...mapActions('分类模块对象名',{组件使用函数名:'分类模块对象内动作名',……]),
                            ( eg:...mapActions('countAbout',{incrementOdd:'jiaOdd',incrementWait:'jiaWait'}) )
                (3) 调用 commit：
                    a、直接调用
                        this.$store.commit('分类模块对象名/分类模块对象内加工名',value数据)
                            ( eg:this.$store.commit('personAbout/ADD_PERSON',person) )
                    b、mapMutations
                        ...mapMutations('分类模块对象名',{组件使用函数名:'分类模块对象内加工名',……]),
                            ( eg:...mapMutations('countAbout',{increment:'JIA',decrement:'JIAN'}) )
                (4) 读取 getters 数据：
                    a、直接读取
                        this.$store.getters['分类模块对象名/getter名']
                            ( eg:this.$store.getters['personAbout/firstPersonName'] )
                    b、mapGetters
                        ...mapGetters('分类模块对象名',['getter名1',……]),
                            ( eg:...mapGetters('countAbout',['bigSum']) )
            
        3. 理解
            1) vuex 最终将分类模块对象挂载在 $store 身上
                所以直接可以按照 ...mapState(['分类模块对象1',……,'countAbout']) 引入分类模块对象
                然后通过 分类模块对象.属性名 的方式调用 state 和 getters

            2) 在所有原先的调用前，添加了对应的命名空间指定
                (1) $store.getters.bigsum --> $store.getters['countOptions/bigsum']
                (2) $store.state.song --> $store.state.songOptions.song
                (3) ...mapState(['sum']) --> ...mapState('countOptions',['sum'])
                (4) ...mapGetters(['bigsum']) --> 、..mapGetters('countOptions',['bigsum'])
                (5) this.$store.dispatch('oddAdd',this.num)
                    --> this.$store.dispatch('countOptions/oddAdd',this.num)
                    this.$store.commit('ADDSUM',this.num)
                    --> this.$store.commit('countOptions/ADDSUM',this.num)
                (6) ...mapActions({oddAdd:'oddAdd',addWait:'addWait'})
                    --> ...mapActions('countOptions',{oddAdd:'oddAdd',addWait:'addWait'})
                    ...mapMutations({increment:'ADDSUM',decrement:'SUBSUM'})
                    --> ...mapMutations('countOptions',{increment:'ADDSUM',decrement:'SUBSUM'})
                
*/