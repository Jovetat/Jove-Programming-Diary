<template>
    <ul>
        <li>歌词编号：{{id}}</li>
        <li>歌词内容：{{title}}</li>
    </ul>
</template>

<script>
    /* 
        编程式路由导航 与 浏览器历史记录
            详细请看 pages/Message.vue 文件
    */

    export default {
        name: 'Detail',
        props: ['id','title'],

        mounted() {
            console.log(this.$route)
        },
    }
</script>