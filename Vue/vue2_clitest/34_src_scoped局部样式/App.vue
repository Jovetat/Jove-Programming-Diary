<template>
    <div>
        <Singer/>
        <Song/>
        <hr>
    </div>
</template>

<script>
    /* 
       scoped 局部样式
            详情查看 Singer 组件
    */
   
    import Singer from './components/Singer.vue'
    import Song from './components/Song.vue'

    export default {
        name: 'App',
        components: {
            Song,
            Singer
        },
    }
</script>