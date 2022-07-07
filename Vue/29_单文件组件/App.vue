<template>
    <div>
        <School></School>
        <Student/>
    </div>
</template>

<script>
    // App 组件，该组件用于管理所有组件内容
    // 引入组件
    import School from './School.vue'
    import Student from './Student.vue'

    export default {
        name: 'App',
        components: {
            School,
            Student
        }
    }
</script>