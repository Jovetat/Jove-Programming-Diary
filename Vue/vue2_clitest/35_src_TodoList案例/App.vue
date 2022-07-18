<template>
    <div class="todo-container">
        <div class="todo-wrap">
            <add-todo :addTodoReceive="addTodoReceive"/><!-- 将函数传给添加 todo 的组件去调用，从而返回数据 -->
            <todos-list :todos="todos"
                        :checkTodo="checkTodo"
                        :deleteTodoReceive="deleteTodoReceive"
                        />
            <select-all :todos="todos"
                        :checkedAllReceive="checkedAllReceive"
                        :clearDoneReceive="clearDoneReceive"
                        />
        </div>
    </div>
</template>

<script>
    /* 
        Todo-list 案例 (任务清单小案例)
            1. 组件化编码流程：

                ​	1) 拆分静态组件：组件要按照功能点拆分，命名不要与 html 元素冲突。

                ​	2) 实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用：

                ​			(1) 一个组件在用：放在组件自身即可。

                ​			(2) 一些组件在用：放在他们共同的父组件上(*状态提升)。

                ​	3) 实现交互：从绑定事件开始。

            2. props 适用于：

                ​	(1) 父组件 ==> 子组件 通信

                ​	(2) 子组件 ==> 父组件 通信（要求父先给子一个函数）

            3. 使用 v-model 时要切记：v-model 绑定的值不能是 props 传过来的值，因为 props 是不可以修改的！

            4. props 传过来的若是对象类型的值，修改对象中的属性时Vue不会报错，但不推荐这样做。
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
            },
            // 删除指定 id 向
            deleteTodoReceive(id){
                const index = this.todos.findIndex(s => s.id === id)
                this.todos.splice(index,1)
            },
            // 全选或全不选
            checkedAllReceive(isAllDone){
                this.todos.forEach(item => {
                    item.done = isAllDone
                })
            },
            // 清除全部勾选项
            clearDoneReceive(){
                this.todos = this.todos.filter(item => !item.done)
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