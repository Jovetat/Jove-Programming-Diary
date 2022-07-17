<template>
    <ul>
        <li>news001 <input type="text"></li>
        <li>news002 <input type="text"></li>
        <li>news003 <input type="text"></li>
    </ul>
</template>

<script>
    /* 
        缓存路由组件
            详细请看 pages/Home.vue 文件
    */

    export default {
        name: 'News',
        beforeDestroy() {
            console.log('News 路由组件被销毁了')
        },
    }
</script>