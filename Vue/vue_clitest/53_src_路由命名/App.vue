<template>
    <div>
        <div class="row">
            <div class="col-xs-2 col-xs-offset-2 list-group">
                <!-- 借助 router-link 标签实现路由的切换 -->
                <router-link class="list-group-item" active-class="active" to="/about">About</router-link>
                <router-link class="list-group-item" active-class="active" to="/home">Home</router-link>
            </div>
            <div class="col-xs-6 panel panel-body">
                <!-- 指定组件的呈现位置 -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    // 引入 bootstrap 样式
    import './assets/css/bootstrap.css'


    export default {
        name: 'App'
    }
    /* 
        路由命名
            详细请看 router/index.js 文件
    */

</script>