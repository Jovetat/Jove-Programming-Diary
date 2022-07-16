/* 
    该文件用于创建整个应用的路由器
*/
// 引入 vue-router
import VueRouter from 'vue-router'
// 引入组件
import About from '../pages/About'
import Home from '../pages/Home'
import News from '../pages/News'
import Message from '../pages/Message'


// 创建一个路由器
export default new VueRouter({
    routes: [
        {
            // 一级路由
            path: '/about',
            component: About
        },
        {
            // 二级路由
            path: '/home',
            component: Home,
            children: [
                {
                    // 这里给多级路由命名不显得您路由命名它方便嘛 ~
                    name: 'journalism',
                    path: 'news',
                    component: News
                },
                {
                    path: 'message',
                    component: Message
                }
            ]
        }
    ]
})

/* 
    路由
        1. 简介
            1) 一个路由(route) 就是一组映射关系(key - value)，多个路由需要 路由器(router) 进行管理
            2) key 是路径，value 是 component组件 或 function函数
        2. 路由分类
            1) 前端路由
                (1) key 是路径，value 是 component组件，用于展示页面内容 (route规则: /play --> 播放组件)
                (2) 工作过程：当浏览器的路径改变时，对应的组件就会显示
                (3) 路由的目的是为实现 SPA
            2) 后端路由
                (1) key 是路径，value 是 function函数，用于处理客户端提交的请求
                (2) 工作过程：服务器收到一个请求时，根据请求路径找到匹配的函数来处理请求，返回响应数据
        2. 关于 SPA(single page web application) 单页面应用
            1) 整个应用只有一个完整的页面
            2) 点击页面中的导航链接不会刷新页面，只会做页面的局部更新
            3) 数据需要通过 ajax 请求获取

    vue-router
        1. 简介
            vue 的一个插件库，专门用来实现 SPA应用
        2. 搭建 vue-router 使用环境
            1) 项目目录下安装 vue-router
                npm i vue-router@3
                    vue3 对应 vue-router4(默认情况安装的为4版本)
                    vue2 对应 vue-router3
            2) 在 router/index.js 中 (创建路由所用的文件 router/index,js)
                (1) 引入 vue-router
                    import VueRouter from 'vue-router'
                (2) 引入路由组件
                    import 组件 from '../pages/路由组件'
                (3) 创建并暴露一个路由器实例对象，管理一组一组的路由规则
                    export default new VueRouter({
                        routes: [
                            {
                                path: '/路径',
                                component: 对应路由组件
                            }, ……
                        ]
                    })
            3) 在 main.js 中
                (1) 引入 vue-router
                    import VueRouter from 'vue-router'
                (2) 引入路由器
                    import router from './router/index'
                (3) 应用 vue-router 插件
                    Vue.use( VueRouter )
                (4) 创建 vm 时传入 router 配置项
                    new Vue({ ... router, ... })

        3. 实现路由
            1) router-link 标签实现路由组件的切换
                <router-link to="/path" active-class="active"> 内容 </router-link>
                    (1) to="/路由组件对应的路径path"
                    (2) active-class="被激活时添加的样式" 
                        (指定该元素被激活时的样式)
                    (3) router-link 最终会 vue 转为 a标签
            2) 展示相应的路由组件
                <router-view></router-view>
                    (在结构中选择位置展示路由组件)
        
        4. 注意事项
            1) 路由组件通常存放在 pages 文件夹，一般组件通常存放在 components 文件夹
                (路由组件：通过路径匹配，路由器渲染的组件称为路由组件[不需要写组件标签])
            2) 通过切换，"消失" 了的路由组件，默认会被销毁掉，需要的时候再去挂载
            3) 每个 路由组件 都有自己的 $route 属性，存储着自身路由信息
            4) 整个应用的路由器 router(只有一个)，可以通过组件的 $router 属性获取到
        
        5. 多级路由(嵌套路由)
            1) 使用 children 配置项
                (1) 在 router/index.js 重新配置路由规则
                (2) 通过 children 配置子级路由
                (3) 其他路由正常配置
                routes:[
                    {
                        path: '/路径',                         '/home'
                        component: 对应路由组件,                Home
                        children: [
                            {
                                path: '子路由路径',             'news'，此处一定不要写：'/news'
                                component: 对应子路由组件       News
                            }, ……
                        ]
                    }, ……
                ]
            2) router-link 子路由组件的切换
                <router-link to="/home/news" active-class="active">News</router-link>
                    (这里 to="需写子路由组件在路由配置中完整的路径")
            3) 展示相应的路由组件   <router-view></router-view>
        
        6. 命名路由
            1) 作用：可以简化路由的跳转
            2) 使用命名路由
               (1) 给路由命名：
                    {
                        // 添加 name 配置
                        name: '路由名'
                        path:'/about',
                        component: About
                    }
                (2) 简化跳转：
                    a、简化前，需要写完整的路径
                        <router-link to="/home/news">跳转</router-link>
                    b、简化后，直接通过名字跳转
                        <router-link :to="{name:'journalism'}">跳转</router-link>
                    c、简化写法配合传递参数(52中详细介绍传参)
                        <router-link 
                            :to="{
                                name:'journalism',
                                query:{
                                    id:666,
                                    title:'你好'
                                }
                            }"
                        >跳转</router-link>

*/