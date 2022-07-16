// 求和相关的配置
export default {
    namespaced: true,
    actions:{
        oddAdd(context,value){
            if(context.state.sum % 2 != 0){
                context.commit('ADDSUM',value)
            }
        },
        addWait(context,value){
            setTimeout(()=>{
                context.commit('ADDSUM',value)
            },500)
        }
    },
    mutations:{
        ADDSUM(state,value){
            console.log('mutations ADDSUM被调用')
            state.sum += value
        },
        SUBSUM(state,value){
            state.sum -= value
        }
    },
    state:{
        sum: 0,                     // 当前的和
    },
    getters:{
        bigsum(state){
            return state.sum * 10
        }
    }
}