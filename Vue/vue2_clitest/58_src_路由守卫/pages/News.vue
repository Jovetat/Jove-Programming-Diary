<template>
    <ul>
        <li>news001 <input type="text"></li>
        <li>news002 <input type="text"></li>
        <li>news003 <input type="text"></li>
    </ul>
</template>

<script>

    export default {
        name: 'News',
        beforeRouteEnter (to, from, next) {
            console.log('News组件内路由守卫 beforeRouteEnter')
            next()
        },
        beforeRouteLeave (to, from, next) {
            console.log('News组件内路由守卫 beforeRouteLeave')
            next()
        }
    }
</script>