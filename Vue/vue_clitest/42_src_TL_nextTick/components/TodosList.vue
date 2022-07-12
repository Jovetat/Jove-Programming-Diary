<template>
    <ul class="todo-main">
        <todo-item v-for="item in todos" :key="item.id" :todoObj="item"/>
    </ul>
</template>

<script>
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