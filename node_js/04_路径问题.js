const fs = require('fs')

// 路径动态拼接问题
/*
    ./ ../ 开头 ：相对路径
        相对路径容易出现动态拼接错误
        原因：代码在运行时，会以执行 node 命令所处的目录动态拼接出被操作文件的完整路径
            （以 node 文件路径而不是直接一个文件名，就会导致 node 在执行路径中直接找该文件而不会顺着所给路径找）
            （所以 node 要直接一个文件名，且相对路径正确才会正确执行）
 */
// 1、解决动态拼接的方法就是使用完整路径
// 完整路径移植性非常差，不利于后期维护
fs.readFile('D:/JoveProgramDiary/study/node_js/file/try.txt','utf-8',(err,dataStr)=>{
    if(err){
        return console.log('读取文件失败' + err)
    }
    console.log('读取文件成功' + dataStr)
})

// 同时解决移植性和路径动态拼接问题
// 2、通过 __dirname 表示当前文件所处的目录
console.log(__dirname)
fs.readFile( __dirname + '/file/try.txt','utf-8',(err,dataStr)=>{
    if(err){
        return console.log('读取文件失败' + err)
    }
    console.log('读取文件成功' + dataStr)
})
/* 
    绝对路径和 __dirname 的方式可以使 node 执行 ./study/node_js/04_路径问题.js 这样带路径的指令
 */
