<template>
    <div class="demo">
        <h2>{{lyric1}}</h2>
        <h2>{{lyric2}}</h2>
    </div>
</template>

<script>
    /* 
       scoped 局部样式
            详情查看 Singer 组件
    */

    export default {
        name: 'Song',
        data() {
            return {
                lyric1: '一是婴儿哭啼',
                lyric2: '二是学游戏',
            }
        },
    }
</script>

<style scoped>
    .demo{
        background-color: antiquewhite;
    }
</style>