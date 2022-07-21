<template>
	<!-- TODO: 实现输入框中内容延时更新显示 -->
	<input type="text" v-model="keyword">
	<h1>{{keyword}}</h1>
</template>

<script>
	/* 
		customRef 自定义ref

			1. 作用
				创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制
			
			2. 使用方式
				1) 自定义 ref

					function 自定义ref函数名(value, ……){
						(1) value 为形参接收的初始值
						(2) 还可以传入其他参数使用
						return customRef( (track,trigger)=>{
							(1) track	--> 使 Vue 追踪 getter 返回值数据的变化
							(2) trigger --> 使 Vue 重新解析模板的函数
							return {
								get(){
									(1) 当自定义ref函数生成的数据被 读取 时调用 getter 并返回值
									(2) 通知 Vue 追踪 return返回数据的变化
									track()
									return value
								},
								set(newValue){
									(1) 当自定义ref函数生成的数据被 修改 时调用 setter
									(2) getter 始终返回 value形参接收的初始值，为使更改数据有效所以修改 value
									value = newValue
									(3) 通知 Vue 重新解析模板
									trigger()
								}
							}
							(3) getter/setter 内需要的地方添加业务逻辑，此处只完成了 ref 的基本功能
						})
					}

				2) 生成自定义ref对象
					let refObj = 自定义ref函数( value值 )

	*/

	import { customRef, ref } from 'vue'

	export default {
		name: 'App',
		setup() {
			
			// 使用 ref
			// let keyword = ref('早上好')
			// 使用自定义 ref --> customRef
			let keyword = myRef('早上好',1500)

			// 自定义一个 ref
			function myRef(value,delay){
				let timer
				//通过 customRef 去实现自定义
				return customRef((track,trigger)=>{
					return{
						get(){
							console.log(`从 myRef 容器中读取数据${value}`)
							// 通知 Vue 这个 value 值是需要被 “追踪” 的
							track() 
							return value
						},
						set(newValue){
							console.log(`从 myRef 容器中修改数据为${newValue}`)
							// 防止多定时器导致混乱（防抖）
							clearTimeout(timer)
							timer = setTimeout(()=>{
								value = newValue
								// 这里输入框内容变化是因为输入，双向绑定但数据没有变回来是因为没有触发页面更新
								// (触发页面更新后显示和数据就同步了，这里因为还没有 trigger 所以页面与数据不会同步)
								// 通知 Vue 去更新界面
								trigger()
							},delay)
						}
					}
				})
			}

			return {
				keyword
			}
		}
	}

</script>