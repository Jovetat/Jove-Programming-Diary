<template>
	<div class="app">
		<h3>App组件</h3>
		<Suspense>
			<template v-slot:default>
				<Child/>
			</template>
			<template v-slot:fallback>
				<h3>加载中.....</h3>
			</template>
		</Suspense>
	</div>
</template>

<script>
	/* 
		Suspense 组件

			1. 作用
				等待异步组件时渲染一些额外内容，让应用有更好的用户体验
					(1) 静态引入其他内容会等待引入内容再向后面执行，而异步引入边引入边执行后文
					(2) Suspense 底层通过插槽实现
					(3) 目前处于试验阶段
						<Suspense> is an experimental feature and its API will likely change
					(4) 可以和 promise + 异步引入 配合使用

			2. 使用
				1) 异步引入组件
					import { defineAsyncComponent } from 'vue'
					const Child = defineAsyncComponent( ()=> import('./components/Child.vue') )

				2) 使用 Suspense 包裹组件，并配置好 default 与 fallback
					<Suspense>
						<template v-slot:default>
							(1) 异步加载完毕显示的内容
							<Child/>
						</template>
						<template v-slot:fallback>
							(2) 异步加载组件时显示的内容
							<h3>加载中.....</h3>
						</template>
					</Suspense>

	*/

	// 静态引入
	// import Child from './components/Child'

	// 异步引入(这里可以调慢浏览器网速看出差别 fast 3G)
	import { defineAsyncComponent } from 'vue'
	const Child  = defineAsyncComponent(()=>import('./components/Child.vue'))

	export default {
		name: 'App',
		components: {Child}
	}

</script>

<style>
	.app{
		background-color: rgb(241, 235, 218);
		padding: 10px;
	}
</style>