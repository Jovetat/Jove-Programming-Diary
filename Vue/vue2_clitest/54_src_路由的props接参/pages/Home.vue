<template>
    <div>
        <h2>我是 Home 的内容</h2>
        <div>
            <ul class="nav nav-tabs">
                <li>
                    <router-link to="/home/news" active-class="active">News</router-link>
                </li>
                <li>
                    <router-link to="/home/message" active-class="active">Message</router-link>
                </li>
            </ul>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    /* 
        路由的 props 配置接收传参
            详细请看 router/index.js 文件
    */

    export default {
        name: 'Home',
    }
</script>