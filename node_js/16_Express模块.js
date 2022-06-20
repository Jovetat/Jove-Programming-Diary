
/* 
    Express
        定义：基于 Node.js 平台，快速、开放、极简的 web 开发框架
        (作用与 http 模块类似，专门用来创建 web 服务器的)
    
    最常见的两种服务器(express 都可以快速创建)：
        web 网站服务器：对外提供 web 网页资源的服务器
        API 接口服务器：对外提供 API 接口的服务器

    安装
        npm install(i) express

*/

// 创建基本的 web 服务器
// 1、导入 express 模块
const express = require('express')
// 2、创建 web 服务器实例
const app = express()

// 3、调用 app.listen(端口号，启动成功后的回调函数) ，启动服务器
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})