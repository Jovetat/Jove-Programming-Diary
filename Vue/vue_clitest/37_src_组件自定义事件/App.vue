<template>
    <div>
        <h1>{{msg}},{{lyric}}</h1>
        <!-- 通过父组件给子组件传递函数类型的 props 实现 子给父传递数据 -->
        <Song :singerEvent="getLyric"/>

        <!-- 通过父组件给子组件绑定自定义事件，实现 子给父传递数据(通过 @/v-on) -->
        <!-- <Singer v-on:singerEvent="getLyric"/> -->

        <!-- 通过父组件给子组件绑定自定义事件，实现 子给父传递数据(通过 ref) -->
        <Singer ref="singervm" @click.native="show"/>
        <hr>
    </div>
</template>

<script>
    import Singer from './components/Singer.vue'
    import Song from './components/Song.vue'

    export default {
        name: 'App',
        data() {
            return {
                msg:'年轮说',
                lyric: ''
            }
        },
        methods: {
            getLyric(lrc){
                console.log('App 收到：' + lrc)
                this.lyric = lrc
            },
            show(){
                alert('不许摸')
            }
        },
        mounted() {
            // 绑定自定义事件
            // this.$refs.singervm.$on('singerEvent',this.getLyric)
            this.$refs.singervm.$on('singerEvent',function(lrc){
                console.log(this)           // 这里 this 为绑定自定义组件的 vc ！！！
            })
        },
        components: {
            Song,
            Singer
        },
    }

    /* 
        组件自定义事件        (为方便表述，以下父组件简称为 f，子组件简称为 s)
        开发者工具 timeline component events 中会展示被调用的组件自定义事件
            1. 组件自定义事件的作用:
                一种组件间通信的方式，适用于：s --> f 通信
                s 给 f 传数据，要在 f 中给 s 绑定自定义事件，且事件的回调在 f 中

            2. 绑定自定义事件的方式:
                1) v-on ( @ )
                    <son-vue v-on:事件名="回调fun"/> ( <son-vue @事件名="回调fun"/> )
                2) ref
                    (1) <son-vue ref="组件实例 sonvc"/>
                    (2) 在 mounted 时向 s 挂载回调fun
                        mounted(){
                            a、this.$refs.sonvc.$on('事件名',this.回调fun)              建议还是这样写
                                this 指向 自身组件实例对象(vm)
                                    (this 先因触发函数指向 vc，后因 回调fun 由 Vue 管理 所以 this 又指向 自身组件实例对象(vm)
                            b、this.$refs.sonvc.$on('事件名',function(接收参数 ……){ console.log(this) })
                                    *this 指向为 绑定自定义组件的 vc
                                    (Vue 中规定，this 指向触发函数的组件且此函数不受 Vue 管理，所以指向 vc)
                            c、this.$refs.sonvc.$on('事件名',(接收参数 ……)=>{ console.log(this) })
                                this 指向 自身组件实例对象(同外部 this)
                        }

            3. s 内触发自定义事件 (给哪个组件绑定事件找哪个组件触发事件)
                1) 调用组件的自定义事件向 f 发送数据
                    this.$emit('事件名',传递参数1, ……)
                2) 参数都可发多个

            4. f 内的接收方式
                methods(){
                    回调fun(接收参数1, …… , ...params){
                        参数可接收多个(...params 接收其余参数放入数组)
                    }
                }
            
            5. s 向 f 发送数据原理
                1) 为组件绑定自定义事件相当于为 s 的 vc 上添加了该事件
                2) 通过 this.$emit() 触发事件并传递参数
                3) 2 ~ 4 为 s 向 f 发送的过程
            
            6. 解绑自定义事件
                (1) 解绑 单个 自定义事件
                    this.$off('事件名')
                (2) 解绑 多个 自定义事件
                    this.$off(['事件名1','事件名2', ……])
                (3) 解绑 全部 自定义事件
                    this.$off()
                (4) 销毁后组件的自定义事件也会全部失效
                    this.$destory()
            
            7. 若想让自定义事件只能触发一次
                1) v-on ( @ )       使用 once 修饰符
                2) ref              this.$refs.sonvc.$once('事件名',this.回调fun) 方法
            
            8. 组件上也可以绑定原生 DOM 事件 (@click……)
                1) 如果直接写会被认做为组件自定义事件
                2) 需要使用 native 修饰符
                    eg: @click.native="事件名"
                3) 原理：
                    会将该事件交给组件的根元素绑定
            
            9. f 向 s 组件通信

                其他方式：
                1) 通过 props
                    (1) 原理
                        f 向 s 通过 props 传递函数，s 调用函数时，f 函数内就可以收到 s 调用函数时传入的形参
                    (2) 格式：
                        f：<Song :singerEvent="getLyric"/>    methods:{ getLyric(lrc){ 读传入的 lrc 就是 this.lyric1 } }
                        s：props: ['singerEvent'] 然后调用 this.singerEvent(this.lyric1)

                通过组件的自定义事件：
                2. v-on:事件名="回调fun"
                    (1) 原理：v-on 为 s 绑定事件，就是给 s 的 vc 绑定了该事件，s 内调用时，传入的参数就会被 App 内函数拿到
                    (2) 格式：
                        f：<Singer v-on:singerEvent="getLyric"/>  methods:{ getLyric(lrc){ 读 lrc } }
                        s：触发 vc 身上的 singerEvent 事件 --> this.$emit('singerEvent',lrc)

                3. ref="回调fun"
                    (1) 原理：通过获取到 s 的 vc，然后在 mounted周期 为 vc 绑定事件，在 vc 中用相同方式调用
                    (2) 格式：
                        f:  <Singer ref="singervm"/>   methods:{ getLyric(lrc){ 读 lrc } }
                            mounted(){ this.$refs.singervm.$on('singerEvent',getLyric)}  当 singerEvent 调用后触发回调 getLyric
                        s：触发 vc 身上的 singerEvent 事件 --> this.$emit('singerEvent',lrc)
                    (3) ref 优势
                        *灵活性强，可以随时向 s 绑定事件，而其余两种方式会在初始时便绑定事件

            10. 注：
                通过 this.$refs.xxx.$on('事件名',回调) 绑定自定义事件时，回调配置在 methods 中或用箭头函数，否则 this 指向会出问题

    */

</script>