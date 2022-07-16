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
import Detail from '../pages/Detail'

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
                    path: 'news',
                    component: News
                },
                {
                    path: 'message',
                    component: Message,
                    children: [
                        {
                            // 命名路由
                            name: 'xiangqing',
                            path: 'detail',
                            component: Detail
                        }
                    ]
                }
            ]
        }
    ]
})

/* 
    命名路由
        1. 作用：可以简化路由的跳转
        2. 使用命名路由
            1) 给路由命名：
                {
                    // 添加 name 配置
                    name: '路由名'
                    path:'/about',
                    component: About
                }
            2) 简化跳转：
                a、简化前，需要写完整的路径
                    <router-link to="/home/message/detail">跳转</router-link>
                b、简化后，直接通过名字跳转
                    <router-link :to="{name:'xiangqing'}">跳转</router-link>
                c、简化写法配合传递参数(52中详细介绍传参)
                    <router-link 
                        :to="{
                            name:'xiangqing',
                            query:{
                                id:666,
                                title:'你好'
                            }
                        }"
                    >跳转</router-link>

*/