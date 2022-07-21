// 鼠标打点相关逻辑
import { onBeforeUnmount, onMounted, reactive } from 'vue'
export default function(){
    // 实现鼠标打点的数据
    let point = reactive({
        x: 0,
        y: 0
    })

    // 实现鼠标打点相关的方法
    function savePoint(event){
        point.x = event.pageX
        point.y = event.pageY
    }

    // 实现鼠标打点相关的生命周期钩子
    // 绑定获取鼠标事件
    onMounted(()=>{
        window.addEventListener('click',savePoint)
    })
    // 卸载前解绑
    onBeforeUnmount(()=>{
        window.removeEventListener('click',savePoint)
    })

    return point
}