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
        <div v-show="isEdit">
            <input type="text" ref="editinput" style="outline:none"
                :value="todoObj.title"
                @blur="editEnd(todoObj.id,$event)"
                @keyup.enter="editEnd(todoObj.id,$event)"/><!-- @blur 失去焦点时触发 -->
            <button class="btn btn-edit" @click="editEnd(todoObj.id,$event)">编辑完成</button>
        </div>
    </li>

    <!-- 
        nextTick
            1. 语法：
                this.$nextTick( ()=>{} )
            2. 作用：
                在下一次 DOM 更新结束后执行回调
                ( 因为 Vue 发现数据改变会在整个回调结束后再渲染页面[效率问题，避免数据改变引起的多次的渲染页面]
                    ，这时在数据更新的代码后直接对新页面操作就会失效 )
            3. callback：
                当改变数据后，要基于更新后的新 DOM 进行某些操作时，要在 nextTick 所指定的回调函数中执行
     -->
     
</template>

<script>
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
                // input 获取焦点
                /* 
                    这里直接执行 this.$refs.editinput.focus() 不会生效
                    因为 Vue 发现数据改变会在整个回调结束后再渲染页面(效率问题)，所以 input 没出现前这行就执行完了
                        1、定时器，延时获取焦点(不推荐)
                        2、this.$nextTick(()=>{
                            会在 DOM 节点更新完毕后执行，在这里写
                            this.$refs.inputfoc.focus()
                        })
                    使用 v-if 不仅可以使用 $nextTick，也可使用 自定义指令写
                        autofocus: {
                            inserted(element){
                                element.focus()
                            }
                        }
                */
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