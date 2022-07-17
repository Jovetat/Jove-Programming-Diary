<template>
    <div>
        <song/>
        <singer/>
        <hr>
    </div>
</template>

<script>
    /* 
        全局事件总线
            详情请看 main.js
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