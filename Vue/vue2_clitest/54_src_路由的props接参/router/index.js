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
            path: '/about',
            component: About
        },
        {
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
                            // 使用占位符声明接收 params 参数
                            path: 'detail/:id/:title',
                            component: Detail,
                            // 1、props 的对象写法，该对象中的所有 key-value 都会以 props 的形式传给路由组件(传递的是死数据)
                            // props: {a:1,b:'hello'}
                            // 2、props 的布尔值写法，若布尔值为真，就会把该路由组件收到的 params 参数，以 props 的形式传给路由组件
                            // props: true
                            // 3、props 的函数写法，函数返回的对象中每一组 key-value 都会通过 props 传给路由组件
                            props(route){
                                return {
                                    id: route.params.id,
                                    title: route.params.title,
                                    // 也可写 query 的传参
                                    // name: routes.query.name,
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
})


/*  
    路由的 props 配置接收传参

        1. 作用：让路由组件更方便的收到参数(包括 query 与 params)

        2. 使用 props 配置          在路由中接收参数
            {
                path: 'detail/:id/:title',
                component: Detail,
                props:
                    1) props 值为对象 (传递的是死数据)
                        (1) 对象中所有的 key-value 都会以通过 props 的形式传给路由组件
                        (2) props: {键:值, b:'hello', …… }
                        (3) 子路由组件中接收
                            props: ['键','b', …… ],
                    2) props 值为布尔值 (将 params 转 props，不会接收 query)
                        (1) 若布尔值为真，就会把该路由组件收到的 params 参数，以 props 的形式传给路由组件
                        (2) props: true
                        (3) 子路由组件中接收
                            props: ['params参数1','title', …… ]
                    3) props 值为回调函数 (params 与 query 都可以接收)
                        (1) 函数返回的对象中每一组 key-value 都会通过 props 传给路由组件
                        (2) 路由配置中写法
                            props(route){
                                回调传入 route 为子路由组件中的 $route
                                return {
                                    id: route.query.id,
                                    title: route.query.title,
                                    name: route.params.name
                                }
                            }
                        (3) 子路由组件中接收
                            props: ['params参数1 name','query参数1 id', …… ]
            }


*/