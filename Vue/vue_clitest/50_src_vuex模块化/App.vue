<template>
    <div>
        <Count/>
    </div>
</template>

<script>
    import Count from './components/Count.vue'

    export default {
        name: 'App',
        components:{ Count }
    }

    /* 
        Vuex 模块化 + namespace命名空间
            详情请看 store/index.js 文件
    */

</script>