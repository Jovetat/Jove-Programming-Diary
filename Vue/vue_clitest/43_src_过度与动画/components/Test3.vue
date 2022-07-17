<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition name="animate__animated animate__bounce" appear
            enter-active-class="animate__zoomInDown"
            leave-active-class="animate__hinge"
        >
            <h1 v-show="isShow">我早已习惯没有你的夜</h1>
        </transition>
    </div>
</template>

<script>
    /* 
        关于 动画效果 详细请看 Test.vue
    */

    // 引入第三方动画库 animate.css
    import 'animate.css'

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
        background: #8b9ac2;
    }
</style>