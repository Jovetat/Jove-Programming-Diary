<template>
    <div>
        <Banner/>
        <div class="row">
            <div class="col-xs-2 col-xs-offset-2 list-group">
                <router-link replace class="list-group-item" active-class="active" to="/about">About</router-link>
                <router-link replace class="list-group-item" active-class="active" to="/home">Home</router-link>
            </div>
            <div class="col-xs-6 panel panel-body">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    /* 
        编程式路由导航 与 浏览器历史记录
            详细请看 pages/Message.vue 文件
    */

    // 引入 bootstrap 样式
    import './assets/css/bootstrap.css'

    import Banner from './components/Banner.vue'

    export default {
        name: 'App',
        components:{ Banner }
    }

</script>