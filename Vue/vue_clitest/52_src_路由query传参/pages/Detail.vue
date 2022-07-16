<template>
    <ul>
        <li>歌词编号：{{$route.query.id}}</li>
        <li>歌词内容：{{$route.query.title}}</li>
    </ul>
</template>

<script>
    export default {
        name: 'Detail',
        mounted() {
            console.log(this.$route)
        },
    }
</script>