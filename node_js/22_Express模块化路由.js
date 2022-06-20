
/* 
    创建 Express 路由模块
*/
// 1、导入 express
const express = require('express')
// 2、创建路由对象
const router = express.Router()
// 3、挂载具体的路由
router.get('/user/list',(req,res)=>{
    res.send('get user list')
})
router.post('/user/list',(req,res)=>{
    res.send('add new user')
})
// 4、向外导出路由对象
module.exports = router

/* 
    为路由模块添加前缀
        类似于托管静态资源时为静态资源统一挂载的访问前缀一样
        路由模块添加前缀的方式
            app.use('/api',userRouter)
*/