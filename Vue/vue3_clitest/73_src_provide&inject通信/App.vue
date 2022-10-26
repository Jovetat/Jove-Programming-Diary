<template>
	<div class="app">
		<h3>App组件(祖),{{car}}[源数据在此]</h3>
		<!-- TODO: 将 App 中数据传给 Son组件 -->
		<Child/>
	</div>
</template>

<script>
	/*
		provide & inject 通信

			1. 作用
				实现 祖与后代(跨级)组件间 通信

			2. 形式
				父组件使用 provide 选项来提供数据
				任意后代组件使用 inject 选项来开始使用这些数据

			3. 使用方法
				1) 祖组件中提供
					setup(){
						......
						provide('通信数据名',通信数据)
						eg:
							let car = reactive( {name:'奔驰',price:'40万'} )
							provide('car',car)
						......
					}
				2) 任意后代组件中接收
					setup(){
						......
						inject('通信数据名')
						eg:
							const car = inject('car')
						......
					}

			4. 理解
				(1) 祖组件 provide 传入响应式数据，在后代组件中 inject到的仍是响应式的，会随数据变化同步更新
				(2) 传入响应式数据，在后代组件中是可更改的，并且会全局同步，包括祖组件内源数据
				(3) 在 Vue 文档中并没有对此进行详细探讨，所以不清楚在后代组件修改通信数据是否合法


	*/

	import Child from './components/Child.vue'
	import { provide, reactive } from 'vue'

	export default {
		name: 'App',
		components: {Child},
		setup() {
			let car = reactive( {name: '帕拉梅拉', price: 140} )
			// 向后代组件提供通信数据
			provide('car',car)
			return { car }
		}
	}

</script>

<style>
	.app{
		background-color: rgb(241, 235, 218);
		padding: 10px;
	}
</style>