/* 
    将一个含有 HTML\CSS\Javascript的HTML文件
    分割为.html、.css、.js文件且不影响原先功能(通过引入外链的方式)
*/
const fs = require('fs')
const path = require('path')

// 1、通过两个正则表达式分别匹配 <style> 和 <script> 标签
const regStyle = /<style>[\s\S]*<\/style>/
const regScript = /<script[\s\S]*<\/script>/
// 2、使用 fs 模块读取被处理的HTML
fs.readFile(path.join(__dirname,'./file/SimpleComputer.html'),'utf-8',(err,dataStr)=>{
    if(err){
        return console.log('文件读取失败' + err.message)
    }
    resolveCSS(dataStr)
    resolveJS(dataStr)
    resolveHTML(dataStr)
})
// 3、自定义 resolveCSS方法写入index.css样式文件
// 4、自定义 resolveJS方法写入index.js脚本文件
// 5、自定义 resolveHTML方法写入index.html文件
function resolveCSS(htmlStr){
    const c1 = regStyle.exec(htmlStr)
    const newcss = c1[0].replace('<style>','').replace('</style>','')
    fs.writeFile(path.join(__dirname,'./file/index.css'),newcss,(err)=>{
        if(err){
            return console.log('写入css文件失败' + err.message)
        }
        console.log('写入css文件成功')
    })
}

function resolveJS(htmlStr){
    const j1 = regScript.exec(htmlStr)
    const newjs = j1[0].replace('<script>','').replace('</script>','')
    fs.writeFile(path.join(__dirname,'./file/index.js'),newjs,(err)=>{
        if(err){
            return console.log('写入js文件失败' + err.message)
        }
        console.log('写入js文件成功')
    })
}
function resolveHTML(htmlStr){
    const newhtml = htmlStr.replace(regStyle,'<link rel="stylesheet" href="./index.css" />')
        .replace(regScript,'<script src="./index.js"></script>')
    fs.writeFile(path.join(__dirname,'./file/index.html'),newhtml,(err)=>{
        if(err){
            return console.log('写入html文件失败' + err.message)
        }
        console.log('写入html文件成功')
    })
}