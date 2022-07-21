<template>
	<div class="app">
		<h3>App组件</h3>
		<Child/>
	</div>
	<!-- TODO: 做一个弹窗 -->
</template>

<script>
	/* 
		Teleport 组件
			详细请看 Dialog.vue 文件
	*/

	import Child from './components/Child'

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