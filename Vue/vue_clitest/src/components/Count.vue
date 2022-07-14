<template>
    <div>
        <h1>当前求和为：{{$store.state.sum}}</h1>
        <select v-model.number="num">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="oddAdd">sum为奇数才可++</button>
        <button @click="addWait">延时++</button>
    </div>
</template>

<script>
    export default {
        name: 'Count',
        data() {
            return {
                num: 1,                     // 用户选择的数字
            }
        },
        methods: {
            increment(){
                // this.sum += this.num
                // this.$store.dispatch('addSum',this.num)
                this.$store.commit('ADDSUM',this.num)
            },
            decrement(){
                // this.sum -= this.num
                this.$store.commit('SUBSUM',this.num)
            },
            oddAdd(){
                this.$store.dispatch('oddAdd',this.num)
            },
            addWait(){
                // 延时 ++，通过 actions 完成
                this.$store.dispatch('addWait',this.num)
            },
        },
    }

    /* 
        Vuex
            详情请看 vuex/store.js 文件
    */

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