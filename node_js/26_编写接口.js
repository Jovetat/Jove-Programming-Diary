
/* 
    使用 Express 写接口
        1、创建基本的服务器
            // 导入 express 模块
                const express = require('express')
            // 创建 web 服务器实例
                const app = express()
            // 调用 app.listen(端口号，启动成功后的回调函数) ，启动服务器
                app.listen(80,()=>{
                    console.log('server running at http://127.0.0.1')
                })
        2、创建 API 路由模块(创建过程在 26附中)
*/
// 导入 express 并创建服务器实例
const express = require('express')
const app = express()

// 导入路由模块
const router = require('./26附_路由apiRouter')

// 如果要获取 URL-encoded 格式的请求体数据，必须配置中间件 app.use(express.urlencoded({ extended:false }))
app.use(express.urlencoded({ extended:false }))
// 把路由模块注册到 app 上
app.use('/api',router)

app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})