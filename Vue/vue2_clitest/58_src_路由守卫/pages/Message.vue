<template>
    <div>
        <ul>
            <li v-for="item in messageList" :key="item.id">
                <router-link :to=" `/home/message/detail?id=${item.id}&title=${item.title}` ">{{item.title}}</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
    /* 
        路由守卫
            详细请看 router/index.js 文件
    */

    export default {
        name: 'Message',
        data() {
            return {
                messageList: [
                    {id: '001', title: '如果没有遇见你'},
                    {id: '002', title: '我将会是在哪里'},
                    {id: '003', title: '日子过得怎么样'},
                    {id: '004', title: '生活十分还继续'},
                ]
            }
        },
        beforeRouteEnter (to, from, next) {
            console.log('Message组件内路由守卫 beforeRouteEnter')
            if(to.meta.isAuth){
                // 判断当前路由是否需要进行权限控制
                if(localStorage.getItem('school') === 'xbmu'){
                    // 权限控制的具体规则
                    next()
                }else{
                    alert('暂无权限查看')
                }
            }else{
                next()
            }
        },
        beforeRouteLeave (to, from, next) {
            console.log('Message组件内路由守卫 beforeRouteLeave')
            if(!confirm('不走好不好')){
                next()
            }
        }
    }
    
</script>