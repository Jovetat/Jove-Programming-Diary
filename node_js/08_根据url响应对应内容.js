
/* 
    根据不同的 url 响应不同的 html 内容
*/
const http = require('http')
const server = http.createServer()
server.on('request',(req,res)=>{
    const obj = {
        name: '兜里没有糖呀',
        age: 18
    }
    const obj2 = {
        name: 'raina',
        age: 32
    }
    console.log('your request url is ' + req.url + ' and request methon is ' + req.method)
    res.setHeader('Content-Type','text/html: charset=utf-8')
    if(req.url === '/index'){
        res.end(JSON.stringify(obj))
    }
    else{
        res.end(JSON.stringify(obj2))
    }
})
server.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})