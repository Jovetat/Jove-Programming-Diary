
/* 
    托管静态资源
        app.use(['/挂载路径前缀'],express.static('./静态资源目录'))
        express.static()
            创建一个静态资源服务器，就指定的静态资源文件夹托管出去
            express 在指定的静态目录中查找文件，并对外提供资源的访问路径
                (存放静态文件的目录名不会出现在 URL 中)
*/

const express = require('express')
const app = express()
// 快速的对外提供静态资源
app.use(express.static('./file'))
// app.use(express.static('../Vue/vue_clitest/dist'))

/*  app.use() 函数，用来注册全局中间件 */
// http://127.0.0.1/index.html 即可访问到对应文件内容 (http://127.0.0.1 默认访问index.html页面)
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})

/* 
    托管多个静态资源目录
        多次调用 express.static()
            app.use(express.static('./file'))
            app.use(express.static('page'))
        * 访问静态资源文件时，express.static() 函数会根据目录的添加顺序查找所需的文件
            访问 http://127.0.0.1/homepage.html 时会先从 file 文件夹中查找
*/

/* 
    挂载路径前缀
        在被托管的静态资源访问路径之前，挂载路径前缀
        app.use('/page',express.static('./file'))
        // http://127.0.0.1/page/index.html 通过这样才能访问静态资源
*/