<template>

</template>

<script>
	/* 
		响应式数据的判断

			1. isRef( obj )
				检查一个值是否为一个 ref 对象
			1. isReactive( obj )
				检查一个对象是否是由 reactive 创建的响应式代理
			1. isReadonly( obj )
				检查一个对象是否是由 readonly 创建的只读代理
			1. isProxy( obj )
				检查一个对象是否为 proxy对象(由 reactive 或者 readonly 方法创建的代理)

	*/

	import { isProxy, isReactive, isReadonly, isRef, reactive, readonly, ref } from 'vue'

	export default {
		name: 'App',
		setup() {
			
			let car = reactive({ name:'雷克萨斯', price: '40w' })
			let sum = ref(0)
			let car2 = readonly(car)
			
			console.log('sum isRef:',isRef(sum))
			console.log('car isReactive:',isReactive(car))
			console.log('car2 isReadonly:',isReadonly(car2))
			console.log('car isProxy:',isProxy(car))
			// readonly 返回值仍然为 proxy对象
			console.log('car2 isProxy:',isProxy(car2))

			return {
				
			}
		}
	}

</script>