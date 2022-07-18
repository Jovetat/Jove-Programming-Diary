<template>
    <div>
        <song/>
        <singer/>
        <hr>
    </div>
</template>

<script>
    /* 
        消息订阅与发布
            详情请看 Singer.vue
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