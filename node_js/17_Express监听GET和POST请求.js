
/* 
    监听 GET 请求
        app.get(请求的 URL 字符串，回调函数(req,res){} )
            req：请求对象(包含了与请求相关的属性和方法)
            res：响应对象(包含了与响应相关的属性和方法)
    
    监听 POST 请求
        app.post(请求的 URL 字符串，回调函数(req,res){} )
            req：请求对象(包含了与请求相关的属性和方法)
            res：响应对象(包含了与响应相关的属性和方法)
    
    把内容 响应 给客户端
        通过 res.send() 方法，将处理好的内容发送给客户端
        app.get/post('/user'，(req,res)=>{
            // 向客户端发送 JSON 对象
            res.send({ name: 'zs',age: 20 })
        } )
*/

// 1、导入 express 模块
const express = require('express')
// 2、创建 web 服务器实例
const app = express()
// 3、监听客户端的 GET 和 POST 请求，并向客户端响应具体的内容
app.get('/user',(req,res)=>{
    // 调用 express 提供的 res.send() 向客户端响应一个 JSON 对象
    res.send({
        name: '兜里没有糖',
        age: 20,
        gender: '男'
    })
})
app.post('/user',(req,res)=>{
    // 调用 express 提供的 res.send() 向客户端响应一个普通文本
    res.send('不是谁的十元')
})
// 4、调用 app.listen(端口号，启动成功后的回调函数) ，启动服务器
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})