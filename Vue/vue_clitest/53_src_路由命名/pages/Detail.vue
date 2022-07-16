<template>
    <ul>
        <li>歌词编号：{{$route.query.id}}</li>
        <li>歌词内容：{{$route.query.title}}</li>
    </ul>
</template>

<script>
    /* 
        路由命名
            详细请看 router/index.js 文件
    */
    export default {
        name: 'Detail',
        mounted() {
            console.log(this.$route)
        },
    }
</script>