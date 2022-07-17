<template>
    <div class="row col-xs-offset-2 col-xs-8 page-header">
        <h2>Vue Router Demo</h2>
        <button @click="back">后退</button>
        <button @click="forward">前进</button>
        <button @click="goTest">go（-3）</button>

    </div>
</template>

<script>
    /* 
        缓存路由组件
            详细请看 pages/Home.vue 文件
    */

    export default {
        name: 'Banner',
        methods: {
            back(){
                // 回退
                this.$router.back()
            },
            forward(){
                // 前进
                this.$router.forward()
            },
            goTest(){
                this.$router.go(-3)
            },
        },
    }
</script>