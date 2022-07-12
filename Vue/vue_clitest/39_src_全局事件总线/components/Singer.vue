<template>
    <div class="demo">
        <h2>{{name}}</h2>
        <h2>{{works}}</h2>
    </div>
</template>

<script>

    export default {
        name: 'Singer',
        data() {
            return {
                name: '法老',
                works: '花，太阳，雨和你',
            }
        },
        mounted() {
            // 接收数据
            this.$bus.$on('hello',(data)=>{
                console.log('Singer 收到数据：',data)
            })
        },
        beforeDestroy() {
            this.$bus.$off('hello')
        },
    }

    /* 
        全局事件总线
            详情请看 main.js
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