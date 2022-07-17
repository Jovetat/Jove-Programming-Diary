<template>
    <div class="demo">
        <h2>{{lyric1}}</h2>
        <h2>{{lyric2}}</h2>
        <button @click="sendLyric">props向父组件传递变量</button>
    </div>
</template>

<script>
    /* 
       组件的自定义事件
           详情请看 App 组件
    */

    export default {
        name: 'Song',
        data() {
            return {
                lyric1: '三是青春物语',
                lyric2: '四是刚好遇见你',
            }
        },
        props: ['singerEvent'],
        methods: {
            sendLyric(){
                this.singerEvent(this.lyric1)
            }
        },
    }
</script>

<style scoped>
    .demo{
        background-color: rgb(215, 230, 243);
        padding: 3px 20px 3px 20px;
    }
</style>