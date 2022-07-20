<template>
	<h4>{{person}}</h4>
	<h2>姓名：{{name}}，年龄：{{age}}，薪资{{job.j1.salary}}k</h2>
	<button @click="name+='!'">修改性名</button>
	<button @click="age++">age++</button>
	<button @click="job.j1.salary++">加薪</button>
</template>

<script>
	/* 
		toRef & toRefs 函数

			1. 作用
				创建一个 ref 对象，其 value 值指向另一个对象中的某个属性
			2. 使用方式
				const name = toRef( 对象obj , 'obj的属性名' )
			3. 应用
				将响应式对象中的某个属性单独提供给外部使用
			4. toRefs 扩展
				...toRefs( 对象obj )
				(1) toRefs 与 toRef 功能一致，但可以将对象中 第一层 所有属性都创建对应同名的 ref代理对象 然后放入一个总对象
				(2) 通过 ... 将总对象中的属性挨个都 return 出去
			5. 理解
				(1) 通过 toRef/toRefs() 的方式，将对象的属性数据作为 ref对象 代理出去，便于读写
				(2) 不使用 ref() 直接创建的原因，ref 生成的对象后续修改时，源数据不会更改，无法做到数据代理
					(ref() 拿到值 返回响应式 ref对象后，与源数据就无关了，而 toRef 是将对象属性数据代理给 ref代理对象了)
					[通过 getter 和 setter 代理了源对象属性数据]

	*/

	import {reactive, toRef, toRefs} from 'vue'

	export default {
		name: 'App',
		setup() {
			// 数据
			let person = reactive({
				name: 'shy',
				age: 23,
				job: {
					j1: {
						salary: 20
					}
				}
			})

			// 返回一个对象
			return {
				person,
				// 通过 toRef 实现
				/* name: toRef(person,'name'),
				age: toRef(person,'age'),
				salary: toRef(person.job.j1,'salary') */
				// 通过 toRefs 实现
				...toRefs(person)
			}
		}
	}

</script>