<template>
    <div>
        <Singer/>
        <Song/>
        <hr>
    </div>
</template>

<script>
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