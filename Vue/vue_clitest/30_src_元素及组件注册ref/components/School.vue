<template>
    <div class="demo">
        <h2>{{c1}}</h2>
        <h2>{{c2}}</h2>
    </div>
</template>

<script>
    /* 
        元素及组件注册
            详细请看 App.vue 文件
    */

    export default {
        name: 'School',
        data() {
            return {
                c1: '我决定插手你的人生',
                c2: '当你的时尚顾问',
            }
        },
    }
</script>

<style>
    .demo{
        width: 500px;
        background-color: aliceblue;
    }
</style>