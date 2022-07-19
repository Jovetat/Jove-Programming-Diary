<template>
	姓:<input type="text" v-model="person.firstname"/><br><br>
	名:<input type="text" v-model="person.lastname"/>
	<h2>全名:{{person.fullName}}</h2>
	全名:<input type="text" v-model="person.fullName"/>
</template>

<script>
	/* 
		computed 计算属性

			1. 与 Vue2 中 computed配置 功能一致，在 vue3 中为一个 组合式的API

			2. 使用方式
				0) 引入 computed
					import {computed} from 'vue'
				1) 定义计算属性
					setup(){
						(1) 完整版
							let 计算属性名 = computed({
								get(){
									return ...
								},
								set(value){
									...
								}
							})

						(2) 简写
							let 计算属性名 = computed(()=>{
								return ...
							})
					}

				3) 可以直接将计算属性添加到 proxy对象身上
					proxy对象.计算属性名 = computed( ()=>{} )
			
			3. computed() 返回一个 ComputedRefImpl 实例对象，仍依靠 Object.defineProperty() 实现

	*/

	// 引入 computed
	import {computed, reactive} from 'vue'

	export default {
		name: 'App',
		setup() {
			// 数据
			let person = reactive({
				firstname: '玺',
				lastname: '羊羊'
			})
			// 计算属性完整写法，并且直接添加到 person 上
			person.fullName = computed({
				get(){
					return person.firstname + '-' + person.lastname
				},
				set(value){
					const nameArr = value.split('-')
					person.firstname = nameArr[0]
					person.lastname = nameArr[1]
				}
			})
			// 计算属性简写
			let fullName = computed(()=>{
				return person.firstname + '-' + person.lastname
			})
			console.log(fullName)

			// 返回一个对象
			return {
				person,
				fullName
			}
		}
	}

</script>