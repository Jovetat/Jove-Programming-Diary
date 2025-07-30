<template>
  <nut-uploader
    url="http://10.0.192.29:49181/agent-proxy-server/api/system/new-user/file-upload"
    v-bind="comAttrs"
    v-model:file-list="fileList"
    :headers="uploadHeaders"
    maximum="1"
    @success="onUploadSuccess"
    @delete="onDelete"
  ></nut-uploader>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useAttrs } from 'vue'

/*
  imageUploader 组件 仅支持1张图片上传
  - v-model 绑定当前选中值
  - 自动配置上传地址和请求头
  - 支持图片显示和上传成功后的URL赋值
  - 每个组件实例独立管理文件列表
*/
export default defineComponent({
  name: 'imageUploader',
  props: {
    modelValue: {
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const fileList = ref<any[]>([])

    // 上传请求头配置
    const uploadHeaders = computed(() => ({
      Authorization: uni.getStorageSync('sessionId'),
    }))

    // 监听modelValue变化，显示已有图片
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue) {
          // 如果modelValue有值，转换为nut-uploader需要的格式
          fileList.value = [
            {
              url: newValue,
              status: 'success',
              message: '上传成功',
              type: 'image',
            },
          ]
        } else {
          fileList.value = []
        }
      },
      { immediate: true },
    )

    // 上传成功回调
    const onUploadSuccess = (response: any) => {
      const { responseText } = response

      if (responseText && responseText.statusCode === 200) {
        const data = JSON.parse(responseText.data)
        const imageUrl = data.data
        // 更新modelValue
        emit('update:modelValue', imageUrl)
      } else {
        emit('update:modelValue', '')
        uni.showToast({
          title: '图片上传失败',
          icon: 'none',
        })
      }
    }

    // 删除图片回调
    const onDelete = (val: { file: any; fileList: any[]; index: number }) => {
      // 清空modelValue
      emit('update:modelValue', '')
    }

    const attrs = useAttrs()
    const comAttrs = computed(() => {
      const { modelValue, options, ...restAttrs } = attrs
      return restAttrs
    })

    return {
      fileList,
      comAttrs,
      uploadHeaders,
      onUploadSuccess,
      onDelete,
    }
  },
})
</script>

<style lang="scss" scoped></style>
