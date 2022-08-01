<template>
    <div class="demo">
        <h2>{{name}}</h2>
        <h2>{{works}}</h2>
    </div>
</template>

<script>

    /* 
        消息订阅与发布(pubsub)

            1. 一种组件间通信的方式，适用于任意组件间通信

            2. 使用步骤：

                (1) 安装 pubsub     pubsub-js 消息订阅的库(任何框架都可使用)
                    npm i pubsub-js
                    (使用其他消息订阅的库也可以，不是一定 pubsub)

                (2) 引入:
                    在使用到消息订阅的组件中引入 pubsub
                    import pubsub from 'pubsub-js'

                (3) 订阅消息(接收数据)：
                    a、订阅方式

                        箭头函数 ()=>{}：   this --> 组件实例对象vc
                            mounted() {
                                this.pid =  pubsub.subscribe('消息名',(msgName消息名,data数据)=>{ } )
                            }

                        普通函数 function： this --> undefined
                            mounted() {
                                this.pid =  pubsub.subscribe('消息名',function(msgName消息名,data数据){ } )
                            }

                        methods内函数：     this --> 组件实例对象vc
                            methods(){ demo(msgName消息名,data数据){ } }
                            mounted() {
                                this.pid = pubsub.subscribe('消息名',this.demo)
                            }

                    b、每次订阅都会返回一个不同的 订阅ID，取消时订阅时需通过 订阅ID 取消

                    c、A 组件想接收数据，则在 A 组件中订阅消息，订阅的回调留在A组件自身

                (4) 发布消息(提供数据)：
                    pubsub.publish('消息名',数据)

                (5) 最好销毁前取消订阅
                    在 beforeDestroy(){} 钩子中
                        pubsub.unsubscribe(pid) 取消订阅

            3. 对比 全局事件总线
                都能实现任意组件间通信，使用模型完全相同
                    (1) 但 全局事件总线 完全利用 Vue 自带的的自定义事件，所以使用更多
                    (2) 且 pubsub 是第三方库，无法在 Vue 开发者工具捕获 消息订阅与发布
                    (2) 而 全局事件总线 与 组件自定义事件 在 Vue 开发者工具内可以看到具体内容

    */

    import pubsub from 'pubsub-js'

    export default {
        name: 'Singer',
        data() {
            return {
                name: '胡梦周',
                works: '驰 Timelapse',
            }
        },
        mounted() {
            // 在挂载完毕后立刻开始订阅消息
            this.pubId = pubsub.subscribe('myLyric',(msgName,data)=>{
                console.log('myLyric 发布消息了，我在 singer 接收到了:',msgName,data)
            })
        },
        beforeDestroy() {
            // 在销毁组件前 解绑订阅
            pubsub.unsubscribe(this.pubId)
        },
    }

</script>

<style scoped>
    .demo{
        background-color: #b94f4f;
        padding: 3px 20px 3px 20px;
        margin-top: 10px;
    }
    .demo h2{
        color: rgb(255, 255, 255);
    }
</style>