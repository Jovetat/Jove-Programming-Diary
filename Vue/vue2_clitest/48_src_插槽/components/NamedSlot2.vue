<template>
    <div class="category">
        <h3>{{title}}分类</h3>
        <!-- 定义一个插槽(挖个坑，等组件使用者填充) -->
        <slot name="center">标签内为默认值，当使用者没有传递具体结构使出现</slot>
        <!-- 定义多个插槽 -->
        <slot name="footer">又一个插槽</slot>
    </div>
</template>

<script>
    /* 
        具名插槽
            详细请看 App.vue
    */
   
    export default {
        name: 'NamedSlot2',
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