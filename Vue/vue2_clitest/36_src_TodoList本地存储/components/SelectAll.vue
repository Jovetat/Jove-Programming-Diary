<template>
    <div class="todo-footer" v-show="todos.length">
        <label>
            <input type="checkbox" v-model="isAll"/>
        </label>
        <span>
            <span>已完成{{doneNum}}</span> / 全部 {{todos.length}}
        </span>
        <button class="btn btn-danger" @click="clearDone">清除已完成任务</button>
    </div>
</template>

<script>
    export default {
        name: 'SelectAll',
        props: ['todos','checkedAllReceive','clearDoneReceive'],
        computed: {
            isAll:{
                get(){
                    return this.doneNum === this.todos.length && this.todos.length > 0
                },
                set(value){
                    this.checkedAllReceive(value)               // set 是调用 App 传来的全选函数
                }
            },
            doneNum(){
                return this.todos.reduce((pre,current)=>{
                    return current.done ? pre + 1 : pre
                },0)
            }
        },
        methods: {
            clearDone(){
                if(confirm('确定删除全部完成项吗? : )')){
                    this.clearDoneReceive()
                }
            }
        },
    }
</script>

<style scoped>
    .todo-footer {
        height: 40px;
        line-height: 40px;
        padding-left: 6px;
        margin-top: 5px;
    }

    .todo-footer label {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
    }

    .todo-footer label input {
        position: relative;
        top: -1px;
        vertical-align: middle;
        margin-right: 5px;
    }

    .todo-footer button {
        float: right;
        margin-top: 5px;
    }
</style>