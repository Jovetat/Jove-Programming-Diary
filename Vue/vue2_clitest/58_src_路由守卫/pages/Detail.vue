<template>
    <ul>
        <li>歌词编号：{{id}}</li>
        <li>歌词内容：{{title}}</li>
    </ul>
</template>

<script>
    /* 
        路由守卫
            详细请看 router/index.js 文件
    */

    export default {
        name: 'Detail',
        props: ['id','title'],
    }
</script>