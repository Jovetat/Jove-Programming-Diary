<template>
    <div>
        <Count/>
    </div>
</template>

<script>
    /* 
        Vuex 与 map方法
            详情请看 vuex/store.js 文件
    */

    import Count from './components/Count.vue'

    export default {
        name: 'App',
        components:{ Count }
    }
</script>