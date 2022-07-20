<template>
	<h2>姓名：{{name}}，年龄：{{age}}，薪资{{job.j1.salary}}k</h2>
	<h2 v-if="person.car">车：{{person.car}}</h2>
	<button @click="name+='!'">修改性名</button>
	<button @click="age++">age++</button>
	<button @click="job.j1.salary++">加薪</button>
	<button @click="showRawPerson">输出原始的person</button>
	<button @click="addCar">买车</button>
	<button @click="person.car.name += '!'">改车标</button>
	<button @click="changePrice">涨价</button>
</template>

<script>
	/* 
		toRaw 与 markRaw

			1. toRaw()：
				1) 简介
					const obj = toRaw( proxy对象 )
					(1) 将一个由 reactive 生成的 响应式对象 拷贝为 普通对象并返回，不改变源数据
					(2) 原来的响应式不会发生改变，输入 ref对象 无效，返回 undefined
				2) 作用
					用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新

			2. markRaw：
				1) 简介
					markRaw( obj )
					标记一个对象，使其永远不会成为响应式对象
				2) 作用
					(1) 向响应式对象添加非响应式属性时，先用 markRaw 标记属性，然后再向响应式对象追加
						(向响应式对象添加属性时自动就会转为响应式，所以需要通过这种方式添加非响应式数据)
					(2) 有些属性追加不应被设置为响应式的，例如复杂的第三方类库等
					(3) 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能

	*/

	import { reactive, toRefs, toRaw, markRaw } from 'vue'

	export default {
		name: 'App',
		setup() {
			
			let person = reactive({
				name: 'shy',
				age: 23,
				job: {
					j1: {
						salary: 20
					}
				}
			})

			function showRawPerson(){
				const p = toRaw(person)
				console.log(p)
			}
			function addCar(){
				let car = {name: 'mx5', price: 40}
				// 后添加的属性自动就是响应式的
				// person.car = car
				// 后添加非响应式的数据
				person.car = markRaw(car)
			}
			function changePrice(){
				person.car.price++
				console.log('price:',person.car.price)
			}

			return {
				person,
				...toRefs(person),
				showRawPerson,
				addCar,
				changePrice
			}
		}
	}

</script>