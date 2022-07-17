<template>
    <div>
        <ul>
            <li v-for="item in messageList" :key="item.id">
                <span>{{item.title}}</span>
                <button @click="pushShow(item)">push查看</button>
                <button @click="replaceShow(item)">replace查看</button>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>

    /* 
        浏览器历史记录
            1.  每次路由跳转都会被计入浏览器历史记录
            2.  浏览器的历史记录有两种写入方式
                1) push 追加历史记录 (入栈)
                    路由跳转时默认为 push
                2) replace 替换当前记录 (更改栈顶记录)
                    开启 replace 模式	:replace="true"
                    <router-link replace .......>News</router-link>

        编程式路由导航 (不需要借助 router-link 跳转)
            1. 作用：不需要借助 router-link 实现路由跳转，让路由跳转更加灵活

            2. 实现编程式路由导航：
                0) 通过全局唯一的路由器 $router 实现
                1)  this.$router.push({
                        path: '子路由路径'
                    })
                    (1) 可传递 params/query 参数
                        this.$router.push({
                            name:'xiangqing',
                                params/query: {
                                    id: xxx,
                                    title: xxx
                                }
                        })
                    (2) 传递 query 可通过 path/name 指定路由组件
                        传递 params 只可通过 name 指定路由组件
                2)  this.$router.replace({
                        path: '子路由路径'
                    })
                    (1) 传参与 this.$router.push() 同理
                    (2) 先 replace 再对同一路径 push 就会触发 避免了对当前位置的冗余导航 的报错
                        Avoided redundant navigation to current location
                3) this.$router.forward()
                    历史记录前进
                4) this.$router.back()
                    历史记录后退
                5) this.$router.go(num)
                    传入正数前进 num 步，传入负数后退 |num| 步

    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '手牵手一步两步三步四步望着天'},
                    {id: '002', title: '看星星一颗两颗三颗四颗连成线'},
                    {id: '003', title: '看远方的星'},
                    {id: '004', title: '它一定实现'},
                ]
            }
        },
        methods: {
            pushShow(item){
                this.$router.push({
                    path: '/home/message/detail',
                    // name: 'xiangqing',
                    query: {
                        id: item.id,
                        title: item.title
                    }
                })
            },
            replaceShow(item){
                // 先 replace 再对同一路径 push 就会触发 避免了对当前位置的冗余导航
                this.$router.replace({
                    name: 'xiangqing',
                    query: {
                        id: item.id,
                        title: item.title
                    }
                })
            }
        },
    }
    
</script>