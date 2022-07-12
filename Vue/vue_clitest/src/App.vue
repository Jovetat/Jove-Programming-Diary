<template>
    <div>
        <Test/>
        <Test2/>
    </div>
</template>

<script>
    import Test from './components/Test.vue'
    import Test2 from './components/Test2.vue'

    export default {
        name: 'App',
        components: { Test,Test2 },
    }
    /* 
        关于 动画效果 详细请看 Test.vue
    */
</script>
