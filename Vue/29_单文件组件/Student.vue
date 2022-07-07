<template>
    <div>
        <!-- 1、组件的结构 -->
        <h2>学生姓名：{{name}}</h2>
        <h2>学生年龄：{{age}}</h2>
    </div>
</template>

<script>
        // 2、组件交互相关的代码(数据、方法等等)
    export default {
        name: 'Student',
        data(){
            return {
                name: '赵铁柱',
                age: 25,
            }
        }
    }
        // 3、可以不写组件的样式
</script>