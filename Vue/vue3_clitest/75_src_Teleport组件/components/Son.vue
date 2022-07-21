<template>
    <div class="son">
        <h3>Son组件</h3>
		<Dialog/>
    </div>
</template>

<script>
	/* 
		Teleport 组件
			详细请看 Dialog.vue 文件
	*/

	import Dialog from './Dialog.vue'

	export default {
		name: 'Son',
		components: {Dialog}
	}

</script>

<style>
	.son{
		background-color: #a1c2dd;
		padding: 10px;
	}
</style>