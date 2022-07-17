<template>
    <div>
        <School/>
        <hr>
        <Student/>
    </div>
</template>

<script>
    /* 
        mixin 混合
            详细请看 mixin.js 文件
    */

    import School from './components/School.vue'
    import Student from './components/Student.vue'

    export default {
        name: 'App',
        components: {
            Student,
            School
        },
    }
</script>