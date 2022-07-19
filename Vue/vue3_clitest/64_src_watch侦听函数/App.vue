<template>
	<h2>当前求和为:{{sum}}</h2>
	<button @click="sum++">sum++</button><hr>
	<h2>当前的信息为:{{msg}}</h2>
	<button @click="msg+='!'">修改信息</button><hr>
	<h2>姓名：{{person.name}}，年龄：{{person.age}}，薪资{{person.job.j1.salary}}k</h2>
	<button @click="person.name+='!'">修改性名</button>
	<button @click="person.age++">age++</button>
	<button @click="person.job.j1.salary++">加薪</button>
</template>

<script>
	/* 
		watch 侦听函数

			1. 与 Vue2 中 watch配置 功能一致，在 vue3 中为一个 组合式的API

			2. 注意(特殊之处)
				1) 监视 reactive 定义的响应式数据时
					oldValue 无法正确获取，且此时 vue 强制开启了深度监视 (deep配置失效)
				2) 监视 reactive 定义的响应式数据中 某个/些 属性时
					deep配置 有效(默认值为 false)，oldValue 在侦听属性为 proxy对象时无法正确获取
				3) 可以为单个数据项添加多个侦听

			3. 实现侦听
				0) 引入 watch
					import {watch} from 'vue'

				1) 监视 ref 定义的响应式数据
					watch(侦听的 ref对象, (newValue,oldValue)=>{
						(1) 数据变化执行的 handler回调
						(2) newValue 与 oldValue 分别为侦听的 ref对象 变化前 与 变化后 的值
					},{...侦听的配置项...})
						(3) 传入的第三个参数为 侦听的配置项，可省略
							immediate: 默认为 false，配置是否 会在初始化时调用一次 handler，此时 oldValue值为 undefined
						(4) 放心的写箭头函数，setup 内 this 为 undefined

				2) 监视多个 ref 定义的响应式数据
					watch([侦听的 ref对象1, 侦听的 ref对象2, ……], (newValue,oldValue)=>{
						(1) 数组中 所有被侦听的 ref对象 变化执行的 handler回调
						(2) newValue/oldValue 值为一个数组
							new/oldValue[index数组中侦听的 ref对象位置对应下标] 为对应侦听的 ref对象 new/old 的 value 值
					},{...侦听的配置项...})
						(3) 传入的第三个参数为 侦听的配置项，可省略
							immediate: 默认为 false，配置是否 会在初始化时调用一次 handler，此时 oldValue值为 空数组[]

				3) 监视 reactive 定义的响应式数据的 全部属性
					watch(侦听的 proxy对象, (newValue,oldValue)=>{
						(1) proxy对象属性变化执行的 handler回调
						(2) oldValue 无法被正确获取!!!，值同 newValue 为一个更新后的 proxy对象
					},{...侦听的配置项...})
						(3) 强制开启了 深度监视!!! (deep配置失效)
						(4) 传入的第三个参数为 侦听的配置项，可省略
							immediate: 默认为 false，配置是否 会在初始化时调用一次 handler，此时 oldValue值为 undefined
				
				4) 监视 reactive 定义的响应式数据中的 某个属性
					watch(()=>侦听的 proxy对象.属性名, (newValue,oldValue)=>{
						(1) proxy对象被侦听的属性变化执行的 handler回调
						(2) newValue/oldValue 可正常获取，值为 proxy对象
					},{...侦听的配置项...})
						(3) 传入的第三个参数为 侦听的配置项，可省略
							deep: 默认为 false，配置是否开启 深度监视
							immediate: 默认为 false，配置是否 会在初始化时调用一次 handler，此时 oldValue值为 undefined
						(4) 如果侦听的 proxy对象.属性值为 proxy对象
							oldValue 无法被正确获取，deep配置 仍然有效
				
				5) 监视 reactive 定义的响应式数据中的 某些属性
					watch( [()=>侦听的 proxy对象.属性名1,()=>person.name, ……], (newValue,oldValue)=>{
						(1) 数组中 所有被侦听属性 变化执行的 handler回调
						(2) newValue/oldValue 值为一个数组
							new/oldValue[index数组中侦听属性位置对应下标] 为对应侦听属性 new/old 的 value 值
					},,{...侦听的配置项...})
						(3) 传入的第三个参数为 侦听的配置项，可省略
							deep: 默认为 false，配置是否开启 深度监视
							immediate: 默认为 false，配置是否 会在初始化时调用一次 handler，此时 oldValue值为 空数组[]
						(4) 如果数组中有侦听的 proxy对象.属性值为 proxy对象
							oldValue[仅该项index] 无法被正确获取，deep配置 仍然有效
		

	*/

	// 引入 watch
	import {ref, reactive, watch} from 'vue'

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

			// 侦听
			// 情况一：监视ref定义的响应式数据
			watch(sum,(newValue,oldValue)=>{
				console.log('sum被侦听到数据变化',newValue,oldValue)
			},{immediate:true})
			// 情况二：监视多个ref定义的响应式数据
			watch([sum,msg],(newValue,oldValue)=>{
				console.log('sum/msg被侦听到数据变化',newValue,oldValue)
			})
			// 情况三：监视reactive定义的响应式数据
			watch(person,(newValue,oldValue)=>{
				console.log('person被侦听到数据变化',newValue,oldValue)
			},{deep:false})
			// 情况四：监视reactive定义的响应式数据中的某个属性
			watch(()=>person.job,(newValue,oldValue)=>{
				console.log('person.job被侦听到数据变化',newValue,oldValue)
			},{deep:false})
			// 情况五：监视reactive定义的响应式数据中的某些属性
			watch([()=>person.job,()=>person.name],(newValue,oldValue)=>{
				console.log('person的job/name变化了',newValue,oldValue)
			},{immediate:true,deep:true})

			// 返回一个对象
			return {
				sum,
				msg,
				person
			}
		}
	}

</script>