
/* 使用第三方包的流程 */
// 1、导入需要的包
const moment = require('moment')
// 安装在本文件相同路径下，直接使用包的名称即可导入
// 如果安装在其他文件的路径下，使用 require('./file/node_modules/moment/moment.js') 找到对应 js文件 即可
// 具体入口在包的 package.json 文件中，main属性中规定

// 2、在 npmjs.com 搜索对应的包，找到其文档
// 此第三方包的文档：https://momentjs.com/docs/

const day_str = moment().format('YYYY-MM-DD HH/mm/ss')

console.log(day_str)