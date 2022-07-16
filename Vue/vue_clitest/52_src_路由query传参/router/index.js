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
                            path: 'detail',
                            component: Detail
                        }
                    ]
                }
            ]
        }
    ]
})