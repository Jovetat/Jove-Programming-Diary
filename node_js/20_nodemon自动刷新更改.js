
/* 
    nodemon
        在编写调试 Node.js 项目的时候，如果修改了项目的代码，则需要频繁的手动重启服务器查看效果
        nodemon 可以监听项目文件的变动，当代码修改以后，nodemon 会自动重启项目，极大方便了开发和调试
    
    安装
        npm install -g nodemon
    
    使用 nodemon
        之前的方式 node app.js 命令(代码修改后需手动重启项目)
        现在 nodemon app.js 来启动项目
            代码被修改之后，会被 nodemon 监听到，从而实现自动重启项目的效果
            (被 require 的模块更改也会被监听到)
*/