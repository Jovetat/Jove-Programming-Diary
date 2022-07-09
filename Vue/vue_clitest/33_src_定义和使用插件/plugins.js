
/* 
    插件
        1. 功能：用于增强Vue

        2. 本质：包含 install 方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据。

        3. 定义插件：
            对象.install = function (Vue, 接收参数1, 接收参数2, ……) {
                // 1. 添加全局过滤器
                Vue.filter(....)

                // 2. 添加全局指令
                Vue.directive(....)

                // 3. 配置全局混入(合)
                Vue.mixin(....)

                // 4. 添加实例方法
                Vue.prototype.$myMethod = function () {...}
                Vue.prototype.$myProperty = xxxx

                ……
            }

            暴露出去该对象

        4. 使用插件：
            import 插件
            Vue.use(传入参数1、传入参数2、……)
*/

export default {
    install(Vue,options='妹有参数传入'){
        console.log('install',options)
        // 配置全局过滤器
        Vue.filter('mySlice',(val)=>{
            return val.slice(0,7)
        })
        // 配置全局自定义指令
        Vue.directive('big',{
            bind(element,binding){ element.innerText = binding.value * 10 },
            inserted(element,binding){ console.log('我进来啦') },
            update(element,binding){ element.innerText = binding.value * 10 }
        })
        // 定义混入
        Vue.mixin({
            data() {
                return {
                    x: 100,
                    y: 200
                }
            },
        })
        // 在 Vue 原型上添加内容(vm 和 vc 就都能用了)
        Vue.prototype.hello = ()=>{ alert('吼嗨呦') }
    }
}