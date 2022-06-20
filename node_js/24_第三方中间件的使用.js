
/* 
    演示第三方中间件的使用
        body-parser 第三方中间件，用于解析请求体数据
        (* 作用与 Express 内置的中间件作用相同，这里只是演示如何使用第三方中间件)
        (Express 内置的 express.unlencoded 中间件，就是基于 body-parser 这个第三方中间件进一步封装出来的)
            1) npm i body-parser
            2) 使用 require 导入中间件
            3) 调用 app.use() 注册并使用中间件
*/

const express = require('express')
const app = express()
// 1、导入解析表单数据的中间件 body-parser
const parser = require('body-parser')

// 2、使用 app.use() 注册中间件
app.use(parser.urlencoded({ extended: false }))
app.post('/user',(req,res)=>{
    // 如果没有配置任何解析表单数据的中间件，则 req.body 默认等于 undefined
    console.log(req.body)
    res.send('200:ok')
})

app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})