<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition name="hello" appear>
            <!-- appear 第一次渲染的时候触发出现动画 -->
            <h1 v-show="isShow">灰色的梦睡在我身边</h1>
        </transition>
    </div>
</template>

<script>
    /* 
        关于 动画效果 详细请看 Test.vue
    */

    export default {
        name: 'Test2',
        data() {
            return {
                isShow: true
            }
        },
    }
</script>

<style scoped>
    h1{
        background: #8bc29b;
    }
    
    /* 进入的起点 和 离开的终点 简写在一起 */
    .hello-enter , .hello-leave-to{
        transform: translateX(-100%);
    }
    .hello-enter-active , .hello-leave-active{
        transition: 1.2s;
    }
    /* 进入的终点 和 离开的起点 简写在一起 */
    .hello-enter-to , .hello-leave{
        transform: translateX(0);
    }
    /* 离开的起点
    .hello-leave{
        transform: translateX(0);
    }
    离开的终点
    .hello-leave-to{
        transform: translateX(-100%);
    } */

</style>