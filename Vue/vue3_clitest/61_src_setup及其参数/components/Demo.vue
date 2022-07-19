<template>
    <button @click="sendMsg">向父组件发送数据</button>
    <slot></slot>
</template>

<script>

	export default {
		name: 'Demo',
        beforeCreate() {
            console.log('----beforeCreate----')
        },
        props: ['name','msg'],
        emits: ['hello'],
		setup(props,context) {
            // setup 在 beforeCreate 之前执行
            console.log('----setup----')
            console.log(this)                   // undefined
            console.log('props',props,'context',context)

            // 方法
            function sendMsg(){
                context.emit('hello','我要说声抱歉')
            }

			return {
                sendMsg
			}
		}
	}
</script>