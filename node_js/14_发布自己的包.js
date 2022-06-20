
/* 
    1、新建 my-tools包名 的文件夹，作为包的根目录
    2、在 my-tools 文件夹中，新建三个文件：
        package.json(包管理配置文件)
            属性：
                name：代表包的名称(其他用户下载的时候会用到，名称需唯一)
                version：版本号
                main：指定包的入口文件
                description：包的简介，概述基本功能
                keywords：搜索时的关键字
                license：开源许可协议(官方推荐ISC)
        index.js(包的入口文件，可任意名称，只需在 main 属性中声明)
            定义函数，提供功能
            module.exports = { 函数1 , 函数2 ， ……}
        README.md(包的说明文档)
            事先将包的使用说明，以 markdown 的格式写出来，方便用户参考
                            

    3、将不同的分类功能进行模块化的拆分
        在 main 声明的入口文件中汇总    require 导入
            const data = require('./src/dataFormat')
        module.exports 共享出去
            module.exports = { ...data(展开对象data，将其中的每一个属性交给外层对象) , ...escape }

    4、将包发布到 npm
        1) 注册 npm 账号
        2) 在终端登录 npm 账号      npm login(依次输入用户、密码、邮箱)
            登录前必须将下包的服务器切换成 npm 官方的服务器
        3) 将终端切换到包的根目录之后，运行 npm publish 命令即可(包的名称不能雷同)
    
    5、删除已发布的包
        npm unpublish 包名 --force 命令，即可从 npm 删除已发布的包
            此命令只能删除 72 小时内发布的包
            删除的包 24 小时内不允许重复发布

*/