<template>
    <div>
        <ul>
            <li v-for="item in messageList" :key="item.id">
                <!-- 跳转路由并携带 params 参数 -->
                <!-- 1、字符串写法 -->
                <!-- <router-link to="/home/message/detail/999/再见">跳转</router-link> -->
                <!-- 2、模板字符串写法 -->
                <!-- <router-link :to=" `/home/message/detail/${item.id}/${item.title}` ">跳转</router-link> -->
                <!-- 3、对象写法 + 路由命名 -->
                <router-link
                    :to="{
                        name: 'xiangqing',
                        params: {
                            id: item.id,
                            title: item.title
                        }
                    }"
                >{{item.title}}</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
    /* 
        路由 params 传参
            1. 配置路由，声明接收 params 参数
                {
                    name:'xiangqing',
                    (1) 使用占位符声明接收 params 参数
                    path:'detail/:接收参数名1/:接收参数名2/……',
                        eg:path:'detail/:接收参数名1id/:接收参数名2title',
                    component: Detail
                }

            2. 传递参数 (跳转并携带 params 参数)
                (1) to 的字符串写法
                    <router-link to="/home/message/detail/999/再见">跳转</router-link>
                (2) 模板字符串写法
                    <router-link :to=" `/home/message/detail/${item.id}/${item.title}` ">跳转</router-link>
                (3) to 的对象写法 + 路由命名
                    <router-link 
                        :to="{
                            name:'xiangqing',
                            params:{
                                id: 999,
                                title: '再见'
                            }
                        }"
                    >跳转</router-link>

                (4) 路由携带 params 参数时，若使用 to 的对象写法，则不能使用 path 配置项，必须使用 name 配置

            3. 接收 params 参数并使用：
                $route.params.id
                $route.params.title

    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '为什么安静不了'},
                    {id: '002', title: '也不知道为了什么而祈祷'},
                    {id: '003', title: '越是不想去思考'},
                    {id: '004', title: '越纠缠不休围绕'},
                ]
            }
        },
    }
    
</script>