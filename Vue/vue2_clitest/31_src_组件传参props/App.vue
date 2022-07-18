<template>
    <div>
        <Student name="Tank"/>
        <Student name="杰伦" :age="39"/>
        <!-- :age 可以使传递的数值为 number 类型
            "" 内为 js表达式，所以传递的就是 number 类型数据
         -->
    </div>
</template>

<script>
    /* 
        组件传参 props
            详细请看 student.vue 文件
    */
    import Student from './components/Student.vue'

    export default {
        name: 'App',
        components: {
            Student
        },
    }
</script>