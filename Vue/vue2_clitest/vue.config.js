
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,            // 关闭语法检查
    /* 
       // 开启代理服务器(简单配置)
      devServer:{                  
        proxy: "http://localhost:5000"
    }, */
    // 具体配置代理服务器
    devServer: {
      proxy: {
        '/stu': {
          target: 'http://localhost:5000',
          pathRewrite: {'^/stu': ''},
          ws: true,
          changeOrigin: true
        },
        '/car': {
          target: 'http://localhost:5001',
          pathRewrite: {'^/car': ''}
        }
      }
    },
})
