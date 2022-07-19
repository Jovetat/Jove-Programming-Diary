<template>
	<h2>name:{{name}}</h2>
	<h2>age:{{age}}</h2>
	<button @click="changeInfo">修改信息</button>
	<h3>他是个{{job.type}}拿着{{job.salary}}上班为了下班</h3>
	<h3>他是 name:{{singer.name}} 唱着 song:{{singer.song}} |是为了表演 {{singer.a.b.c}}</h3>
	<h4 v-if="singer.newAttr">{{singer.newAttr}}</h4>
	<button @click="singerInfo">singer</button><br><br>
	<h3>就喜欢：{{hobby}}</h3><br>
	<button @click="changeHobby">不抽烟了</button>
</template>

<script>
	/* 
		<-- Vue3 响应式数据 -->

		ref 函数
			1. 作用: 定义一个响应式的数据
			2. 语法
				0) 引入 ref
					import {ref} from 'vue'
				1) 定义响应式数据
					const 数据名xxx = ref(initValue)
					(1) 这里 ref 加工完返回一个 包含响应式数据的 引用对象 (reference 对象，简称 ref 对象)
					(2) RefImpl --> reference 引用 + implement 实现 --> 引用的实现构造函数
					(3) 所以 ref 加工出来的对象称为 ref对象/引用对象 (全称:引用实现的实例对象)
				2) 读写数据
					(1) 基本数据类型
						ref对象xxx.value
					(2) 对象数据类型
						ref对象xxx.value.属性名1. ……
						(value 只在开头写一次，因为 value 值为 proxy对象，读取时不需要 .value)
				3) 模板中读取数据
					(1) 基本数据类型
						<div> {{ 数据名xxx }} </div>
						(解析模板时发现变量为 ref对象[引用对象]就会自动读取其 value属性)
					(2) 对象数据类型
						<div> {{ ref对象xxx.属性名1 }} </div>
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
			1. 作用
				定义一个 对象/数组 类型的响应式数据 (基本类型不会用到它，只用 ref 函数）
			2. 语法
				0) 引入 reactive
					import { reactive } from 'vue'
				1) 定义 对象/数组 类型响应式数据
					const 代理对象yyy = reactive(源对象)
					(1) 这里 reactive 加工完返回一个 代理对象 (Proxy 的实例对象，简称 proxy对象)
				 	(2) 源对象为一个 对象/数组 (不可传入基本数据类型)
				2) 读写数据
					proxy对象yyy.属性名
					proxy对象yyy[index]
				3) 添加或删除属性
					(1) 添加属性
						proxy对象yyy.新属性名 = value
					(2) 删除属性
						delete proxy对象yyy.删除属性名
				4) 模板中读取数据
					<div> {{ proxy对象yyy.属性名1 }} </div>
					<div> {{ proxy对象yyy[index] }} </div>
			3. reactive 定义的响应式数据是 “深层次的”
			4. 理解
				1) 内部基于 ES6 的 Proxy 实现响应式，通过代理对象操作源对象内部数据进行操作
				2) 因为通过 reactive 使用响应式数据会更加方便，所有可以将基本数据类型包入对象内使用
		
		ref 与 reactive 间的对比
			1. 从定义数据对比
				(1) ref 用于定义 基本类型数据
				(2) reactive 用于定义 对象/数组 引用类型数据
				(3) 备注：ref 也可以用来定义 引用类型数据, 它内部会自动将 value 值通过 reactive 转为 代理对象
			2. 从原理角度对比：
				(1) ref 通过 Object.defineProperty() 的 get 与 set 来实现响应式 (数据劫持)
				(2) reactive 通过使用 Proxy 来实现响应式 (数据劫持), 并通过 Reflect 操作 源对象 内部的数据
			3. 从使用角度对比：
				(1) ref 定义的数据：操作数据 需要 .value ，模板中直接读取数据 不需要 .value
				(2) reactive 定义的数据：操作数据与读取数据：均不需要 .value
			4. 一般会将基本类型数据封装在一个对象里由 reactive 加工为一个 代理对象

		vue2 的响应式原理回顾
			1.实现原理：
				1) 对象类型
					通过 Object.defineProperty() 对属性的读取、修改进行拦截 (数据劫持)
				2) 数组类型
					通过重写更新数组的一系列方法来实现拦截 (对数组的变更方法进行了包裹)
				3) 模拟 js 实现响应式原理过程
					let person = { name: 'Tank', age: 45 } let per = {}
					(1) 通过 defineProperty 代理 对象的所有属性(每个属性都需要重新 defineProperty)
					Object.defineProperty(per, '属性名attr', {
						configurable: true(配置为 true 才可 delet 此属性，默认值为 false，可删除但非响应式)
						get(){ 读取 attr 时调用，返回一个值 return person.name }, 
						set(value){
							修改 attr 时调用 person.name = value
							(2) 数据劫持
								发现数据更新，重新渲染界面的代码....
						}
					}) ...defineProperty其他属性
					per.name = 'Knat'
					delete per.age
			2. 存在问题：
				1) 新增属性、删除属性, 界面不会更新
					(1) 响应式新增属性需 $set/Vue.set，无法直接(对象.新属性 = 赋值)完成
					(2) 响应式删除属性需 $delete/Vue.delet，无法直接(delete 对象.删除属性)完成
				2) 直接通过下标修改数组, 界面不会自动更新
					修改数组需 $set/Vue.set 或通过 数组的变更方法改写数组
		
		Vue3 的响应式原理
			1. 实现原理: 
				1) Proxy(代理)
					通过 Proxy 拦截对象中任意属性的变化, 包括：属性值的读写、属性的添加、属性的删除等
				2) Reflect(反射)
					(1) 通过 Reflect反射对象 对源对象的属性进行操作(ES6 新功能)
					(2) 查 --> Reflect.get(对象,'属性名')
					(3) 改/增 --> Reflect.set(对象,'属性名',newValue)
					(4) 删 --> Reflect.deleteProperty(对象,'属性名')
					(5) 相比直接操作 object 稳定性更好，更加健壮，可以少写一些 try catch
			2. MDN文档中描述的 Proxy 与 Reflect
				1) Proxy：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
				2) Reflect：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
			3. vue3 解决了 vue2 中存在的问题
				1) 可以直接 新增/删除属性并且是响应式的
				2) 可以直接通过下标修改数组并且是响应式的
			4. 模拟 js 实现响应式原理过程
				let person = { name: 'Tank', age: 45 }
				1) 通过代理对象(proxy对象) 代理 对象
				const 代理对象per = new Proxy(源对象person, {
					2) 不要任何配置增删改查属性 Proxy 也可以直接捕获到并代理
					3) 数据拦截 读取 属性值
						get (target, propName) {
							(1) 读取代理对象属性时调用
							(2) 参数：target  --> 源对象person ，prop --> 读取的属性名
							// return target[propName] 通过 Reflect反射对象 操作程序更加稳定，可以少写一些 try catch
							return Reflect.get(target, propName)
						},
					4) 数据拦截 更新/添加 属性值
						set (target, prop, value) {
							(1) 修改代理对象属性时调用
							(2) 参数：target  --> 源对象person ，prop --> 修改的属性名，value --> 修改值
							(3) 数据劫持
								发现数据更新，重新渲染界面的代码....
							// target[propName] = value
							return Reflect.set(target, propName, value)
						},
					5) 数据拦截 删除 属性
						deleteProperty (target, prop) {
							(1) 删除代理对象属性时调用
							(2) 参数：target  --> 源对象person ，prop --> 删除的属性名
							(3) 数据劫持
								发现数据更新，重新渲染界面的代码....
							// return delete target[propName]
							return Reflect.deleteProperty(target, propName)
							(4) delete 会返回成功与否的 bool值
						}
					6) 增删改查都齐活了
				})
				per代理对象.name = 'tom' 


	*/

	import {ref,reactive} from 'vue'

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
			// 定义对象类型的响应式数据
			let singer = reactive({
				name: 'JFLA',
				song: 'Stay',
				a:{
					b:{
						c: 233
					}
				}
			})
			// 定义数组类型的响应式数据
			let hobby = reactive(['抽烟','喝酒','烫头'])

			// 方法
			function changeInfo(){
				console.log(name,job)
				name.value = '我懂了，不说了/(ㄒoㄒ)/~~'
				age.value = 10
				job.value.type = '保安'

			}
			function singerInfo(){
				console.log(singer)
				singer.name = '小鱼'
				singer.song = '敬请期待'
				singer.a.b.c = 999
				// 添加属性
				singer.newAttr = '插手你的人生'
				// 删除属性
				delete singer.song
			}
			function changeHobby(){
				console.log(hobby)
				hobby[0] = '戒烟'
			}

			// 返回一个对象
			return {
				name,
				age,
				job,
				singer,
				hobby,
				changeInfo,
				singerInfo,
				changeHobby
			}
		}
	}

</script>