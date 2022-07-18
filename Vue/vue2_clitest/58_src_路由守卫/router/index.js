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
const router =  new VueRouter({
    routes: [
        {
            name: 'guanyu',
            path: '/about',
            component: About,
            meta: {title: '关于'}
        },
        {
            name: 'zhuye',
            path: '/home',
            component: Home,
            meta: {title: '主页'},
            children: [
                {
                    name: 'xinwen',
                    path: 'news',
                    component: News,
                    meta:{ isAuth: true , title: '新闻'},
                    beforeEnter(to,from,next){
                        // 逻辑同全局前置路由守卫
                        console.log('独享路由守卫 beforeEnter')
                        if(to.meta.isAuth){
                            // 判断当前路由是否需要进行权限控制
                            if(localStorage.getItem('school') === 'xbmu'){
                                // 权限控制的具体规则
                                next()
                            }else{
                                alert('暂无权限查看')
                            }
                        }else{
                            next()
                        }
                    }
                },
                {
                    name: 'xiaoxi',
                    path: 'message',
                    component: Message,
                    meta:{ isAuth: true , title: '消息'},
                    children: [
                        {
                            name: 'xiangqing',
                            path: 'detail',
                            component: Detail,
                            meta:{ isAuth: true , title: '详情'},

                            props(route){
                                return {
                                    id: route.query.id,
                                    title: route.query.title
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
})

// 添加全局前置路由守卫
router.beforeEach((to,from,next)=>{
    console.log('全局前置路由守卫 beforeEach',to,from)
    // 写在全局的跳转判断，为展示其他路由所以分别使用了独享路由和组件内路由
    /* if(to.meta.isAuth){
        // 判断当前路由是否需要进行权限控制
        if(localStorage.getItem('school') === 'xbmu'){
            // 权限控制的具体规则
            next()
        }else{
            alert('暂无权限查看')
        }
    }else{
        next()
    } */
    next()
})

// 添加全局后置路由守卫
router.afterEach((to,from)=>{
    console.log('全局后置路由守卫 afterEach',to,from)
    if(to.meta.title){ 
        document.title = to.meta.title //修改网页的title
    }else{
        // 初始页面没有路由，所以不会有名字
        document.title = '不配有名字'
    }
})

export default router

/* TODO:查看 Message 与 News 路由需本地存储 school 的值为 xbmu */
/* 
    路由守卫
        1. 作用：控制路由权限
        2. 分类：全局守卫、独享守卫、组件内守卫

        3. 全局守卫 (本文件内查看案例)
            1) 调整路由器配置
                (1) meta 配置项用于存放用户自定义数据 (meta 称为路由元信息)
                    a、添加 标识本路由是否需要权限校验 的属性 (约定俗成称作 isAuth)
                    b、 meta:{ isAuth: bool值 }
                    c、需向子路由也添加该配置，否则用户可通过路径直接跳过来
                (2) 不直接暴露，接收 路由器router 便于后续操作
                    const router =  new VueRouter({})
                        对 router 进行一系列操作后再暴露
                    export default router
            2) 添加全局前置路由守卫
                router.beforeEach( (to,from,next)=>{
                    (1) 在每一次路由 初始化时 及 切换之前 都会执行此回调
                    (2) 参数
                        to      目标路由(目的)
                        from    出发路由(来自)
                        next    允许路由跳转(放行)
                    (3) 跳转权限判断
                        if( to.meta.isAuth && 某个条件 ){
                            a、路由器配置需权限校验 且 达成某个条件才可跳转
                                next()
                            b、条件未达成路径不会改变
                            c、这里的路由器权限校验的配置项是自定义出来的，也可以自己写 path/name 等判断，只是这样较为方便
                        }
                })

            3) 添加全局后置路由守卫
                router.afterEach( (to,from)=>{
                    (1) 在每一次路由 初始化时 及 切换之后 都会执行此回调
                    (2) 参数
                        to      目标路由(目的)
                        from    出发路由(来自)
                    (3) 此时路由跳转已经完成
                    (4) 如果未能成功跳转[next()未调用]，后置路由守卫不会执行
                })
        
        4. 独享路由守卫 (本文件内查看案例)
            1) 在路由器 router/index.js 中为需独享路由守卫的路由添加 beforeEnter函数 配置项
            2)  {
                    path: '/about',
                    component: About,
                    beforeEnter(to,from,next){
                        (1) beforeEnter 为该路由单独使用的守卫
                        (2) 在进入该路由之前会执行此回调
                        (3) 参数
                            to      目标路由(目的)
                            from    出发路由(来自)
                            next    允许路由跳转(放行)
                        (4) 跳转权限判断 (同全局前置路由守卫)
                        (5) 独享路由守卫只有前置没有后置
                    }
                },

        5. 组件内路由守卫 (page/Message.vue 中查看案例)
            1) 在 路由组件 中添加路由守卫
            2)  {
                    name: 'Message',
                    data(){ return{} }
                    (1) beforeRouteEnter (to, from, next) {
                            a、进入守卫：通过路由规则后，进入该路由组件前被调用
                            b、通过前置路由(全局和独享)守卫的跳转判断才会执行 进入守卫
                            c、是否可进入判断后     next()
                            d、直接路由组件被当作普通组件引入页面时，进入守卫不会被调用
                        },
                    (2) beforeRouteLeave (to, from, next) {
                            a、离开守卫：通过路由规则后，离开该路由组件前被调用
                            b、是否可离开判断后     next()
                            c、直接路由组件被当作普通组件引入页面时，离开守卫不会被调用
                        }
                }
        
        6. 执行顺序
            全局路由守卫 beforeEach --通过判断--> 独享路由守卫 beforeEnter --通过判断--> 组件内进入守卫 beforeRouteEnter
            --> 全局后置路由守卫 afterEach --> 离开前调用(决定是否可离开) beforeRouteLeave
        
        7.注
            添加路由守卫，需向对应子路由也添加，否则用户可通过路径直接跳到子路由内

*/