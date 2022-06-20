
/* 
    自定义中间件
        1、定义中间件
            使用 app,use() 来定义全局生效的中间件
                app.use( function(req,res,next)=>{} )
        2、监听 req 的 data 事件，获取客户端发送到服务器的数据
            如果数据量较大，无法一次性发送完毕，则客户端会把数据切割后，分批发送到服务器
            所以 data 事件可能会被触发多次
            每一次触发 data 事件，获取到数据只是完整数据的一部分，需要手动对接收到的数据进行拼接
            req.on('data',(chunk) =>{ })
        3、监听 req 的 end 事件
            当请求体数据接收完毕之后，会自动触发 req 的 end 事件
            在 req 的 end 事件中，拿到并处理完整的请求体数据
        4、使用 querystring 模块解析请求体数据
            Node.js 内置了一个 querystring 模块，专门用来处理查询字符串
            通过这个模块提供的 parse对象，可以将查询字符串解析为 object
        5、将解析出来的数据对象挂载为 req.body
            上下游路由之间共享 req 和 res，将解析出来的数据挂载为 req 的自定义属性，命名为 req.body
        6、将自定义中间件封装为模块
            为优化代码的结构，将自定义的中间件函数，封装为独立的模块
    
    自定义中间件使用方法
        const customBodyParser = require('./25_自定义中间件封装.js')
        app.use(customBodyParser)
*/
/* // 用于测试
const express = require('express')
const app = express() */

// 导入 Node.js 内置的 querystring 模块
const qs = require('querystring')
/* 封装一个解析表单数据urlencoded的中间件 */
const bodyParse = (req,res,next)=>{
    // 具体业务逻辑
    // 1、定义一个 str 字符串，专门用来存储客户端发送来的请求体数据
    let str = ''
    // 2、监听 req 的 data 事件
    req.on('data',(chunk)=>{
        str += chunk
    })
    // 3、监听 req 的 end 事件(请求体发送完毕后自动触发)
    req.on('end',()=>{
        // 在 str 中存放的时完整的请求体数据
        console.log(str)
        // TODO：把字符串格式的请求体数据，解析成对象格式
        const body = qs.parse(str)
        console.log(body)
        req.body = body
        next()   // 必须写在 end 事件内部
    })
}
module.exports = bodyParse

/* // 用于测试
app.use(bodyParse)
app.post('/user',(req,res)=>{
    res.send(req.body)
})
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
}) */