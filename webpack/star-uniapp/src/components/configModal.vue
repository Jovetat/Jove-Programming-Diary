<template>
  <popupPlus :isShow="isShow" :popupStyle="popupStyle">
    <view v-if="props.title" class="header">{{ props.title }}</view>
    <view class="content"><slot></slot></view>
    <view class="bottom">
      <view class="btn-view">
        <nut-button type="default" @click="cancel">取消</nut-button>
        <nut-button type="primary" @click="confirm">确认</nut-button>
      </view>
    </view>
  </popupPlus>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import popupPlus from '@/components/popup-plus.vue'

const popupStyle = {
  width: '80%',
}

export default defineComponent({
  props: {
    title: {
      type: String,
    },
    // 内容已插槽的形式展现
    confirmCallback: {
      type: Function,
    },
    cancelCallback: {
      type: Function,
    },
  },
  components: {
    popupPlus,
  },
  setup(props) {
    const isShow = ref<boolean>(false)
    // 向外暴露弹出确认框的方法
    const openPop = (msg: string) => {
      isShow.value = true
    }
    const closeModel = () => {
      isShow.value = false
    }
    const cancel = () => {
      closeModel()
      props.cancelCallback && props.cancelCallback()
    }
    const confirm = () => {
      closeModel()
      props.confirmCallback && props.confirmCallback()
    }

    return {
      props,
      isShow,
      popupStyle,
      openPop,
      cancel,
      confirm,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  padding-top: 20px;
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.content {
  padding: 25px 20px;
  text-align: center;
}
.bottom {
  width: 100%;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  .btn-view {
    display: flex;
    width: 80%;
    justify-content: space-around;
  }
}
</style>
