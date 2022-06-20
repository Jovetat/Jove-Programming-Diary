
/* 
    模块化的基本概念
        解决复杂问题时，自顶向下逐层把系统划分成若干模块的过程，模块可组合、分解和更换单元

    模块化好处：
        提高代码复用性
        提高代码可维护性
        可以实现按需加载

    模块化规范
        Node.js 遵循 CommonJS 模块化规范，CommonJS 规定了规范的特性和各模块直接如何相互依赖
        CommonJS 规定：
            1、每个模块内部，module 变量代表当前模块
            2、module 变量是一个对象，它的 exports 属性(module.exports)是对外的接口
            3、加载某个模块其实是加载该模块的 module.exports 属性，require() 方法用于加载模块

    Node.js 模块的分类
        内置模块
            1、Node.js 官方提供，例如 fs、path、http等
            2、自定义模块
                用户创建的每个 js 文件都是自定义模块
            3、第三方模块
                由第三方开发出来的模块，使用前需要先下载

    加载模块
        require()   可以加载需要的内置模块、用户自定义模块、第三方模块
        * 使用 require() 方法加载其他模块时，会执行被加载模块中的代码
*/
// 1、加载内置的模块
const fs = require('fs')
// 2、加载用户的自定义模块(只有自定义模块的加载需要路径)
const custom = require('./02_进程和线程.js')
/* require() 可省略 .js 的后缀名 */
console.log(custom)
// 输出 {}
// 3、加载第三方模块
/* const moment = require('moment') */

/* 
    模块作用域
        定义
            在自定义模块中定义的变量、方法等成员，只能在当前模块内被访问，这种模块级别的访问限制称为模块作用域
        好处
            防止全局变量污染
*/

/* 
    向外共享模块作用域中的成员
        module 对象
            每个 .js 自定义模块都有一个 module 对象，里面存储了和当前模块有关的信息
        module.exports 对象(默认等于空对象)
            使用 module.exports 对象，可以将模块内的成员共享储区，供外界使用
            外界使用 require() 方法导入自定义模块时，得到的就是 module.exprots 所指的对象
*/
console.log(module)

// 向外共享模块作用域中的成员

module.exports.name = '张三'
module.exports.sayHello = ()=>{
    console.log('hello world (调用10中的sayHello方法)')
}

// 关于 11 中对 exports的测试
console.log('10_ module.exports === exports: ')
console.log(module.exports === exports)