<template>
    <div>
        <SchoolCom></SchoolCom>
        <StudentCom/>
    </div>
</template>

<script>
    // App 组件，该组件用于管理所有组件内容
    // 引入组件
    import SchoolCom from './components/SchoolCom.vue'
    import StudentCom from './components/StudentCom.vue'

    export default {
        name: 'App',
        components: {
            SchoolCom,
            StudentCom,
        }
    }
</script>