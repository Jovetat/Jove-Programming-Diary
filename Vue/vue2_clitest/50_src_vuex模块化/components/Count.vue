<template>
    <div>
        <!-- 组件内使用的为全局数据，其他组件也可读写且同理，就不使用其他组件读写过多赘述了 -->
        <h1>当前求和为：{{sum}}</h1>
        <h1>当前求和*10：{{$store.getters['countOptions/bigsum']}}可不就是{{bigsum}}</h1>
        <select v-model.number="num">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment(num)">+</button>
        <button @click="decrement(num)">-</button>
        <button @click="oddAdd">sum为奇数才可++</button>
        <button @click="addWait">延时++</button>
        <hr>
        <h2>{{$store.state.songOptions.song}}，{{song}}</h2>
        <h3 v-for="item in songList" :key="item.id">{{item.lyric}}</h3>
        <button @click="addSongServer">土味++</button>
    </div>
</template>

<script>
    /* 
        Vuex 模块化 + namespace命名空间
            详情请看 store/index.js 文件
    */

    // 引入
    import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'

    export default {
        name: 'Count',
        data() {
            return {
                num: 1,
            }
        },
        computed:{
            /* 
                在所有原先的调用前，添加了对应的命名空间指定
            */
            ...mapState('countOptions',['sum']),
            ...mapState('songOptions',['song','songList']),
            ...mapGetters('countOptions',['bigsum'])

        },
        methods: {
            ...mapMutations('countOptions',{increment:'ADDSUM',decrement:'SUBSUM'}),
            ...mapActions('songOptions',{addSongServer:'addSongServer'}),
            oddAdd(){
                this.$store.dispatch('countOptions/oddAdd',this.num)
            },
            addWait(){
                this.$store.dispatch('countOptions/addWait',this.num)
            },
        },
    }

</script>

<style scoped>
    button , select{
        padding: 5px 18px 5px 18px;
        font-size: 28px;
        border: none;
        margin: 10px;
        background-color: rgb(147, 201, 183);
        color: white;
        border-radius: 5px;
    }
</style>