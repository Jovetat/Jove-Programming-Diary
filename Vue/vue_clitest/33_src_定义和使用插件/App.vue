<template>
    <div>
        <Student/>
        <hr>
    </div>
</template>

<script>
    /* 
        定义和使用插件
            详细请看 plugins.js 文件
    */

    import Student from './components/Student.vue'

    export default {
        name: 'App',
        components: {
            Student,
        },
    }
</script>