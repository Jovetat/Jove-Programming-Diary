
/* 
    接口跨域的问题
        之前的 GET 和 POST 接口，不支持跨域请求（协议、域名、端口号任何一项不同都会产生跨域的问题）
        解决跨域问题的方案：
            1、CORS (主流的解决方案，推荐使用)
            2、JSONP (只支持 GET 请求)
        
        使用 cors 中间件解决跨域问题
            简介：cors 是 express 的一个第三方中间件，通过安装和配置 cors 中间件，可以方便的解决跨域问题
            使用步骤：
                1、npm i cors 安装中间件
                2、使用 const cors = require('cors') 导入中间件
                3、在路由之前调用 app.use(cors()) 配置中间件
            CORS (Cross-Origin Resource Sharing 跨域资源共享)
                定义：由一系列 HTTP 响应头组成，这些 HTTP 响应头决定浏览器是否阻止前端 JS 代码跨域获取资源
                （浏览器的同源安全策略默认会阻止网页 "跨域" 获取资源
                但是如果接口服务器配置了 CORS 相关的 HTTP 响应头就可以解除浏览器端的跨域访问限制）
                注意事项：
                    1、CORS 主要在服务器端进行配置，客户端浏览器无须做任何额外的配置，即可请求开启了 CORS 的接口
                    2、CORS 在浏览器中有兼容性，只有支持 XMLHttpRequest Level2的浏览器才能正常访问开启了 CORS 的服务端接口
            CORS 响应头部 Access-Control-Allow-Origin
                响应头部中可以携带一个 Access-Control-Allow-Origin 字段，语法如下
                    Access-Control-Allow-Origin：<origin> | * （origin参数的值指定了允许访问该资源的外域 URL,*表示所有网页均可请求）
                    eg：下面的字段值只允许来自某个域名的请求 res.setHeader(' Access-Control-Allow-Origin','http://itcast.cn')
                    eg：下面的字段值允许全部域名的请求 res.setHeader(' Access-Control-Allow-Origin','*')
            CORS 响应头部  Access-Control-Allow-Headers
                默认情况下，CORS 仅支持客户端向服务器发送如下的 9 个请求头：
                    Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width、Content-Type
                    （值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一）
                    如果客户端向向服务器发送了额外的请求头信息，则需要在服务器端通过  Access-Control-Allow-Headers 对额外的请求头进行声明
                    res.setHeader(' Access-Control-Allow-Header','Content-Type,x-Custom-Header')
            CORS 响应头部 Access-Control-Allow-Methods
                默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求
                如果客户端希望通过 PUT、DELETE 等方式请求服务器的资源
                则需要在服务器端，通过 Access-Control-Allow-Methods 来指明实际请求所使用的 HTTP 方法
                    // 只允许 POST、GET 请求方法
                    res.setHeader(' Access-Control-Allow-Methods','POST,GET')
                    // 允许所有 HTTP 请求方法
                    res.setHeader(' Access-Control-Allow-Methods','*')
            CORS 请求的分类
                客户端在请求 CORS 接口时，根据请求方式和请求头的不同，可以将 CORS 的请求分为两大类，分别是：
                    1、简单请求
                        定义：
                            请求方式属于：GET、POST、HEAD 三者之一，并且 HTTP 头部信息属于默认情况下的 9 个请求头，无自定义头部字段
                    2、预检请求
                        浏览器在与服务器正式通信之前，浏览器会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求
                        所以这一次的 OPTION 请求称为 预检请求，服务器成功相应预检请求后，才会发送真正的请求，并且携带真实数据
                        定义：
                            只要符合以下任何一个条件的请求，都需要进行预检请求
                                ① 请求方式为 GET、POST、HEAD 之外的请求 Method 类型
                                ② 请求头中包含自定义头部字段
                                ③ 向服务器发送了 application/json 格式的数据
                    3、简单请求和预检请求的区别
                        简单请求的特点：客户端与服务器之间只会发生一次请求
                        预检请求的特点：客户端与服务器之间会发生两次请求，OPTION 预检请求成功之后，才会发起真正的请求
*/

// 一定要在路由之前，配置 cors 这个中间件，从而解决接口跨域的问题
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: false }))

const cors = require('cors')
app.use(cors())

const router = require('./26附_路由apiRouter')
app.use(express.urlencoded({ extended:false }))
app.use('/api',router)
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})