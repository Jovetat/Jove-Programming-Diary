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
        缓存路由组件
            详细请看 pages/Home.vue 文件
    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '我想大声宣布'},
                    {id: '002', title: '对你依依不舍'},
                    {id: '003', title: '连隔壁邻居都猜到我现在的感受'},
                    {id: '004', title: '河边的风在吹着头发飘动'},
                ]
            }
        },
        beforeDestroy() {
            console.log('Message 路由组件被销毁了')
        },
        methods: {
            pushShow(item){
                this.$router.push({
                    path: '/home/message/detail',
                    query: {
                        id: item.id,
                        title: item.title
                    }
                })
            },
            replaceShow(item){
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