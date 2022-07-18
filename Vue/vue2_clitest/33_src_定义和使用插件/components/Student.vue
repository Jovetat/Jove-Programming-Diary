<template>
    <div>
        <h3>{{name | mySlice}}</h3>
        <h3 v-big="age"></h3>
        <h3>vm & vc 都含有数据 x:{{x}}--y:{{y}}</h3>
        <button @click="usePrototype">使用原型身上的方法</button>
    </div>
</template>

<script>
    /* 
        定义和使用插件
            详细请看 plugins.js 文件
    */

    export default {
        name: 'Student',
        data() {
            return {
                name: '苏打绿,我还有话要说',
                age: 50,
            }
        },
        methods: {
            usePrototype(){
                this.hello()
            }
        },
    }
</script>

<style>
</style>