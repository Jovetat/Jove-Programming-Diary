<template>
    <div class="todo-container">
        <div class="todo-wrap">
            <add-todo :addTodoReceive="addTodoReceive"/><!-- 将函数传给添加 todo 的组件去调用，从而返回数据 -->
            <todos-list :todos="todos" :checkTodo="checkTodo"/>
            <select-all/>
        </div>
    </div>
</template>

<script>
    /* 
        Todo-list 案例 (任务清单小案例)
    */
    import AddTodo from './components/AddTodo.vue'
    import TodosList from './components/TodosList.vue'
    import SelectAll from './components/SelectAll.vue'

    export default {
        name: 'App',
        data() {
            return {
                todos: [
                    { id: '001',  title: '吃饭', done: false },
                    { id: '002',  title: '睡觉', done: false },
                    { id: '003',  title: '打豆豆', done: true },
                ]
            }
        },
        methods: {
            // 子组件向父组件传递参数的方式
            addTodoReceive(todoObj){
                this.todos.unshift(todoObj)
            },
            // 勾选 or 取消勾选一个 todo，通过 props 逐层传递到 TodoItem
            checkTodo(id){
                const index = this.todos.findIndex(s => s.id === id)
                this.todos[index].done = !this.todos[index].done
            }
        },
        components: {
            AddTodo,
            TodosList,
            SelectAll
        },
    }

</script>

<style>
    body {
        background: #fff;
    }

    .btn {
        display: inline-block;
        padding: 4px 12px;
        margin-bottom: 0;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .btn-danger {
        color: #fff;
        background-color: #da4f49;
        border: 1px solid #bd362f;
    }

    .btn-danger:hover {
        color: #fff;
        background-color: #bd362f;
    }

    .btn:focus {
        outline: none;
    }

    .todo-container {
        width: 600px;
        margin: 0 auto;
    }

    .todo-container .todo-wrap {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
</style>