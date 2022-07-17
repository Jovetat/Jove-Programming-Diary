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
        路由组件独有的生命周期钩子
            详细请看 pages/News.vue 文件
    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '喜羊羊'},
                    {id: '002', title: '美羊羊'},
                    {id: '003', title: '懒羊羊'},
                    {id: '004', title: '羊肉串'},
                ]
            }
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