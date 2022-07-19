<template>
	<h2>当前求和为:{{sum}}</h2>
	<button @click="sum++">sum++</button><hr>
	<h2>姓名：{{person.name}}，年龄：{{person.age}}，薪资{{person.job.j1.salary}}k</h2>
	<button @click="person.name+='!'">修改性名</button>
	<button @click="person.age++">age++</button>
	<button @click="person.job.j1.salary++">加薪</button>
</template>

<script>
	/* 
		watchEffect 函数

			1. 作用
				1) watchEffect 所指定的回调函数中用到的数据只要发生变化，则直接执行回调
				2) 不用指明监视哪个属性，监视的回调中用到哪个属性，就会监视哪个属性
					(而 watch函数 既要指明监视的属性，也要指明监视的回调)

			2. watchEffect 有点像 compute
				1) computed 注重的计算出来的值 (回调函数的返回值)，所以必须要写返回值
				2) watchEffect 更注重的是过程 (回调函数的函数体)，所以不用写返回值
				3) 二者都是依赖的数据发生变化时执行回调，且在初始化时就会执行一次

			3. 实现方式
				0) 引入 watchEffect，在 vue3 中为一个 组合式的API
					import { watchEffect } from 'vue'
				1) 
					watchEffect( ()=>{
						(1) 回调内使用的每个数据只要发生变化都会触发回调函数执行
						(2) 会在初始化时调用一次回调函数
						const x1 = sum.value
						const x2 = person.job.j1.salary
						console.log('watchEffect配置的回调执行了')
					})

	*/

	// 引入 watchEffect
	import {ref, reactive, watchEffect} from 'vue'

	export default {
		name: 'App',
		setup() {
			// 数据
			let sum = ref(0)
			let msg = ref('你好呀')
			let person = reactive({
				name: 'shy',
				age: 28,
				job: {
					j1: {
						salary: 20
					}
				}
			})

			// 监视
			watchEffect(()=>{
				console.log('watchEffect配置的回调执行了')
				const x1 = sum.value
				const x2 = person.job.j1.salary
			})

			// 返回一个对象
			return {
				sum,
				msg,
				person
			}
		}
	}

</script>