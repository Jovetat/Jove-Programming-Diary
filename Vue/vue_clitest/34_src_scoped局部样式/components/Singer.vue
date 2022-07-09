<template>
    <div class="demo">
        <h2 class="text">{{name}}</h2>
        <h2 class="text">{{works}}</h2>
    </div>
</template>

<script>

    export default {
        name: 'Singer',
        data() {
            return {
                name: '杨丞琳',
                works: '年轮说',
            }
        },
    }

    /* 
        scoped 局部样式

        1. 作用：让样式在局部生效，防止冲突
            引入组件时，最终所有样式会被汇总到一起，就会引起冲突
            后引入的组件中的样式会覆盖先前组件的同名样式

        2. 写法：
            <style scoped>
        
        3. 实现原理
            (1) 为组件最外层 div 添加特殊的标签属性，标签属性的结尾是随机生成的(每次刷新都会不同)
                <div data-v-17390bac class="demo"><h2 data-v-17390bac class="text">
            (2) 再配合标签属性选择器(选择含有该属性的标签)实现控制指定的 div
                .text[data-v-17390bac]{ }   控制局部的 class 选择器
        
        4. App 组件内不适用该 scoped 标签
            当 App 的 style 使用 scoped 后，子组件无法获取到 App 中的样式
            *App 内的 style 一般写很多组件都会用的样式(全局样式)

        5. Vue 中还可通过 <style lang="less" 等使用其他样式语言(需安装额外包，eg：less-loader)
        
        6. 附：
            脚手架在解析 vue 文件时，先做引入，在读取配置项，最后解析模板
    */

</script>

<style scoped>
    .demo{
        background-color: #b94f4f;
    }
    .text{
        color: rgb(255, 255, 255);
    }
</style>