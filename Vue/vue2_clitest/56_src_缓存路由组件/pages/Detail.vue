<template>
    <ul>
        <li>歌词编号：{{id}}</li>
        <li>歌词内容：{{title}}</li>
    </ul>
</template>

<script>
    /* 
        缓存路由组件
            详细请看 pages/Home.vue 文件
    */

    export default {
        name: 'Detail',
        props: ['id','title'],

        mounted() {
            console.log(this.$route)
        },
    }
</script>