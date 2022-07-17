<template>
    <h2>我是 About 的内容</h2>
</template>

<script>
    /* 
       路由的基本使用及嵌套
           详细请看 router/index.js 文件
    */

    export default {
        name: 'About',
        mounted() {
            console.log('About组件挂载完毕')
        },
        beforeDestroy() {
            console.log('About组件将被销毁')
        },
    }
</script>