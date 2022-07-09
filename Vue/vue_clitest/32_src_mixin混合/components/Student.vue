<template>
    <div>
        <h3 @click="showName">{{name}}</h3>
        <h3>{{sex}}</h3>
        <h3>x:{{x}}--y:{{y}}</h3>
    </div>
    <!-- mixin混入 -->
</template>

<script>
    // 引入一个混合
    import {hunhe,hunhe2} from '../mixin'

    export default {
        name: 'Student',
        data() {
            return {
                name: '苏打绿',
                sex: '嬲',
            }
        },
        mixins: [hunhe,hunhe2]
    }
</script>

<style>
</style>