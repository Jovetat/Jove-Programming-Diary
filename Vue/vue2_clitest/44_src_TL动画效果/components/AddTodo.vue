<template>
    <div class="todo-header">
        <input type="text" placeholder="请输入你的任务名称，按回车键确认" @keyup.enter="addtodo"/>
    </div>
</template>

<script>
    // 引入 nanoid 库，用于生成唯一 id
    import {nanoid} from 'nanoid'

    export default {
        name: 'AddTodo',
        methods: {
            addtodo(e){
                // 没有数值时直接 return
                if( !e.target.value.trim() ) return alert('输入不能为空')
                const todoObj = {
                    id: nanoid(),           // nanoid 生成21位的随机 id
                    title: e.target.value.trim(),
                    done: false
                }
                this.$emit('addTodoReceive',todoObj)
                e.target.value = ''
            }
        },
    }
</script>

<style scoped>
    .todo-header input {
        width: 560px;
        height: 28px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px 7px;
    }

    .todo-header input:focus {
        outline: none;
        border-color: rgba(82, 168, 236, 0.8);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(82, 168, 236, 0.6);
    }
</style>