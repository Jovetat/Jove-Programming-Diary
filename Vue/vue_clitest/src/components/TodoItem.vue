<template>
    <li>
        <label>
            <input type="checkbox" :checked="todoObj.done" @change="handleCheck(todoObj.id)"/><!-- 动态创建元素属性 checked 决定是否被勾选 -->
            <span> {{todoObj.title}}</span>
        </label>
        <button class="btn btn-danger" style="display:none">删除</button>
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
        },
        props: ['todoObj','checkTodo']
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
</style>