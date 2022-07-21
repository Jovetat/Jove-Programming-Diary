<template>
    <div class="child">
        <h3>Child组件</h3>
        <Son/>
    </div>
</template>

<script>
	/* 
		Teleport 组件
			详细请看 Dialog.vue 文件
	*/

    import Son from './Son.vue'

	export default {
		name: 'Child',
        components: {Son}
	}

</script>

<style>
	.child{
		background-color: #e6a4a4;
		padding: 10px;
	}
</style>