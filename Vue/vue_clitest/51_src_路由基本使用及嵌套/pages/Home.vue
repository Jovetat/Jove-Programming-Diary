<template>
    <div>
        <h2>我是 Home 的内容</h2>
        <div>
            <ul class="nav nav-tabs">
                <li>
                    <!-- 路由的命名 -->
                    <router-link :to="{name:'journalism'}" active-class="active">News</router-link>
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
        mounted() {
            console.log('Home组件挂载完毕')
            console.log(this.$route,this.$router)
        },
        beforeDestroy() {
            console.log('Home组件将被销毁')
        },
    }
    /* 
       路由的基本使用及嵌套
           详细请看 router/index.js 文件
    */
</script>