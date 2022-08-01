<template>
    <div>
        <button @click="getStudents">获取学生信息</button>
    </div>
</template>

<script>

    /* 
        # Vue 脚手架配置代理服务器(解决跨域问题)

            ## axios 与 fetch 都适用于在 Vue 中发送请求，但 axios 适配更好一点，所以这里以 axios 为例
                1. 配置 axios
                    (1) 下载
                        npm i axios
                    (2) 引入
                        import axios from 'axios'

            ## 解决跨域问题 (浏览器同源策略：协议名http、主机名localhost、端口号8080必须一致)
                1. 通过后端 cors 解决
                2. jsonp    只能发送 get 请求
                3. *配置代理服务器 (开发中最常用)
                    (1) 配置一个代理服务器用于转发请求数据
                    (2) 代理服务器与浏览器位置相同(http://localhost:8080)，不受同源策略束缚
                    (3) 代理服务器与服务器(都是服务器)采用 http 的方式就可以请求数据

            ## 配置代理服务器的方法
                1. nginx 经典反向代理服务器(后端)
                2. Vue-cli 借助 Vue 脚手架开启代理服务器

            ## Vue 脚手架配置代理服务器
                1. 简单配置 (只可单个)
                    通过 vue.config.js 配置代理服务器，以下将 本地5000端口 作为请求的服务器(正式开发请改为服务器完整地址)

                    1) 在 vue.config.js 中添加如下配置：
                        module.exports = {
                            devServer:{
                                proxy:"http://localhost:5000(需请求的服务器地址)"
                            }
                        }
                        (因为代理服务器地址与浏览器相同，所以这里写的是请求的服务器的位置)

                    2) 向代理服务器发送请求
                        axios.get('http://localhost:8080/请求路径').then()
                        (这里地址写成这样才是向代理服务器发送请求)

                    3) 说明：
                        (1) 工作方式：
                            a、当请求的资源 8080 本身就有，就不会把资源转发给服务器 (优先匹配前端资源)
                                (public 为 8080 代理服务器根路径，目录下的资源都可以直接获取到)
                                [如果恰好有与请求路径重名的无后缀文件存于 public，就会失去原先的请求转而获取到该文件]
                            b、当请求了前端不存在的资源时，就会把请求会转发给服务器 
                        (2) 优点：
                            配置简单，请求资源时直接发给前端（8080）代理服务器就会帮助转发到服务器
                        (3) 缺点：
                            a、不能配置多个代理，不能灵活的控制请求是否走代理
                            b、优先匹配前端资源导致无法转发 服务器路径与 public 中资源同名的请求

                2. 具体配置 (可多个)
                    通过 vue.config.js 配置具体代理规则，以下将 本地5000端口 作为请求的服务器(正式开发请改为服务器完整地址)

                    1) 在 vue.config.js 配置具体代理规则：
                        devServer: {
                            proxy: {
                                '/请求前缀': {
                                    (0) 配置请求前缀用于匹配所有以 '/请求前缀1'开头的请求路径
                                    (1) target: '此代理请求的目标服务器地址(*必填项)'
                                    (2) pathRewrite: {'正则匹配条件':'替换掉正则匹配的内容'}
                                        *通过正则表达式的方式将 请求路径 转为 请求服务器的路径
                                        *eg(删除前缀)：pathRewrite: {'^/api1': ''} 匹配所有以 /api1 开头的路径，替换为空字符串
                                        不需要使用可以不写此配置项
                                    (3) changeOrigin: bool
                                        true：  服务器收到的请求头中的 host 为：与请求的服务器地址相同(更改请求地址骗服务器)
                                        false： 服务器收到的请求头中的 host 为：localhost:8080(本身请求发出的地址)
                                        默认值为 true
                                    (4) ws: bool
                                        用于支持 websocket
                                        默认值为 true
                                },
                                // eg:
                                '/api': {
                                    target: 'http://localhost:5000',
                                    pathRewrite: {'^/api': ''},    // 如果请求的路径在服务器内不包含此请求前缀，则需要此配置项
                                    changeOrigin: true,
                                    ws: true
                                }
                            }
                        }

                    2) 只有请求路径的请求前缀包含在配置项内才会走代理，否则就不会走代理
                        前缀为紧跟 端口号/网址/域名 的第一个路径

                    3) 向代理服务器发送请求
                        axios.get('http://localhost:8080/请求前缀x/请求路径').then()

                    4) 说明：
                        (1) 优点：
                            可以配置多个代理，且可以灵活的控制请求是否走代理
                        (2) 缺点：
                            配置略微繁琐，请求资源时必须加前缀
    */


    import axios from 'axios'

    export default {
        name: 'App',
        methods: {
            getStudents(){
                // 简易代理服务器的写法
                /* axios.get('http://localhost:8080/students').then(
                    // 如果这里在 public 路径下存有 student 无后缀的文件，就会请求回该文件
                    response => {
                        console.log('请求成功:',response.data)
                    },
                    error => {
                        console.log('请求失败:',error)
                    }
                ) */
                // 具体代理服务器的写法
                axios.get('http://localhost:8080/stu/students').then(
                    // 如果这里在 public 路径下存有 student 无后缀的文件，就会请求回该文件
                    response => {
                        console.log('请求成功 students:',response.data)
                    },
                    error => {
                        console.log('请求失败:',error)
                    }
                )
                axios.get('http://localhost:8080/car/cars').then(
                    // 如果这里在 public 路径下存有 student 无后缀的文件，就会请求回该文件
                    response => {
                        console.log('请求成功 cars:',response.data)
                    },
                    error => {
                        console.log('请求失败:',error)
                    }
                )
            }
        },
    }

</script>