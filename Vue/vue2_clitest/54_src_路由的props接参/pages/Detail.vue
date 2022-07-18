<template>
    <ul>
        <!-- 原先写法 -->
        <!-- <li>歌词编号：{{$route.params.id}}</li>
        <li>歌词内容：{{$route.params.title}}</li> -->
        <!-- 2、props 的布尔值写法组件使用参数 -->
        <li>歌词编号：{{id}}</li>
        <li>歌词内容：{{title}}</li>
        <!-- 3、props 的函数写法组件使用参数与 2 相同 -->

        <!-- 1、props 的对象写法组件使用参数 -->
        <!-- <li>a：{{a}}</li>
        <li>b：{{b}}</li> -->
    </ul>
</template>

<script>
    /* 
        路由的 props 配置接收传参
            详细请看 router/index.js 文件
    */

    export default {
        name: 'Detail',
        // 1、props 的对象写法接收参数
        // props: ['a','b'],
        // 2、props 的布尔值写法接收参数
        props: ['id','title'],
        // 3、props 的函数写法接收参数与 2 相同

        mounted() {
            console.log(this.$route)
        },
    }
</script>