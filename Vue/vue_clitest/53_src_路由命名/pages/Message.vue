<template>
    <div>
        <ul>
            <li v-for="item in messageList" :key="item.id">
                <!-- 对象写法 + 路由命名 -->
                <router-link
                    :to="{
                        name: 'xiangqing',
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
        路由命名
            详细请看 router/index.js 文件
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