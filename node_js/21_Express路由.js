
/* 
    路由
        广义定义：路由就是映射关系
            (eg: 10086 按键 0 -> 人工服务，这里路由就是按键与服务之间的映射)
    
    Express 中的路由
        定义：客户端请求与服务器处理函数之间的映射关系
        Express 中路由分三部分组成：
            请求的类型
                app.请求的类型[get/post/……](path,处理函数handler)
                eg：    app.post('/',(req,res)=>{
                            res.send('不是谁的十元')
                        })
            请求的 URL 地址
            处理函数

    路由的匹配过程
        当一个请求到达服务器后，需要先经过路由的匹配，只有匹配成功之后，才会调用对应的处理函数
        在匹配时
            按照路由定义的先后顺序进行匹配，如果请求类型和请求的 URL 同时匹配成功
            Express 会将这次请求转交给对应的 function 函数处理
    
    路由的使用
        最简单用法(之后用的比较少)
            将路由挂载到 app 实例上
                app.get('/user',(req,res)=>{ res.send('这世界那么多人') })
        模块化路由
            为了方便对路由进行模块化的管理，Express 不建议将路由直接挂载到 app 上，而是推荐将路由抽离为单独的模块
            将路由抽离为单独模块的步骤如下：
                1、创建路由模块对应的 .js 文件
                2、调用 express.Router() 函数创建路由对象
                3、向路由对象上挂载具体的路由
                4、使用 module.exports 向外共享路由对象
                5、使用 app.use() 函数注册路由模块
*/

/* 模块化路由的使用(注册) */
const express = require('express')
const app = express()
// 1、创建路由模块 22_Express模块化路由.js
// 2、3、4、在 22_ 内完成
// 5.1、导入路由模块
const userRouter = require('./22_Express模块化路由.js')
// 5.2、使用 app.use() 注册路由模块
app.use(userRouter)
// 路由模块添加前缀的方式 app.use('/api',userRouter)
// end 启动服务测试
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})

/* 
    app.use() 函数，用来注册全局中间件
*/