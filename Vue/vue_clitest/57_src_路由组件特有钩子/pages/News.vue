<template>
    <ul>
        <!-- TODO：h3透明度循环变化
            且路由组件被缓存时，切走路由定时器停止
         -->
        <h3 :style="{opacity}">冬眠假期刚刚结束</h3>
        <li>news001 <input type="text"></li>
        <li>news002 <input type="text"></li>
        <li>news003 <input type="text"></li>
    </ul>
</template>

<script>

    /* 
        路由组件独有的生命周期钩子
            1. 用于捕获路由组件的激活状态
            2. 具体名字：
                (1) activated
                    路由组件被激活时触发
                (2) deactivated
                    路由组件失活时触发
    */

    export default {
        name: 'News',
        data() {
            return {
                a: false,
                opacity: 1
            }
        },
        activated() {
            console.log('News 路由组件激活')
            this.timer = setInterval(()=>{
                console.log('引线在燃烧')
                this.opacity = this.opacity <=0 ? 1 : this.opacity - 0.01
            },16)
        },
        deactivated() {
            console.log('News 路由组件失活')
            clearInterval(this.timer)
        },
        beforeDestroy() {
            console.log('News 路由组件被销毁了')
            // clearInterval(this.timer)
        },
        mounted() {
            // 因为组件缓存，当路由切换定时器仍在执行
            /* this.timer = setInterval(()=>{
                this.opacity = this.opacity <=0 ? 1 : this.opacity - 0.01
            },16) */
        },
    }
</script>