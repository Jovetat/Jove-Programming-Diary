<template>
    <section class="jumbotron">
        <h3 class="jumbotron-heading">Search Github Users</h3>
        <div>
            <input type="text" placeholder="请输入用户昵称" v-model="keyWord"/>&nbsp;
            <button @click="searchUers">Search</button>
        </div>
    </section>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'Search',
        data() {
            return {
                keyWord: '',
            }
        },
        methods: {
            searchUers(){
                // get请求 https://api.github.com/search/users?q=xx 地址会返回对应搜索的用户数据
                // 虽然跨域，但是 github 后端通过 cors 解决了
                // 请求之前更新 List 数据
                this.$bus.$emit('updataListData',{isFirst:false,isLoading:true,errorMsg:'',userList:[]})
                // 这样写传递属性方便发送属性时看明白而且顺序不影响，赋值的时候也比较方便

                axios.get(`https://api.github.com/search/users?q=${this.keyWord}`).then(
                    response => {
                        console.log('请求成功',response.data)
                        // 这里通过全局事件总线的方式向兄弟组件传参
                        // 请求成功后更新 List 数据
                        this.$bus.$emit('updataListData',{isLoading:false,errorMsg:'',userList:response.data.items})
                    },
                    error => {
                        console.log('请求失败',error)
                        // 请求失败后更新 List 数据
                        this.$bus.$emit('updataListData',{isLoading:false,errorMsg:error.message,userList:[]})
                    }
                )
                // 这里使用 es6 模板字符串 `内部可以写 ${js表达式}`
                /* 
                    接口文档：
                        incomplete_results: bool    标识是否为完整数据
                        total_count: 5222           数据总数
                        items: [……]                 传来的数据(传来30个，不会全部传来)
                            avatar_url  用户头像地址
                            html_url    对应 github 主页
                            login       用户名
                */
            }
        },
    }
</script>

<style scoped>
    button{
        border: none;
        width: 100px;
        height: 25px;
        border-radius: 10px;
        background-color: rgb(188, 219, 217);
    }
</style>