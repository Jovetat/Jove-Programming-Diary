<template>
    <div class="son">
        <h3>Son组件(孙),{{car}}</h3>
		<button @click="car.price++">price++</button>
    </div>
</template>

<script>
	/* 
		provide 与 inject 通信
            详细请看 App.vue 文件
	*/

	import { inject } from 'vue'

	export default {
		name: 'son',
		setup() {
			// 接收祖组件传来的通信数据
            const car = inject('car')
            return { car }
		}
	}

</script>

<style>
	.son{
		background-color: #a1c2dd;
		padding: 10px;
	}
</style>