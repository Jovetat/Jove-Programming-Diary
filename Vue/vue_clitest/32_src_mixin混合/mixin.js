
/* 
    mixin 混合
        
        1. 功能：可以把多个组件共用的配置提取成一个混入对象
            (两个组件共享相同的配置项，js 文件名随意，这里使用 mixin)

        2. 定义混合：
            (1)
                {
                    data(){....},
                    methods:{....}
                    ....
                    所以配置项在混合里都可以写，包括但不限于：生命周期函数、data ……
                }
            (2) 然后 export 出去
                    export const xxx =  {}
        3. 使用混合：
            (1) 引入混合
                import { 定义混合时参数的名称(xxx) } from '../yyy.js'
            (2) 混入
                全局混入：
                    Vue.mixin(xxx)      (在 main.js 内)
                    *vm 和 所有 vm 都会被混入该混合
                局部混入(mixins配置项)：
                    mixins:['xxx']      (必须写在数组里)
            (3) 组件内有的以组件内为主(data 属性、冲突的 method 方法等)
            (4) 生命周期函数不以组件或混合为主，全部会调用
*/
// 分别暴露
export const hunhe = {
    methods: {
        showName(){
            alert(this.name)
        }
    },
    mounted() {
        console.log('浅浅的来个生命周期')
    },
}
export const hunhe2 = {
    // data 数据会被整合在组件 data 内
    data() {
        return {
            x: 100,
            y: 200
        }
    },
}