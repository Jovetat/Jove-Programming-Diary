<template>
    <div>
        <button @click="isShow = !isShow">显示/隐藏</button>
        <transition name="hello" appear>
            <!-- appear 第一次渲染的时候触发出现动画 -->
            <h1 v-show="isShow">当我离你远去那一天</h1>
        </transition>
        <transition-group name="hello" appear>
            <h1 v-show="isShow" key="1">蓝色的雨下在我眼前</h1>
            <h1 v-show="!isShow" key="2">骄傲的泪不敢弃守我眼睛</h1>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name: 'Test',
        data() {
            return {
                isShow: true
            }
        },
    }

    /* 
        Vue 封装的过度与动画

            1. 作用：
                插入、更新或移除 DOM元素时，在合适的时候 Vue 给元素添加样式类名

            2. 使用方法：

                1) 使用 <transition> 包裹需要过度的元素，并配置 name 属性：
                    (1)
                        <transition name="hello">
                            <h1 v-show="isShow">你好啊！</h1>
                        </transition>
                        (transition 不会被渲染)

                    (2) appear：
                        transition 标签添加该属性，会使第一次渲染的时候触发出现动画 

                2) 备注：若有多个元素节点需要过度，则需要使用：
                    (单个元素节点内包含多个元素可以使用 普通的transition[节点内过度都相同，节点不同过度请使用多节点 group])

                    <transition-group>      每个元素都要指定 key 值
                
                3) 准备好样式：
                    (1) 配置 name 样式名为 name-enter/leave-
                        未配置 name 样式名为 v-enter/leave-

                    (2) 规定过程的动画过度
                        a、进入/离开过程中的动画样式    Test
                            .v-enter-active{
                                animation: 动画名 1s(动画时长);
                            }
                        b、配合关键帧
                            @keyframes 动画名{}
                    
                    (3) 规定起点和终点的动画过度        Test2
                        a、元素 进入enter/离开leave 时的样式

                            .v-enter{}          元素进入的起点的样式
                            .v-enter-to{}       元素进入的终点的样式

                            .v-leave{}          元素离开的起点的样式
                            .v-leave-to{}       元素离开的终点的样式

                        b、规定动画市场
                            常规方法
                                transition: 1.2s;   在元素的样式中规定动画时长
                            但为不破坏原先元素样式，所以推荐下述方法规定动画时长
                                .v-enter-active , .v-leave-active{
                                    transition: 1.2s;
                                }
                    
            3. 原理
                Vue 在过度动画实现的过程中，依次为元素加了三个样式的类名
                       v-enter ---->  v-enter-to
                       v-leave ---->  v-leave-to
                    【-- v-enter/leave-active --】

        集成第三方动画      animate.css     Test3
            1. 安装
                npm install animate.css
            2. 引入
                import 'animate.css'
            3. 配置
                <transition name="animate__animated animate__bounce">
                (普通使用应将这两个类添加到元素 class，Vue框架下应添加到 transition 的 name 上)
            4. 选择动画
                在 transition 标签中
                    (1) 添加进入动画
                        enter-active-class="在官网选择动画并复制其对应名称"
                    (2) 添加退出动画
                        enter-active-class="在官网选择动画并复制其对应名称"
            5. 官网：https://animate.style/

    */

</script>

<style scoped>
    h1{
        background: #8bc29b;
    }

    /* 动画过程 */
    .hello-enter-active{
        animation: movean 1s;
    }
    .hello-leave-active{
        animation: movean 1s reverse;
        /* 反转 */
    }
    /* 定义关键帧 */
    @keyframes movean {
        from{
            transform: translateX(-100%);
        }
        to{
            transform: translateX(0px);
        }
    }
</style>