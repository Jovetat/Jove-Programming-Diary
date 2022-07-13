<template>
    <div class="container">
        <Search/>
        <List/>
    </div>
</template>

<script>
    /* 
        引入第三方样式
            1. import './assets/css/bootstrap.css'
                这种方式引入时， Vue 脚手架会检查，css 文件内包含不存在的资源相关内容就会报错，无论最终有没有调用不存在资源
                (这种引入一般将 css 资源文件放入 src/assets/css)
            2. 直接在 index 页面引入
                <link rel="stylesheet" href="<%= BASE_URL %>css/bootstrap.css">
                (这种引入一般将 css 资源文件放入 public/css)
    */
    import './assets/css/bootstrap.css'             // 这里选择第一种，二者并无优劣，只是我就喜欢这种怎么地吧

    import Search from './components/Search.vue'
    import List from './components/List.vue'
    
    export default {
        name: 'App',
        components: {Search,List}
    }
</script>