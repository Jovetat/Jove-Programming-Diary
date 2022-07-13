<template>
    <div class="row">
        <!-- 展示用户列表 -->
        <div v-show="listInfo.userList.length" class="card" v-for="item in listInfo.userList" :key="item.login">
            <a :href="item.html_url" target="_blank">
                <img :src="item.avatar_url" style='width: 100px' />
            </a>
            <p class="card-text">{{item.login}}</p>
        </div>
        <!-- 展示欢迎词 -->
        <h1 v-show="listInfo.isFirst">欢迎使用 GitHub 用户搜索</h1>
        <!-- 展示加载中 -->
        <h1 v-show="listInfo.isLoading">加载中...</h1>
        <!-- 展示错误信息 -->
        <h1 v-show="listInfo.errorMsg">请求出错了{{listInfo.errorMsg}}</h1>
    </div>
</template>

<script>
    export default {
        name: 'List',
        data() {
            return {
                listInfo: {
                    userList: [],
                    isFirst: true,
                    isLoading: false,
                    errorMsg: ''
                }
            }
        },
        mounted() {
            // 接收来自 Search 搜索返回的数据(全局事件总线)
            this.$bus.$on('updataListData',(dataObj)=>{
                this.listInfo = {...this.listInfo,...dataObj}
                // 通过字面量的形式合并对象，这样尽管不传某个数据也不会造成该属性丢失
                // {...} 原理就是合并对象，重名属性以后面的属性为主，将这个结果返回给 listInfo
            })
        },
    }
</script>

<style scoped>
    .album {
      min-height: 50rem; /* Can be removed; just added for demo purposes */
      padding-top: 3rem;
      padding-bottom: 3rem;
      background-color: #f7f7f7;
    }
    .card {
      float: left;
      width: 33.333%;
      padding: .75rem;
      margin-bottom: 2rem;
      border: 1px solid #efefef;
      text-align: center;
    }
    .card > img {
      margin-bottom: .75rem;
      border-radius: 100px;
    }
    .card-text {
      font-size: 85%;
    }
</style>