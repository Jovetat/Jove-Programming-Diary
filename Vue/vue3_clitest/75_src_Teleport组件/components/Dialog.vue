<template>
    <div>
        <button @click="isShow = true">点我弹窗</button>
        <teleport to='body'>
            <div class="mask" v-if="isShow">
                <div class="dialog">
                    <h3>完结撒花</h3>
                    <h4>*★,°*:.☆(￣▽￣)/$:*.°★* 。</h4>
                    <button @click="isShow = false">关闭弹窗</button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
	/* 
        Teleport 组件

            1.定义
                Teleport 能将 组件html结构 移动到指定位置

            2. 使用方式
                <teleport to="移动位置">
                    (1) 移动位置可选：body、#某容器id
                    任意 html 结构
                </teleport>
    */

    import { ref } from 'vue'

	export default {
		name: 'Dialog',
        setup() {
            let isShow = ref(false)
            return { isShow }
        }
	}

</script>

<style>
    .mask{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.418);
    }
	.dialog{
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 300px;
        height: 160px;
        padding: 20px;
		background-color: #70417e;
		padding: 10px;
        color: azure;
	}
</style>