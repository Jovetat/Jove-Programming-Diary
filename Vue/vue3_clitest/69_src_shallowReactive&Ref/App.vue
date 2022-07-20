<template>
	<h2>姓名：{{name}}，年龄：{{age}}，薪资{{job.j1.salary}}k</h2>
	<button @click="name+='!'">修改性名</button>
	<button @click="age++">age++</button>
	<button @click="job.j1.salary++">加薪</button><hr>
	<h4>sum.x：{{sum.x}}</h4>
	<button @click="sum.x++">sum++</button>
	<button @click="sum = {x:'直接一波的夺舍'}">替换sum</button>
</template>

<script>
	/* 
		shallowReactive 与 shallowRef
			(shallow 浅层次的)

			1. shallowReactive
				只处理对象最外层属性的响应式 (浅响应式的 reactive)

			2. shallowRef
				只处理基本数据类型的响应式, 不进行对象的响应式处理
				(传入基本数据类型时与 ref 作用无区别，传入对象不会去调用 reactive，ref对象的 value值直接是一个普通对象)
				[只有直接替换是响应式的，通过新的对象赋值给 ref对象的 value值]

			3. 什么时候使用
				(1) 如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 --使用--> shallowReactive
				(2) *如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 --使用--> shallowRef

	*/

	import { ref, reactive, toRefs, shallowReactive, shallowRef } from 'vue'

	export default {
		name: 'App',
		setup() {
			
			// 只考虑第一层数据的响应式
			let person = shallowReactive({
			// let person = reactive({
				name: 'shy',
				age: 23,
				job: {
					j1: {
						salary: 20
					}
				}
			})
			// let sum = ref({
			let sum = shallowRef({
				x: 0
			})
			console.log(sum)

			return {
				...toRefs(person),
				sum,
			}
		}
	}

</script>