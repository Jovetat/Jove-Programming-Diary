<template>
    <ul>
        <li>歌词编号：{{id}}</li>
        <li>歌词内容：{{title}}</li>
    </ul>
</template>

<script>
    /* 
        路由组件独有的生命周期钩子
            详细请看 pages/News.vue 文件
    */

    export default {
        name: 'Detail',
        props: ['id','title'],
    }
</script>