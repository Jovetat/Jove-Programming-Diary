<template>
    <div class="todo-footer" v-show="todos.length">
        <label>
            <!-- <input type="checkbox" :checked="isAll" @change="checkAll"/> -->
            <input type="checkbox" v-model="isAll"/>
            <!-- 使用其他逻辑完成 -->
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
                // 计算属性的计算属性(套娃)
                get(){
                    return this.doneNum === this.todos.length && this.todos.length > 0
                },
                set(value){
                    this.checkedAllReceive(value)               // set 是调用 App 传来的全选函数
                }
            },
            doneNum(){
                /* let num = 0
                this.todos.forEach( dic => {
                    if(dic.done){
                        num ++
                    }
                })
                return num */
                // es6 数组新方法 reduce 条件统计
                return this.todos.reduce((pre,current)=>{
                    return current.done ? pre + 1 : pre
                },0)
            }
        },
        methods: {
            /* checkAll(e){
                this.checkedAllReceive(e.target.checked)
            }, */
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