<template>
    <ul>
        <li>歌词编号：{{$route.params.id}}</li>
        <li>歌词内容：{{$route.params.title}}</li>
    </ul>
</template>

<script>
    /* 
        命名路由与 params 传参
            详细请看 pages/Message.vue 文件
    */

    export default {
        name: 'Detail',
        mounted() {
            console.log(this.$route)
        },
    }
</script>