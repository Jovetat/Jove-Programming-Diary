<template>
    <div>
        <h1 v-text="msg" ref="title"></h1>
        <button @click="showDOM">点我输出上方的 DOM 元素</button>
        <School ref="sch"/>
    </div>
</template>

<script>

    /* 
        ref 属性
            1. 作用：
                用来为元素或子组件注册引用信息 (Vue 中 id 的替代者)
            2. 应用在 html 标签上获取到的是 真实DOM元素，应用在组件标签上是 组件实例对象(vc)
                (传统的方式虽然也可以获取页面元素，但是无法获取到组件实例对象[获取到的是真实DOM])
                获取到 vc 便于组件间通信等一系列操作
            3. 使用方式：
                (1) 打标识
                    < ref="名称" >
                (2) 获取
                    this.$refs.名称
                    this.$refs 内存储着所有被获取到的 真实DOM 和 vc
    */

    import School from './components/School.vue'

    export default {
        name: 'App',
        components: {
            School
        },
        data() {
            return {
                msg: '暮色抚平你鬓间的白发'
            }
        },
        methods: {
            showDOM(){
                console.log(this.$refs.title)           // 真实 DOM
                console.log(this.$refs.sch)             // vc
                console.log(this.$refs)                 // 所有被获取的 vc 和 真实DOM
            }
        },
    }
</script>