<template>
    <div>
        <h2>{{msg}}</h2>
        <h3>{{name}}</h3>
        <h3>{{myAge}}</h3>
        <button @click="updateAge">age++</button>
    </div>
    <!-- 组件传参 props -->
</template>

<script>

    /* 
        props 接收组件参数配置项 (prop:属性)
            1. props 的配置方式
                (1) 简单声明接收(只接收)
                    props: [ '接收参数1', '接收参数2', …… ]
                (2) 接收的同时对参数类型进行限制(限制类型)
                    props: { 接收参数1:限制类型, 接收参数2:限制类型, …… }
                (3) 限制类型、限制必要性、指定默认值
                    props: {
                        接收参数1: {
                            type: 参数限制类型,
                            required: bool(此属性是否是必须传递项，默认 false),
                            default: 默认值(当该参数没有传递时则使用默认值)
                            (default 与 required 二者只需出现一个)
                    }, ……
                }

            2. props 使用
                (1) props 是只读的
                    Vue底层会监测你对 props 的修改，如果进行了修改，就会发出警告
                    (若业务需求确实需要修改，那么请复制 props 的内容到 data 中一份，然后去修改 data 中的数据)
                (2) props 声明了未传递的变量时
                    变量仍会挂载于 vc 上，值为 undefined
                (3) 通过其他方式读写 props 属性
                    data(){ return {
                        新名称: this.prop(参数属性)
                        ( prop 会优先限挂载于 vc 上，所以 data 内可以读取到 props)
                        (不要重名，重名情况下 props 优先级更高，并且会报错)
                    } }

            3. 组件传参
                (1) <组件名 传递参数1="" 传递参数2="" …… />
                    默认传递的参数全部为 String 格式
                (2) 传递非 String 格式的方式
                    传递参数时使用 v-bind:"参数名"
                    ("" 内为 js表达式，传递的就是参数原本的格式)
                (3) 参数名称禁止为 组件属性关键字(ref、key、……)

            4. 页面可以直接使用的原因
                接收到组件参数会将数据挂载于 vc 身上
                (所以参数名不要与 vc 身上其他参数名重名，会引起冲突)
    */

    export default {
        name: 'Student',
        data() {
            return {
                msg: '南德学院荣誉学生:',
                myAge: this.age,
            }
        },
        /* (1) 简单声明接收
        props: ['name','age'] */
        /* (2) 接收的同时对参数类型进行限制
        props: {
            name: String,
            age: Number,
        } */
        // (3) 限制类型、限制必要性、指定默认值
        props: {
            name: {
                type: String,
                required: true,             // 该属性必传
            },
            age: {
                type: Number,
                required: false,
                default: 18
            }
        },
        methods: {
            updateAge(){
                this.myAge ++
            }
        },
    }
</script>

<style>
</style>