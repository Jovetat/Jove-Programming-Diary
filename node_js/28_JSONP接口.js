
/* 
    JSONP 接口
        JSONP 的概念与特点
            定义：浏览器通过 <script> 标签的 src 属性，请求服务器上的数据，同时，服务器返回一个函数的调用，这种便称为 JSONP
            特点：
                1、JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象
                2、JSONP 仅支持 GET 请求
            创建 JSONP 接口的注意事项
                如果项目中已经配置了 CORS 跨域资源共享，为了防止冲突，必须在配置 CORS 中间件 之前 声明 JSONP 的接口
                (否则 JSONP 接口会被处理成开启了 CORS 的接口)
            实现 JSONP 接口的步骤：
                1、获取客户端发送过来的回调函数的名字
                2、得到要通过 JSONP 形式发送给客户端的数据
                3、根据前两步得到的数据，拼接出一个函数调用的字符串
                4、把上一步拼接得到的字符串，响应给客户端的 <script> 标签进行解析执行
*/
const express = require('express')
const app = express()

// JSONP 接口
app.get('/api/jsonp',(req,res)=>{
    // 1、获取客户端发送过来的回调函数的名字
    const funcName = req.query.callback
    // 2、得到要通过 JSONP 形式发送给客户端的数据
    const data = { name: 'zs',age: 22 }
    // 3、根据前两步得到的数据，拼接出一个函数调用的字符串
    const scriptStr = '$(funcName)(${JSON.stringify(data)})'
    // 4、把上一步拼接得到的字符串，响应给客户端的 <script> 标签进行解析执行
    res.send(scriptStr)
})

app.use(express.urlencoded({ extended: false }))

const cors = require('cors')
app.use(cors())


const router = require('./26附_路由apiRouter')
app.use(express.urlencoded({ extended:false }))
app.use('/api',router)
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})