<template>
    <div class="child">
        <h3>Child组件(子),{{car}}</h3>
        <Son/>
    </div>
</template>

<script>
	/* 
		provide 与 inject 通信
            详细请看 App.vue 文件
	*/

    import Son from './Son.vue'
	import { inject } from 'vue'

	export default {
		name: 'Child',
        components: {Son},
		setup() {
			// 接收祖组件传来的通信数据，但父子间数据传递一般使用 props
            const car = inject('car')
			return { car }
		}
	}

</script>

<style>
	.child{
		background-color: #e6a4a4;
		padding: 10px;
	}
</style>