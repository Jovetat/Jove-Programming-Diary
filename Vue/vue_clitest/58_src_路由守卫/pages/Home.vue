<template>
    <div>
        <h2>我是 Home 的内容</h2>
        <div>
            <ul class="nav nav-tabs">
                <ul class="nav nav-tabs">
                    <li> <router-link to="/home/news" active-class="active">News</router-link> </li>
                    <li> <router-link to="/home/message" active-class="active">Message</router-link> </li>
                </ul>
            </ul>
            <keep-alive include="News">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    /* 
        路由守卫
            详细请看 router/index.js 文件
    */

    export default {
        name: 'Home',
    }
    
</script>