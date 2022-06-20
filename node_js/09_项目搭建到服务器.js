
/* 
    将项目搭建到 web 服务器上
        把文件的实际存放路径，作为每个资源的请求 url 地址
*/
// 1、导入所需模块
const http = require('http')
const fs = require('fs')
const oaht = require('path')
const path = require('path')
// 2、创建基本的web服务器
const server = http.createServer()
server.on('request',(req,res)=>{
    // 3、将资源的请求 url 地址映射为文件的存放路径
    console.log('your request url is ' + req.url + ' and request methon is ' + req.method)
    const fpath = path.join(__dirname,'/file',req.url=='/'?'/index.html':req.url)
    // 4、读取文件路径并响应给客户端
    fs.readFile(fpath,'utf-8',(err,dataStr)=>{
        if(err){
            return res.end('404 Not Found')
        }
        res.end(dataStr)
    })
})
server.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})
/* 
    网页在请求 html 后，发现了页面内引用的文件，所以会自动根据路径拼接，继续请求对应的内容
        your request url is / and request methon is GET
        your request url is /file/index.html and request methon is GET
        your request url is /file/index.css and request methon is GET
        your request url is /file/index.js and request methon is GET
        your request url is /file/img/delete.png and request methon is GET
        your request url is /favicon.ico and request methon is GET
*/