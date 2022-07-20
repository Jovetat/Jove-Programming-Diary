<template>
	<!-- TODO：鼠标点击页面时获取到鼠标的坐标 -->
	<h1>X:{{point.x}} Y:{{point.y}}</h1>
</template>

<script>
	/* 
		自定义 hook 函数
			1. 定义
				本质是一个函数，可以把 setup 函数中使用的 Composition API 进行了封装
				(将逻辑封装在一个外部 js 文件的函数中，然后在 setup 内调用)
				(体现了 Vue3 中组合的概念)

			2. 类似于 vue2 中的 mixin

			3. 自定义 hook 的优势
				复用代码, 让 setup 中的逻辑更清楚易懂
			
			4. hook 使用
				(1) 创建 hooks 文件夹
				(2) hooks 内创建对应 js 文件 (hook 文件通常时以 use 开头[eg:useName.js])
				(3) 将同一业务逻辑代码全部放入一个函数中，并暴露该函数
					export default function(){
						data、function、组件式生命周期、……
						return ...
					}
				(4) 在组件中引入 hook，最好引入的名称以 use开头 (约定俗成，便于分辨 hook)
					import usePoint from './hooks/usePoint'
				(5) 组件 setup() 中调用 hook 中暴露的函数并接收返回值
					let point = usePoint()

	*/

	import usePoint from './hooks/usePoint.js'

	export default {
		name: 'App',
		setup() {
			let point = usePoint()
			return {
				point
			}
		}
	}

</script>