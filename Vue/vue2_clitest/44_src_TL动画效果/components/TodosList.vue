<template>
    <ul class="todo-main">
        <!-- 为 list item 每一项添加过度动画 -->
        <transition-group name="animate__animated animate__bounce" appear
            enter-active-class="animate__backInRight"
            leave-active-class="animate__rollOut"
        >
            <todo-item v-for="item in todos" :key="item.id" :todoObj="item"/>
        </transition-group>
    </ul>
</template>

<script>
    // 引入动画
    import 'animate.css'

    import TodoItem from './TodoItem.vue'

    export default {
        name: "TodosList",
        props: ['todos'],
        components: { TodoItem },
    };
</script>

<style scoped>
    .todo-main {
        margin-left: 0px;
        border: 1px solid #ddd;
        border-radius: 2px;
        padding: 0px;
    }

    .todo-empty {
        height: 40px;
        line-height: 40px;
        border: 1px solid #ddd;
        border-radius: 2px;
        padding-left: 5px;
        margin-top: 10px;
    }
</style>