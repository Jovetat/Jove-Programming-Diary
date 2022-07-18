<template>
    <div>
        <input type="text" placeholder="请输入用户昵称" v-model="keyWord"/>&nbsp;
        <button @click="searchUers">Search</button>
    </div>
</template>

<script>

    /* 
        vue-resource
            1. 简介
                发送 ajax 的库，是对 xhr 的封装
                作为 Vue 的插件使用，原先由 Vue 开发，现在已经交给其他团队维护了(用的少，Vue1.0 时使用较多)
                改改老项目罢了，了解即可，axios yyds
            2. 初始化
                (1) 安装
                    npm i vue-resource
                (2) 在 main.js 引入插件
                    import vueResource from 'vue-resource'
                (3) 使用插件(会向 vm/vc 添加属性 $http)
                    Vue.use(vueResource)
            3. 使用 vue-resource 发送 ajax 请求
                this.$http.get('请求地址').then()       也是 promise 风格的
                (与 25_axios API的用法、返回值等一模一样)
    */

    export default {
        name: 'App',
        data() {
            return {
                keyWord: '',
            }
        },
        methods: {
            searchUers(){
                this.$http.get(`https://api.github.com/search/users?q=${this.keyWord}`).then(
                    response => {
                        console.log('请求成功',response.data)
                    },
                    error => {
                        console.log('请求失败',error)
                    }
                )
            }
        }
    }
</script>