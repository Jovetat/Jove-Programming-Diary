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
    export default {
        name: 'Home',
    }
    /* 
        路由 query 传参
            详细请看 pages/Message.vue 文件
    */
</script>