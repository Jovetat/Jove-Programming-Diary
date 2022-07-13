<template>
    <li>
        <div v-show="!isEdit">
            <label>
                <input type="checkbox" :checked="todoObj.done" @change="handleCheck(todoObj.id)"/>
                <span> {{todoObj.title}}</span>
            </label>
            <button class="btn btn-danger" @click="deleteTodo(todoObj.id)">删除</button>
            <button class="btn btn-edit" @click="editTodo()">编辑</button>
        </div>
        <!-- 添加编辑框进出的动画 -->
        <transition name="animate__animated animate__bounce" appear
            enter-active-class="animate__headShake"
            leave-active-class="animate__zoomOutLeft"
        >
            <div v-show="isEdit">
                <input type="text" ref="editinput" style="outline:none"
                    :value="todoObj.title"
                    @blur="editEnd(todoObj.id,$event)"
                    @keyup.enter="editEnd(todoObj.id,$event)"/><!-- @blur 失去焦点时触发 -->
                <button class="btn btn-edit" @click="editEnd(todoObj.id,$event)">编辑完成</button>
            </div>
        </transition>
    </li>
</template>

<script>
    // 引入动画
    import 'animate.css'

    export default {
        name: 'TodoItem',
        data() {
            return {
                isEdit: false,
            }
        },
        methods: {
            handleCheck(id){
                this.$bus.$emit('checkTodo',id)
            },
            deleteTodo(id){
                if(confirm('确定删除吗? ^-^')){
                    this.$bus.$emit('deleteTodoReceive',id)
                }
            },
            editTodo(){
                this.isEdit = true
                this.$nextTick(()=>{
                    this.$refs.editinput.focus()
                })
            },
            editEnd(id,e){
                if(!e.target.value.trim()){
                    alert('修改内容不允许为空')
                }
                else if(e.target.value.trim() === this.todoObj.title){
                    this.isEdit = false
                }
                else{
                    this.isEdit = false
                    this.$bus.$emit('editTodoReceive',id, e.target.value.trim())
                }
            }
        },
        props: ['todoObj']
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