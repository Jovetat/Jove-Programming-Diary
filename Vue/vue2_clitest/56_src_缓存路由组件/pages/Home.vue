<template>
    <div>
        <h2>我是 Home 的内容</h2>
        <div>
            <ul class="nav nav-tabs">
                <li>
                    <router-link to="/home/news" active-class="active">News</router-link>
                </li>
                <li>
                    <router-link to="/home/message" active-class="active">Message</router-link>
                </li>
            </ul>
            <!--TODO: 在每个新闻后面加一个输入框，切回来的时候内容仍然存在(缓存路由组件) -->
            <!-- 单个路由组件缓存 -->
            <keep-alive include="News">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>

    /* 
        缓存路由组件
            1. 作用：让不展示的路由组件保持挂载，不被销毁 (当路由跳转时，不显示的路由默认会被销毁)
                从而使用户输入的某些内容不会消失

            2. 单个路由组件缓存：
                <keep-alive include="需缓存的路由组件名 News"> 
                    <router-view></router-view>
                </keep-alive>
                填写名称为路由组件中 name 配置的组件名，与路由器配置无关

            3. 全部路由组件缓存
                不写 include 将缓存所有展示的路由组件
                <keep-alive> 
                    <router-view></router-view>
                </keep-alive>

            4. 部分路由组件缓存：
                <keep-alive :include="['News','Message', ……]"> 
                    <router-view></router-view>
                </keep-alive>
            
            5. 部分路由组件缓存的另类实现思路
                1) 在路由配置中添加 meta 配置，设置 keepAlive 属性
                    {
                        path: '/about',
                        component: About,
                        meta: {
                            keepAlive: true             // 设置缓存
                        }
                    },
                2) 在页面使用
                    (1) 当 keepAlive 为 ture 走这里，页面会被渲染并且缓存
                    <keep-alive> 
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    (2) 当 keepAlive 为 false 走这里，页面会被渲染但不缓存
                    <router-view v-if="!$route.meta.keepAlive"></router-view>


    */

    export default {
        name: 'Home',
    }
    
</script>