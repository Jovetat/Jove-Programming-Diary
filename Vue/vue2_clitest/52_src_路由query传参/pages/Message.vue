<template>
    <div>
        <ul>
            <li v-for="item in messageList" :key="item.id">
                <!-- 跳转路由并携带 query 参数 -->
                <!-- 1、字符串写法 -->
                <!-- <router-link to="/home/message/detail?id=666&title=你好">跳转</router-link> -->
                <!-- 2、模板字符串写法 -->
                <!-- <router-link :to=" `/home/message/detail?id=${item.id}&title=${item.title}` ">跳转</router-link> -->
                <!-- 3、对象写法 -->
                <router-link
                    :to="{
                        path: '/home/message/detail',
                        query: {
                            id: item.id,
                            title: item.title
                        }
                    }"
                >{{item.title}}</router-link>&nbsp;&nbsp;
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>

    /* 
        路由 query 传参 (父路由 --> 子路由 传参)
            1. 传递参数 (跳转并携带 query 参数)
                (1) to 的字符串写法(写死了)
                    <router-link to="/home/message/detail?id=666&title=你好">跳转</router-link>
                (2) 模板字符串写法
                    <router-link :to=" `/home/message/detail?id=${item.id}&title=${item.title}` ">跳转</router-link>
                (3) to 的对象写法
                    <router-link 
                        :to="{
                            path:'/home/message/detail',
                            query:{
                                id: 666,
                                title: '你好'
                            }
                        }"
                    >跳转</router-link>

            2. 接收 query 参数并使用：
                $route.query.id
                $route.query.title 
                
    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '如果不爱了就别勉为其难'},
                    {id: '002', title: '虽然我也不想说声再见'},
                    {id: '003', title: '用手画出的圆，却总不圆满'},
                    {id: '004', title: '孤独患者一个人的狂欢'},
                ]
            }
        },
    }
    
</script>