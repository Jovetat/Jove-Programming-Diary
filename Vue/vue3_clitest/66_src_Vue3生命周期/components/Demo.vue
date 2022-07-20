<template>
	<h2>当前求和为:{{sum}}</h2>
	<button @click="sum++">sum++</button>
</template>

<script>
	/* 
		Vue3 生命周期
			详细请看 Vue3 生命周期.md 、Vue3 生命周期流程图、Demo.vue 案例
			对比观看 Vue2生命周期.md、Vue2生命周期流程图
	*/

	import {ref} from 'vue'
	// 引入组合式 API
	import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

	export default {
		name: 'Demo',
		setup() {
			let sum = ref(0)

			// 通过 组合式API 的形式使用生命周期钩子
			console.log('====== setup ======')
			onBeforeMount(()=>{
				console.log('====== onBeforeMount ======')
			})
			onMounted(()=>{
				console.log('====== onMounted ======')
			})
			onBeforeUpdate(()=>{
				console.log('====== onBeforeUpdate ======')
			})
			onUpdated(()=>{
				console.log('====== onUpdated ======')
			})
			onBeforeUnmount(()=>{
				console.log('====== onBeforeUnmount ======')
			})
			onUnmounted(()=>{
				console.log('====== onUnmounted ======')
			})


			return {
				sum
			}
		},
		// 通过配置项的形式使用生命周期钩子
		beforeCreate() {
			console.log('---- beforeCreate ----')
		},
		created() {
			console.log('---- created ----')
		},
		beforeMount() {
			console.log('---- beforeMount ----')
		},
		mounted() {
			console.log('---- mounted ----')
		},
		beforeUpdate() {
			console.log('---- beforeUpdate ----')
		},
		updated() {
			console.log('---- updated ----')
		},
		beforeUnmount() {
			console.log('---- beforeUnmount ----')
		},
		unmounted() {
			console.log('---- unmounted ----')
		},
	}

</script>