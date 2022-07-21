<template>
    <div class="child">
        <h3>Child组件</h3>
		<h3>sum: {{sum}}</h3>
    </div>
</template>

<script>
	/* 
		Suspense 组件
			详细请看 App.vue 文件
	*/

	import { ref } from 'vue'
	export default {
		name: 'Child',
		async setup() {
			let sum = ref(0)
			let p = new Promise((resolve,reject)=>{
				setTimeout(()=>{
					resolve({sum})
				},1500)
			})
			return await p
		}
	}

</script>

<style>
	.child{
		background-color: #e6a4a4;
		padding: 10px;
	}
</style>