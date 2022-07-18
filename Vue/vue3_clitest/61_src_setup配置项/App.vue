<template>
	<div>
		<h1>Vue3 来喽~</h1>
		<h3>{{age}}的{{name}}想说</h3>
		<h3>vue2中:{{sex}}</h3>
		<button @click="sayHello">Vue3讲话</button><br><br>
		<button @click="sayWelcome">Vue2诈尸</button>
	</div>
</template>

<script>
	/* 
		setup 配置项
			1. 定义
				Vue3.0中一个新的配置项，值为函数

			2. 理解
				setup 是所有 Composition API（组合API） “ 表演的舞台 ”

			3. *组件中所用到的：数据、方法等等，均要配置在 setup 中
			
			4. setup 函数的两种返回值：
				1) 返回一个对象 (常用)
					对象中的属性、方法, 在模板中均可以直接使用
				2) 返回一个渲染函数
					可以自定义渲染内容(通过 渲染函数h 的返回值可以得到一个渲染函数)

			5. 注意点：
				1) 尽量不要与 Vue2.x 配置混用
					(1) Vue2 配置(data、methos、computed...)中 可以访问到 setup 中的属性、方法(可以调用)
					(2) 在 setup 中 不能访问到 Vue2.x配置 (data、methos、computed...)
					(3) vue2 配置属性与 setup 中属性重名时,以 setup 优先
					(4) 虽然向下兼容 vue2 的配置项，但请不要这样混着用
				2) setup 不能是一个 async 函数，async 函数返回值不再是普通对象, 而是 promise包裹的对象, 模板将看不到 return 对象中的属性
					(后期也可以返回一个 Promise 实例，但需要 Suspense 和异步组件的配合)
	*/
	// 导入渲染函数 h
	import {h} from 'vue'

	export default {
		name: 'App',
		data() {
			return {
				sex: '男',
				// 重名属性优先 setup 中属性
				name: '我叛逆期到了'
			}
		},
		methods: {
			sayWelcome(){
				alert('我还活着 嘿嘿')
				// Vue2 配置(data、methos、computed...)中 可以访问到 setup 中的属性、方法
				console.log(this.sex,this.name,this.age,this.sayHello)
			}
		},
		// 此处只是测试一下 setup，暂时不考虑响应式的问题
		setup(props) {
			// 数据
			let name = '小鹿'
			let age = 80

			// 方法
			function sayHello(){
				alert(`hello ${age} 岁的 ${name}`)
				// 在 setup 中 不能访问到 Vue2.x配置 (data、methos、computed...)
				console.log(this.sex,this.sayWelcome,this.name,this.age)
			}

			// 返回一个对象
			return {
				name,
				age,
				sayHello
			}

			/* 返回一个渲染函数
			return ()=>{
				return h('h1','i love u')
				// 渲染函数指定标签和内容就可以返回一个渲染函数
				// 将渲染函数的返回值返回给 setup
			} */
			// 简写
			// return ()=> h('h1','i love u')
		}
	}
</script>