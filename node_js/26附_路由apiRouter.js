
/* 创建路由模块 */
const { query } = require('express')
const express = require('express')
// 1、创建路由实例
const router = express.Router()
// 2、挂载对应路由
router.get('/get',(req,res)=>{
    // 通过 req.query 获取客户端通过查询字符串，发送到服务器的数据
    // 通过 res.send() 方法，向客户端响应处理
    res.send({
        status: 200,                // 状态的描述
        msg: 'GET 请求成功',
        data: res.query
    })
})
router.post('/post',(res,req)=>{
    // 1、获取客户端通过请求体，发送到服务器的 URL-encoded 数据
    // 如果要获取 URL-encoded 格式的请求体数据，必须配置中间件 app.use(express.urlencoded({ extended:false }))
    const body = req.body
    res.send({
        status: 200,                // 状态的描述
        msg: 'POST 请求成功',
        data: body
    })
})
// 3、暴露路由供外界使用
module.exports = router