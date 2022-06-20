
/* 
    包
        Node.js 中的第三方模块叫做 包
        包是由第三方个人或团队开发免费供所有人使用的(包都是免费且开源的)

    使用包的目的
        内置模块仅提供了一些底层的 API，导致项目开发效率低
        包是基于内置模块封装出来的，提供更高级更方便的 API，提高开发效率

    在项目中安装包的命令(npm)
        npm install(i) 包的完整的名称
        导入的名称就是装包时候的名称        
    安装指定版本的包(默认会安装最新的包)
        npm install(i) 包的完整的名称@具体的版本号
    重新安装某个包
        无需卸载，直接执行安装命令就会覆盖之前的包
    一次性安装项目中依赖的包(需项目中包含 package.json)
        当拿到一个剔除了 node_modules 的项目后，需先把所有的包下载到项目中，才能使项目运行起来
         npm install(i)
        // 执行 npm install 命令时，会先读取 package.json 中的 dependencies 节点
        // 读取到记录中所有依赖包的名称和版本号后，npm 包管理工具会把这些包一次性下载到项目中
    此包只在开发项目时用，上线不需要(eg:webpack)
        npm install(i) 包的完整的名称 -D(简写)
        npm install(i) 包的完整的名称 ---save-dev(全写)
        // 会在 devDependencies 节点中自动添加记录

    初次装包后，项目多了哪些文件
        1、node_modules
            存放所有安装到项目中的包，require() 导入第三方包时，就是在这个目录中查找并加载包
        2、package-lock.json
            用来记录 node_modules 目录下每一个包的下载信息，包括名称、版本号、下载地址
        3、package.json —— 包管理配置文件
            记录与项目有关的一些配置信息
                项目名称、版本号、描述、作者……
                项目中用到了哪些包
                哪些包只在开发期间会用到
                哪些包在开发和部署时都会用到
            方便剔除 node_modules 目录之后，团队成员之间共享项目源代码
            dependencies 节点：用于记录安装了哪些包
            devDependencies 节点：记录在项目开发期间用，项目上线之后不会用的包


    *不要手动修改 node_modules 或 package-lock.json 文件，npm 包管理工具会自动维护它们

    包的语义化版本规范
        包的版本号是以"点分十进制"形式定义，共三位数字，eg：2.21.0
            第一位数字：大版本(底层重构)、第二位：功能版本、第三位：bug修复版本
        版本号提升规则：只要前面的数字增长了，后面的版本号需要归零
    
    多人协作问题
        第三方包的体积过大，不方便团队成员之间共享项目源码
        解决方案：共享时剔除 node_modules (将此文件夹添加到 .gitgonre 忽略文件中，避免上传代码的时候提交)

    快捷创建 package.json 包管理配置文件(一般在初次导入包时就会自动创建)
        在执行命令所在目录生成 package.json :
            npm init -y
            (1、必须英文目录且无空格；2、npm install 时，会自动把包的名称和版本号记录到 package.json)
    
    卸载包
        npm uninstall 需卸载的包的名称
            命令成功后，会自动从 package.json 的 dependencies 中移除

    镜像：
        一种文件的存储形式，一个磁盘上的数据在另一个磁盘上存在一个完全相同的副本即为镜像

    包的分类
        项目包
            定义：被安装到项目 node_modules 目录中的包
            分类：
                开发依赖包  npm i 包名 -D
                    定义：被记录到 devDenpendencies 节点中的包，只有开发期间会用到
                核心依赖包  npm i 包名
                    定义：被记录到 dependencies 节点中的包，在开发期间和项目上线之后都会用到
        全局包  npm i 包名 -g
            全局包默认被安装到  C:\Users\user\AppData\Roaming\npm\node_modules
            卸载全局包  npm uninstall 包名 -g
            只有工具性质的包，才有全局安装的必要性，因为他们提供了好用的终端命令

        i5ting_toc  可以将 md 文档转为 html 页面
        nrm         便捷切换源的工具

    规范包的结构
        1、包必须以单独的目录而存在
        2、包的顶级目录下必须包含 package.json 这个包管理配置工具
        3、package.json 中必须包含 name、version、main 这三个属性，分别代表包的名字、版本号、包的入口
        (导入包会在项目的 package.json 中找到包的位置，然后找到对应包的 package.json 中找到 main 属性对应的文件并加载)

*/