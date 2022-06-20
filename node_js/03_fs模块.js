
// 导入 fs 模块来操作文件
// fs 模块为 Node.js官方提供的、用来操作文件的模块
const fs = require('fs')

// [] 内为可选参数，其他为必选参数
/*
    fs.readFile(path,[options],callback)   读取指定文件中的内容
        path：文件路径（字符串）
        options：表示以什么编码格式来读文件（可选参数）
        callback： 回调函数，可以拿到失败和成功的结果 err dataStr
            读取成功后 err 的值为 null，dataStr 的值为读取到的内容
            读取失败则 err 的值为错误对象，dataStr 的值为 undefined

    fs.writeFile(file,data,[options],callback)  向指定文件中写入内容
        // 只能用于创建或覆盖文件,不能用于创建路径
        file：指定文件的存放路径（字符串）
        data：表示写入的内容
        options：表示以什么格式写入文件内容（可选参数，默认为 utf-8）
        callback：回调函数，可以拿到失败的结果 err
            如果文件写入成功，则 err 的值等于 null
            如果文件写入失败，则 err 的值等于一个错误对象
*/

fs.readFile('./file/try.txt','utf-8',(err,datastr)=>{
    console.log('读取try.txt')
    console.log(err)
    console.log(datastr)
})
fs.readFile('./file/t.txt','utf-8',(err,datastr)=>{
    console.log('读取不存在的文件')
    console.log(err)
    console.log(datastr)
})
// 进入到目录后 node 03_fs模块.js 运行

// 判断文件是否读取成功
fs.readFile('./file/try.txt','utf-8',(err,datastr)=>{
    if(err){
        console.log('读取文件失败' + err.message)
        return err
    }
    console.log('读取文件成功' + datastr)
})

// 向指定文件中写入内容
fs.writeFile('./file/try2.txt','Hello Jove',(err)=>{
    console.log(err)
})

// 判断文件是否写入成功
fs.writeFile('./file/try2.txt','Hello Jove',(err)=>{
    if(err){ 
        return console.log('文件写入失败' + err.message)
    }
    console.log('文件写入成功')
})