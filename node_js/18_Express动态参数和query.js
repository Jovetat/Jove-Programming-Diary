
/* 
    Express 的基本使用
        通过 URL 携带的查询参数
            1、客户端通过 ?name=zs&age=20 查询字符串的形式，发送到服务器的参数
            2、req.query 对象
                默认是一个空对象
                通过 req.query 访问客户端发送到服务器的查询字符串参数
                    req.query.name  req.query.age
        获取 URL 中通过 : 匹配到的动态参数 ( /:动态参数名 )
            req.params 动态匹配到的 URL 参数，默认是空对象
                req.params.动态参数名
*/
const express = require('express')
const app = express()
// GET http://127.0.0.1/user?name=shiyuan&age=18
app.get('/user',(req,res)=>{
    console.log(req.query)
    // { name: 'shiyuan', age: '18' }
    res.send(req.query)
})
app.post('/user',(req,res)=>{
    console.log(req.query.name)
    res.send(req.query)
})

// URL 动态参数获取( /:id 是一个动态的参数)
// GET http://127.0.0.1/user/10086 
app.get('/user/:id',(req,res)=>{
    console.log(req.params)
    // { id: ':10086' }
    res.send(req.params)
})
// 多个动态参数
// GET http://127.0.0.1/home/zs/125
app.get('/home/:id/:name',(req,res)=>{
    console.log(req.params)
    // { id: 'zs', name: '125' }
    res.send(req.params)
})
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})