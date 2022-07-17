<template>
    <div class="demo">
        <h2>{{lyric1}}</h2>
        <h2>{{lyric2}}</h2>
        <button @click="sendLyric">向 Singer 兄弟组件发送数据</button>
    </div>
</template>

<script>
    /* 
        全局事件总线
            详情请看 main.js
    */

    export default {
        name: 'Song',
        data() {
            return {
                lyric1: '彩虹怎么可能会 better than you',
                lyric2: '夕阳照片下的你 super cute',
            }
        },
        methods: {
            // 发送数据
            sendLyric(){
                this.$bus.$emit('hello',this.lyric1)
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