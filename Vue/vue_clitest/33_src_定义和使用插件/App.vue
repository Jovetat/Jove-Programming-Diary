<template>
    <div>
        <Student/>
        <hr>
    </div>
</template>

<script>
    import Student from './components/Student.vue'

    export default {
        name: 'App',
        components: {
            Student,
        },
    }
</script>