<template>
	<!-- 控制组件 挂载/卸载 -->
	<button @click="isShowDemo = !isShowDemo">显示/隐藏</button>
	<Demo v-if="isShowDemo"/>
</template>

<script>
	/* 
		Vue3 生命周期
			详细请看 Vue3 生命周期.md 、Vue3 生命周期流程图、Demo.vue 案例
			对比观看 Vue2生命周期.md、Vue2生命周期流程图
	*/

	import Demo from './components/Demo.vue'
	import { ref } from 'vue'

	export default {
		name: 'App',
		components:{ Demo },
		setup() {
			let isShowDemo = ref(true)

			return {
				isShowDemo
			}
		}
	}

</script>