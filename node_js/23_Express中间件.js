
/* 
    中间件 ( Middleware )
        定义：业务流程的中间处理环节

    Express 中间件的调用流程
        当一个请求到达 Express 的服务器之后，可以连续调用多个中间件，从而对这次请求进行预处理
        (中间件就是对请求进行预处理，便于 路由 响应请求)
        客户端(请求) --> 中间件1 --> 中间件2 --> …… --> 服务器路由 --> 响应客户端
    
    Express 中间件的格式
        Express 的中间件，本质上就是一个 function 处理函数，Express 中间价的格式如下：
            1、中间件函数的形参列表中，必须包含 next 参数，而 路由处理函数 只包含 req 和 res
            ( app.get('/',function(req,res,next){ next() }) )
        next 函数的作用
            next 函数是实现多个中间件连续调用的关键，他表示把流转关系转交给下一个中间件或路由
            (路由是最终的处理环节)
    
    全局生效的中间件
        *定义：客户端发起的任何请求，到达服务器之后，都会触发的中间件，叫做全局生效的中间件
        格式：
            app.use( 中间件函数 )   即可定义一个全局生效的中间件
        * 请求经过了全局中间件处理函数，处理完毕后才会交给后面的中间件或路由
        可以定义多个全局作用域的中间件
    
    局部生效的中间件
        定义：不使用 app.use() 定义的中间件，叫做局部生效的中间件
        格式：
            app.get(path,局部中间件函数,回调函数)
        中间件只在当前路由中生效(为单独路由提供中间件)
        可以定义多个局部作用域的中间件
            格式：
                第一种格式：app.get(path,中间件1,中间件2,……,(req,res)=>{ })
                第二种格式：app.get(path,[中间件1,中间件2],(req,res)=>{ })
    
    中间件的作用
        特性：多个中间件之间，可以共享一份 req 和 res
        特性带来的作用：在上游中间件中，统一为 req 和 res 对象添加自定义的属性或方法，供下游的中间件或路由使用

    中间件的注意事项：
        1、在路由之前注册中间件(中间件从上至下匹配)
        2、客户端发过来的请求，可以连续调用多个中间件进行处理
        3、执行完中间件的业务代码后，必须执行 next() 函数，否则请求到这里就截止了
        4、调用 next() 函数后不要再写额外的代码，避免代码逻辑混乱
        5、连续调用多个中间件使，多个中间件之间，共享 req 和 res 对象
        6、* 全局中间件与局部中间件之间也共享 req 与 res 对象
    
    中间件的分类：
        1、应用级别的中间件(全局中间件、局部中间件都属于此)
            定义：通过 app.use() 或 app.get() 或 app.post() 绑定到 app 实例上的中间件
                全局：app.use((req,res,next)=>{ next() })
                局部：app.get(path,[中间件1,中间件2],(req,res)=>{ })
        2、路由级别的中间件
            定义：绑定到 express.Router() 实例上的中间件
            用法与应用级别中间件没有任何区别，将对 app 的绑定改为对 router 实例上
        3、错误级别的中间件
            作用：用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题
            格式：
                必须有四个形参 function(err,req,res,next)
            注意：* 错误级别的中间件，必须注册再所有的路由之后
        4、Express 内置的中间件
            自 Express 4.16.0 开始， Express 内置了三个常用的中间件，极大提高灵项目开发效率
            1、 express.static 快速托管静态资源的内置中间件(例如：HTML、图片、CSS样式等)
            2、 express.json 解析 JSON 格式的请求体数据
                // 配置解析 application/json 格式数据的内置中间件
                app.use(express.json())
            3、 express.urlencoded 解析 URL-encoded 格式的请求体数据
                // 配置解析 application/x-www-form-urlencoded 格式数据的内置中间件
                app.use(express.urlencoded({ extended: false }))
        5、第三方的中间件
            eg： body-parser 解析请求体数据
            1) npm i body-parser
            2) 使用 require 导入中间件
            3) 调用 app.use() 注册并使用中间件

*/
const express = require('express')
const app = express()

/* 定义中间件函数(可以写为剑头函数的形式) */
const middleFuc = function(req,res,next){
    console.log('这是一个中间件函数')
    // 当前中间件的业务处理完毕后，必须调用 next() 函数
    // 把流转关系转交给下一个中间件或路由
    next()
}

/* 定义一个全局生效的中间件 */
app.use(middleFuc)
/* 
    定义全局中间件的简化形式
    定义多个全局中间件
        使用 app.use() 可以连续定义多个全局中间件，客户端请求到达服务之后，会按照中间件定义的先后顺序依次进行
*/
app.use((req,res,next)=>{
    console.log('这是一个简化全局中间件')
    // 获取请求到达服务器的时间
    const time = Date.now()
    // 为 req 对象，挂载自定义属性，从而把时间共享给后面的所有路由
    req.startTime = time
    next()
})
app.get('/',(req,res)=>{
    console.log(req.startTime)
    console.log('调用了 / 这个路由')
    res.send('Home page')
})
app.get('/user',(req,res)=>{
    console.log(req.startTime)
    console.log('调用了 /user 这个路由')
    res.send('User page')
})

/* 定义局部生效的中间件 */
// 1、定义中间件函数
const middleFuc2 = function(req,res,next){
    console.log('调用了局部生效的中间件')
    req.str = '我想你永远都不会懂'
    next()
}
// 2、创建路由
app.get('/list',middleFuc2,(req,res)=>{
    // 全局中间件与局部中间件也共享 req 与 res 对象
    console.log(req.startTime)
    res.send(req.str)
})
// 3、定义多个局部生效的中间件
// app.get('/',[middleFuc,middleFuc2],(req,res)=>{})

/* 定义一个错误级别的中间件 */
// 1、路由
app.get('/error',(req,res)=>{
    // 1、手动抛出一个错误
    throw new Error('手动抛出服务器内部发生错误')
    // * 1.1、抛出错误后服务器崩溃，不会继续向后面执行
    // * 1.2、但是如果有错误级别中间件，就会立即进入错误级别中间件中执行，服务器不会崩溃
    res.send('error')   // 不会被执行
})
// 2、错误级别的中间件(捕获整个项目中发生的错误)
app.use((err,req,res,next)=>{
    console.log('发生的错误内容为:' + err.message)
    // err.message 就是 new Error 中手动抛出的内容
    res.send('Error:' + err.message)
    // 客户端收到：‘Error：手动抛出服务器内部发生错误’
})

/* 演示内置中间件的使用 */
// 除了错误级别的中间件，其他中间件必须在路由之前进行配置
app.use(express.json())
// * 解析表单中 JSON 格式的数据，解析后将结果挂载到 req.body 上
// 发送请求时添加 body 请求体数据
app.post('/mid',(req,res)=>{
    // req.body 这个属性用于接收客户端发过来的请求体数据
    console.log(req.body)
    // { name: '张三', age: 20 }
    // * 默认情况下，如果不配置解析表单数据的中间件，req.body 默认等于 undefined
    res.send('ok')
})
// 使用 express.urlencoded() 这个中间件来解析表单中的 url-encoded 格式的数据
app.use(express.urlencoded({extended:false}))
// * 解析表单中 urlencoded 格式的数据，解析后将结果挂载到 req.body 上
// 平常要把中间件都写于路由之前，这里为了方便学习所以写在一起，前面 express.json 不影响这里的解析
app.post('/book',(req,res)=>{
    console.log(req.body)
    // [Object: null prototype] { bookname: '小黄书', auther: 'douli' }
    res.send('200:ok')
})

app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})