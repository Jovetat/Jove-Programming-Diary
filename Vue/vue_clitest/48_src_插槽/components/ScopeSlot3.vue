<template>
    <div class="category">
        <h3>{{title}}分类</h3>
        <!-- TODO；数据在子组件内，但通过父组件产生不同的结构 -->
        <slot :games2="games2" msg="hello world">标签内为默认值</slot>
        <!-- 通过插槽向使用插槽的地方传递数据 -->
    </div>
</template>

<script>
    /* 
        作用域插槽
            详细请看 App.vue
    */
   
    export default {
        name: 'ScopeSlot3',
        data() {
            return {
                games2: ['战地','GTA','QQ农场','QQ牧场']
            }
        },
        props: ['title']
    }
</script>

<style lang="css">
    .category{
        background-color: aliceblue;
        width: 200px;
        height: 300px;
        margin: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h3{
        width: 98%;
        text-align: center;
        background-color: #fab6b6;
    }
</style>