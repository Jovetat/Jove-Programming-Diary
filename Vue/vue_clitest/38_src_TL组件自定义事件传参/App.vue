<template>
    <div class="todo-container">
        <div class="todo-wrap">
            <add-todo @addTodoReceive="addTodoReceive"/><!-- 将函数传给添加 todo 的组件去调用，从而返回数据 -->
            <todos-list :todos="todos"
                        :checkTodo="checkTodo"
                        :deleteTodoReceive="deleteTodoReceive"
                        />
            <select-all :todos="todos"
                        @checkedAllReceive="checkedAllReceive"
                        @clearDoneReceive="clearDoneReceive"
                        />
        </div>
    </div>
</template>

<script>
    /* 
        Todo-list 案例 (任务清单小案例)
            添加 本地存储
                通过 组件自定义事件 传参
    */
    import AddTodo from './components/AddTodo.vue'
    import TodosList from './components/TodosList.vue'
    import SelectAll from './components/SelectAll.vue'

    export default {
        name: 'App',
        data() {
            return {
                todos: JSON.parse( localStorage.getItem('todos') ) || []
            }
        },
        methods: {
            addTodoReceive(todoObj){
                this.todos.unshift(todoObj)
            },
            checkTodo(id){
                const index = this.todos.findIndex(s => s.id === id)
                this.todos[index].done = !this.todos[index].done
            },
            deleteTodoReceive(id){
                const index = this.todos.findIndex(s => s.id === id)
                this.todos.splice(index,1)
            },
            checkedAllReceive(isAllDone){
                this.todos.forEach(item => {
                    item.done = isAllDone
                })
            },
            clearDoneReceive(){
                this.todos = this.todos.filter(item => !item.done)
            }
        },
        // 通过 watch 监测数组变化并对本地存储进行修改
        watch: {
            todos: {
                // 开启深度侦听，否则具体属性改变时侦听不到
                deep: true,
                handler(value){
                    localStorage.setItem('todos',JSON.stringify(value))
                }
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