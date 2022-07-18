<template>
    <div>
        <ul>
            <li v-for="item in messageList" :key="item.id">
                <!-- query 传参 -->
                <!-- <router-link
                    :to="{
                        name: 'xiangqing',
                        query: {
                            id: item.id,
                            title: item.title
                        }
                    }"
                >{{item.title}}</router-link> -->
                <!-- parmas 传参 -->
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
        路由的 props 配置接收传参
            详细请看 router/index.js 文件
    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '蓝色的涤卡上衣'},
                    {id: '002', title: '痛往心里钻'},
                    {id: '003', title: '蹲在池塘边上'},
                    {id: '004', title: '狠狠给了自己两拳'},
                ]
            }
        },
    }
    
</script>