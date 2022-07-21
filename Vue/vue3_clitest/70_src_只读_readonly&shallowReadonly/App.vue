<template>
	<h2>姓名：{{name}}，年龄：{{age}}，薪资{{job.j1.salary}}k</h2>
	<button @click="name+='!'">修改性名</button>
	<button @click="age++">age++</button>
	<button @click="job.j1.salary++">加薪</button><hr>
	<h4>sum：{{sum}}</h4>
	<button @click="sum++">sum++</button>
</template>

<script>
	/* 
		数据只读：readonly & shallowReadonly
		
			1. readonly
				让一个响应式数据变为只读的 (深只读)
				(返回的仍然为 proxy对象)
			2. shallowReadonly
				让一个响应式数据变为只读的 (浅只读)
				(仅将第一层的数据改为只读的)
			3. 应用场景: 不希望数据被修改时

	*/

	import { ref, reactive, toRefs, shallowReadonly, readonly } from 'vue'

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
			// 修改响应式数据为只读
			// person = readonly(person)
			person = shallowReadonly(person)
			let sum = ref(0)
			sum = readonly(sum)
			// sum = shallowReadonly(sum)		// 可以这样写但没必要


			return {
				...toRefs(person),
				sum,
			}
		}
	}

</script>