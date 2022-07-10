<template>
    <li>
        <label>
            <input type="checkbox" :checked="todoObj.done" @change="handleCheck(todoObj.id)"/><!-- 动态创建元素属性 checked 决定是否被勾选 -->
            <!-- <input type="checkbox" v-model="todoObj.done"/> -->
            <!-- 通过v-model双向绑定的方式可以不需要 App 传递函数来获取变量也可以实现功能，但是这里不建议这样做
                参数本是只读，但函数和对象为引用类型(更改属性时地址未变)，所以仍会引起更改，但不应该利用这点修改 props
            -->
            <span> {{todoObj.title}}</span>
        </label>
        <button class="btn btn-danger" @click="deleteTodo(todoObj.id)">删除</button>
    </li>
</template>

<script>
    export default {
        name: 'TodoItem',
        methods: {
            // 这里也可以使用 @click 事件处理
            handleCheck(id){
                // 通知 App 组件将对应的 todo 对象的 done 值取反
                this.checkTodo(id)
            },
            // 删除 todo，仍然是从 App 传入的函数，传递需删除 id 让 App 去操作
            deleteTodo(id){
                if(confirm('确定删除吗? ^-^')){
                    this.deleteTodoReceive(id)
                }
            }
        },
        props: ['todoObj','checkTodo','deleteTodoReceive']
    }
</script>

<style scoped>
    li {
        list-style: none;
        height: 36px;
        line-height: 36px;
        padding: 0 5px;
        border-bottom: 1px solid #ddd;
    }

    li label {
        float: left;
        cursor: pointer;
    }

    li label li input {
        vertical-align: middle;
        margin-right: 6px;
        position: relative;
        top: -1px;
    }

    li button {
        float: right;
        display: none;
        margin-top: 3px;
    }

    li:before {
        content: initial;
    }

    li:last-child {
        border-bottom: none;
    }
    li:hover{
        background: rgb(244, 247, 248);
    }
    li:hover button{
        display: block;
    }
</style>