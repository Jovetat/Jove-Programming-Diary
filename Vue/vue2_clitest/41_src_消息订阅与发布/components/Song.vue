<template>
    <div class="demo">
        <h2>{{lyric1}}</h2>
        <h2>{{lyric2}}</h2>
        <button @click="sendLyric">向 Singer 兄弟组件发送数据</button>
    </div>
</template>

<script>
    /* 
        消息订阅与发布
            详情请看 Singer.vue
    */

    import pubsub from 'pubsub-js'

    export default {
        name: 'Song',
        data() {
            return {
                lyric1: '我站在时间的尽头',
                lyric2: '回头看影子向我冲',
            }
        },
        methods: {
            sendLyric(){
                // 发布消息
                console.log('发布消息')
                pubsub.publish('myLyric',this.lyric1)
            },
        },
    }
</script>

<style scoped>
    .demo{
        background-color: rgb(215, 230, 243);
        padding: 3px 20px 3px 20px;
    }
</style>