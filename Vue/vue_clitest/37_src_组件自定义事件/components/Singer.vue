<template>
    <div class="demo">
        <h2>{{name}}</h2>
        <h2>{{works}}</h2>
        <button @click="sendWorks">ref向父组件传递变量</button>
        <button @click="unbind">解绑自定义事件</button>
        <button @click="death">销毁当前组件实例</button>
    </div>
</template>

<script>

    export default {
        name: 'Singer',
        data() {
            return {
                name: '吴青峰',
                works: '再遇见',
            }
        },
        methods: {
            sendWorks(){
                // 触发 vc 身上的 App 绑定的 singerEvent 事件
                this.$emit('singerEvent',this.works)
            },
            unbind(){
                // 解绑一个自定义事件
                this.$off('singerEvent')
            },
            death(){
                console.log('完了，可毁了')
                // 销毁 vc
                this.$destroy()
            }
        },
    }

    /* 
        组件的自定义事件
            详情请看 App 组件
     */

</script>

<style scoped>
    .demo{
        background-color: #b94f4f;
        padding: 3px 20px 3px 20px;
        margin-top: 10px;
    }
    .demo h2{
        color: rgb(255, 255, 255);
    }
</style>