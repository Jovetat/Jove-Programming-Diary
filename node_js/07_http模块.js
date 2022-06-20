
/* 
    http 模块是 Node.js 用来创建 web 服务器的模块
        http.creatServer()  方法,将电脑变为 web 服务器,对外提供 web 资源服务
*/
/* 
    服务器相关概念:
        IP地址:
            计算机的唯一地址,只有知道对方IP地址的前提下,才能与对应的电脑进行数据通讯
            格式:"点分十进制",表示成(a,b,c,d)的形式,其中a,b,c,d都是0~255之间的十进制整数; eg:(192.168.1.1)
            互联网中每台 web 服务器都有自己的IP地址 eg:ping www.baidu.com 查看百度服务器IP地址
            开发期间自己的电脑既是一台服务器,也是一个客户端
            为方便测试 127.0.0.1 代表自己的电脑(服务器),只限自己测试使用,无法被其他人访问
*/
/* 
    域名和域名服务器:
        IP不直观且不便于记忆,所以发明了域名地址
        IP地址和域名一一对应,这份对应关系放在 域名服务器 (DNS,Domain name server)的电脑中
        使用者只需要通过域名访问对应服务器,转换工作由域名服务器实现
        (单纯使用IP地址,互联网中的电脑也能够正常工作,域名使其更加方便)
        127.0.0.1 对应域名 localhost 都代表我们的电脑
*/
/* 
    端口号:
        电脑中可以运行成百上千个 web 服务,每个 web 服务都对应一个唯一的端口号
        客户端发过来网络请求,通过端口号,可以被准确的交给对应的 web 服务进行处理
        每个端口号不能同时被多个 web 服务占用(在实际应用中,URL为80端口时80可以被省略)
*/
/* 创建基本的 web 服务器 */
// 1、导入 http 模块
const http = require('http')
// 2、创建 web 服务器实例
const server = http.createServer()
// 3、为服务器实例绑定 request 事件，监听客户端需求     .on('事件名',发生时触发的函数)
server.on('request',(req,res)=>{
    // 只要有客户端请求该服务器，就会触发使用 on 方法绑定的 request 事件
    console.log('someone visit my web server.')
    console.log('your request url is ' + req.url + ' and request methon is ' + req.method)
    const obj = "{id: '001',name: '大壮',age: 56}"
    res.setHeader('Content-Type','text/html: charset=utf-8')
    res.end(obj)
})
// 4、启动服务器    .listen(端口号,服务器启动后的回调函数)
// 运行在80端口号，80可省略
server.listen(80,()=>{
    console.log('http server running at http://127.0.0.1:80')
})

/* 
    server.on('request',(req,res)=>{})
        服务器只要接收到客户端的请求，就会调用 server.on() 为服务器绑定 request 事件处理函数
    req 请求对象
        req 是请求对象，包含与客户端相关的数据或属性
        req.url 是客户端请求的 URL 地址
        req.method 是客户端的 method 请求类型(get、post)
    res 响应对象
        res 是响应对象，包含服务器相关的的数据或属性
        res.end() 向客户端发送指定内容，并结束此次请求
        向客户端发送中文内容时，需手动设置内容的编码格式，解决中文乱码的问题
        res.setHeader('Content-Type','text/html: charset-utf-8') 设置Content-Type响应头
*/