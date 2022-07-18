<template>
    <div>
        <!-- 组件内使用的为全局数据，其他组件也可读写且同理，就不使用其他组件读写过多赘述了 -->
        <h1>当前求和为：{{sum}}</h1>
        <h1>当前求和*10：{{$store.getters.bigsum}}可不就是{{bigsum}}</h1>
        <h2>{{$store.state.song}}，{{song}}</h2>
        <select v-model.number="num">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment(num)">+</button>
        <button @click="decrement(num)">-</button>
        <button @click="oddAdd">sum为奇数才可++</button>
        <button @click="addWait">延时++</button>
    </div>
</template>

<script>
    /* 
        Vuex 与 map方法
            详情请看 vuex/store.js 文件
    */

    // 引入
    import {mapState,mapGetters,mapActions,mapMutations} from 'vuex'

    export default {
        name: 'Count',
        data() {
            return {
                num: 1,                     // 用户选择的数字
            }
        },
        computed:{
            /* song(){
                return this.$store.state.song
            } */
            // 映射 state 中的数据为计算属性(对象写法)
            // ...mapState({ sum:'sum',song:'song' })
            // 映射 state 中的数据为计算属性(数组写法)
            ...mapState(['sum','song']),

            // 映射 getters 中的数据为计算属性(对象写法)
            // ...mapGetters({ bigsum:'bigsum'})
            // 映射 getters 中的数据为计算属性(数组写法)
            ...mapGetters(['bigsum'])

        },
        methods: {
            // 优化 commit，借助 mapMutations 生成对应方法，方法中会调用 commit 去联系 mutations
            ...mapMutations({increment:'ADDSUM',decrement:'SUBSUM'}),
            // 这里也可以呃使用数组方式映射加工，但不方便就使用对象方式了，这样在调用的时候需要传入参数！
            /* 
            // 普通写法，普通函数调用时不需要传入参数
            increment(){
                // this.sum += this.num
                // this.$store.dispatch('addSum',this.num)
                this.$store.commit('ADDSUM',this.num)
            },
            decrement(){
                // this.sum -= this.num
                this.$store.commit('SUBSUM',this.num)
            }, */
            oddAdd(){
                this.$store.dispatch('oddAdd',this.num)
            },
            addWait(){
                // 延时 ++，通过 actions 完成
                this.$store.dispatch('addWait',this.num)
            },
            /* 
                优化 dispath，借助 mapActions 生成对应方法，方法中会调用 dispatch 去联系 actions
                    ...mapActions({oddAdd:'oddAdd',addWait:'addWait'}),
                    ...mapActions(['oddAdd','addWait']),
                    在事件调用中传递参数
                    @click="addWait(num)
            */
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