<template>
    <div class="demo">
        <!-- 1、组件的结构 -->
        <h2>学校名称：{{name}}</h2>
        <h2>学校地址：{{address}}</h2>
        <button @click="showLove">点击变笨</button>
    </div>
    <!-- 相较于非单组件的优势：样式也包含在内 -->
</template>

<script>
        // 2、组件交互相关的代码(数据、方法等等)

    /*  组件暴露
            (1) 分别暴露
                export const school = Vue,extends({})
            (2) 统一暴露
                在 script 最后 export{ school }
            (3) 默认暴露
                export default school
                当只暴露一个时，默认暴露引入的时候比较简单
    */
    /*  const school = Vue.extends({
            data(){},
            methods: {},
        })
        export default school
        将以上内容可以简写为：这届暴露组件的配置对象
     */
    export default {
        name: 'School',
        data(){
            return {
                name: '南德学院',
                address: '山东菏泽',
            }
        },
        methods: {
            showLove(){
                alert(this.name + '❤')
            }
        },
    }
</script>

<style>
        /* 3、组件的样式 */
    .demo{
        background-color: #e78888;
    }
</style>