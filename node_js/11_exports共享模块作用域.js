
/* 
    exports 定义包含在 10_模块化中
*/
module.exports = {
    name : '李四',
    douli :()=>{
        console.log('本函数中的exports')
    }
}
module.exports.age = 11

const custom = require('./10_模块化')
// 外界使用 require 导入一个自定义模块的时候，得到的是该模块中的 module.exports 指向的对象

console.log('10导入的custom')
console.log(custom)
custom.sayHello()

/* 
    exports 对象
        和 module.exports 指向的是同一个对象，只是 Node 简化共享成员代码
        只要不再本函数中使用 exports 相关的输出等，可以完全等于 module.exports使用
        冲突的时候以 module.exports 为准(并非覆盖，而是优先)
            例如 module.exports.name = 'zs' exports = {age:16,gender:'女'}  输出的是name = 'zs'
            例如 exports.name = 'zs' module.exports = {age:16,gender:'女'}  输出的是{age:16,gender:'女'}
            例如 exports.name = 'zs' module.exports.age = 16  输出的是{name:'zs',age:16}
            例如 exports = {age:16,gender:'女'} module.exports.name = 'zs'  输出的是{age:16,gender:'女',name:'zs'}
            例如 ex[ports简写] = {age:16,gender:'女'} modeule.ex = ex module.ex.name = 'zs'  输出的是{age:16,gender:'女',name:'zs'}


            require() 模块时，得到的永远是 module.exports 指向的对象
*/
console.log(exports)
console.log('11_module.exports === exports: ')
console.log(module.exports === exports)
// 在自身函数内调用返回 false ，在被引用时返回true
/* 
    exports 的个人理解
        在 exports 对象上可以进行与 module.exports相同的操作
        但是在本函数内，二者并无关系，感觉像是在被其他模块调用的时候二者做了合并
            并无关系指在本函数中二者不相等且在其中一个添加属性另一个并不会产生变化

    ** 综上所述建议直接用 module.exports 一个完成所有共享操作
*/