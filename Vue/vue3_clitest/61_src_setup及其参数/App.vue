<template>
	<h1>Vue3 来喽~</h1>
	<h3>{{age}}的{{name}}想说</h3>
	<h3>vue2中:{{sex}}</h3>
	<button @click="sayHello">Vue3讲话</button><br><br>
	<button @click="sayWelcome">Vue2诈尸</button>
	<Demo :name="name" msg="烤面包好好吃啊" laji="没有人要" @hello="showHelloMsg">
		<h2>一只插槽</h2>
	</Demo>
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

			5. setup 执行的时机		Demo.vue 中演示
				在 beforeCreate 之前执行，setup() 内 this 为 undefined

			6. setup 的参数			Demo.vue 中演示
				1) props
					值为 proxy对象(响应式)，包含组件外部传递过来，且组件内部声明接收了的属性
				2) context 上下文对象
					(1) attrs: 值为对象，包含组件外部传递过来，但没有在 props 配置中声明的属性, 相当于vue2 this.$attrs
					(2) slots: 接收向自身插槽发送的 虚拟DOM, 相当于vue2 this.$slots(无论有没有定义插槽都可以接收到)
					(3) emit: 触发自定义事件的函数, 相当于vue2 this.$emit
						a、子组件声明绑定在自身的自定义事件(vue3新增)
							添加 emits 配置项(不写也可以正常使用，但会有警告)
							emits: ['自定义事件名1', ……],
						b、触发自定义事件
							context.emit('自定义事件名',value数据)

			7. 注意点：
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
	import Demo from './components/Demo.vue'

	export default {
		name: "App",
		components: { Demo },
		data() {
			return {
				sex: "男",
				// 重名属性优先 setup 中属性
				name: "我叛逆期到了"
			};
		},
		methods: {
			sayWelcome() {
				alert("我还活着 嘿嘿");
				// Vue2 配置(data、methos、computed...)中 可以访问到 setup 中的属性、方法
				console.log(this.sex, this.name, this.age, this.sayHello);
			}
		},
		// 此处只是测试一下 setup，暂时不考虑响应式的问题
		setup(props, context) {
			// 数据
			let name = "小鹿";
			let age = 80;
			// 方法
			function sayHello() {
				alert(`hello ${age} 岁的 ${name}`);
				// 在 setup 中 不能访问到 Vue2.x配置 (data、methos、computed...)
				console.log(this.sex, this.sayWelcome, this.name, this.age);
			}
			function showHelloMsg(value){
				alert('收到参数:'+ value)
			}

			// 返回一个对象
			return {
				name,
				age,
				sayHello,
				showHelloMsg
			};
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