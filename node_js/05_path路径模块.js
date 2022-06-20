
/* 
    path 模块是 Node.js 官方提供的处理文件和目录的路径的实用工具
 */

// 导入 path 路径模块
const fs = require('fs')
const path = require('path')
/* 
    path 内方法
        path.join([...path])                将任意多个路径片段拼接成一个完整的路径字符串,return 拼接好的路径
            ../ 在路径片段中会返回上一层
            涉及到路径拼接的操作都要使用 path.join,不要直接使用 + 进行字符串拼接
        path.basename(path,[扩展名ext])     从路径字符串中将文件名解析出来,如果输入扩展名则输出无扩展名的文件名
        path.extname(path)                 获取路径中文件扩展名部分,return 扩展名字符串
 */
const pathStr = path.join('/a','/b/c','../','./d','e')
console.log(pathStr)
// 输出 \a\b\d\e
fs.readFile(path.join(__dirname,'/file/try.txt'),'utf-8',(err,dataStr)=>{
    if(err){
        return console.log('读取文件失败' + err)
    }
    console.log('读取文件成功' + dataStr)
})

console.log(path.basename('/file/s/jove.txt'))
// 输出 jove.txt
console.log(path.basename('/file/s/jove.txt','.txt'))
// 输出 jove
console.log(path.extname('/file/s/jove.txt'))
// 输出 .txt