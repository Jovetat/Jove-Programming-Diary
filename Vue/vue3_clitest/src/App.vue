<template>
	<h2>name:{{name}}</h2>
	<h2>age:{{age}}</h2>
	<button @click="changeInfo">修改信息</button>
	<h3>他是个{{job.type}}拿着{{job.salary}}上班为了下班</h3>
</template>

<script>
	/* 
		Vue3 响应式

		ref 函数
			1. 作用: 定义一个响应式的数据
			2. 语法:
				0) 引入 ref
					import {ref} from 'vue'
				1) 定义响应式数据
					const 数据名xxx = ref(initValue)
					(1) 这里 ref 加工完返回一个 包含响应式数据的 引用对象 (reference 对象，简称 ref 对象)
					(2) RefImpl --> reference 引用 + implement 实现 --> 引用的实现构造函数
					(3) 所以 ref 加工出来的对象称为 ref对象/引用对象 (全称:引用实现的实例对象)
				2) 读写数据
					(1) 基本数据类型
						数据名.value
					(2) 对象数据类型
						对象名.value.属性名1. ……
				3) 模板中读取数据
					<div> {{数据名}} </div>
					(解析模板时发现变量为 ref对象[引用对象]就会自动读取其 value属性)
			3. ref 接收的数据类型
				1) 基本类型的数据
					(1) 响应式依然是靠 Object.defineProperty() 的 get 与 set 完成的
					(2) getter、setter 和 value 都在引用对象的原型身上，通过数据代理使引用对象读写 value
						(有些类似于之前 _data 中的数据代理到 vc/vm 上方便用户读写)
					(3) 通过数据劫持的方式完成响应式 (同 vue2)
				2) 对象类型的数据
					(1) 内部 “求助 ” 了 Vue3 中的一个新函数 reactive()
					(2) 对象仍为 ref对象
					(3) 对象.value 值为一个 Proxy代理对象，存放对象属性
					(4) 通过 ES6 proxy 实现响应式
		
		reactive() 函数
			(1) 作用
				定义一个 对象类型 的响应式数据 (基本类型不会用到它，只用 ref 函数）
			(2) 语法
				const 代理对象 = reactive(源对象) 接收一个对象（或数组），返回一个 代理对象 (Proxy 的实例对象，简称 proxy对象)
			(3) reactive 定义的响应式数据是 “深层次的”
			(4) 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作

	*/

	import {ref} from 'vue'

	export default {
		name: 'App',
		setup(props) {
			// 定义响应式数据
			let name = ref('说好的幸福呢')
			let age = ref(9)
			let job = ref({
				type: '前端工程师',
				salary: '3k'
			})

			// 方法
			function changeInfo(){
				console.log(name,job)
				name.value = '我懂了，不说了/(ㄒoㄒ)/~~'
				age.value = 10
				job.value.type = '保安'

			}

			// 返回一个对象
			return {
				name,
				age,
				job,
				changeInfo
			}
		}
	}

</script>