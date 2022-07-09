<template>
    <div>
        <h3 @click="showName">{{name}}</h3>
        <h3>{{address}}</h3>
    </div>
    <!-- mixin混入 -->
</template>

<script>
    // 引入一个混合
    import {hunhe} from '../mixin'

    export default {
        name: 'School',
        data() {
            return {
                name: '男德南德，very good',
                address: '山东菏泽',
            }
        },
        mounted() {
            console.log('巧了，我也使用生命周期')
        },
        mixins: [hunhe]
    }
</script>

<style>
</style>