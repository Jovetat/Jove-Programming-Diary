<template>
  <nut-form
    ref="ruleFormRef"
    :model-value="formData"
    :rules="{
      phone: [
        { required: true, message: props.message },
        { validator: checkPhone, message: '手机号格式不正确' },
      ],
    }"
  >
    <nut-form-item prop="phone">
      <view class="displayFlex">
        <view class="input-view nutinput greenBorder">
          <nut-input
            v-model="formData.phone"
            type="number"
            input-mode="tel"
            max-length="11"
            :clearable="true"
            confirm-type="next"
            :placeholder="props.message"
            cursor-spacing="30"
          />
        </view>
        <slot></slot>
      </view>
    </nut-form-item>
  </nut-form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { checkPhone } from '@/utils'

export default defineComponent({
  props: {
    message: {
      type: String,
      default: '请输入手机号',
    },
  },
  setup(props) {
    const ruleFormRef = ref<any>(null)
    const formData = reactive({
      phone: '',
    })

    // 外部调用此方法校验表单并获取表单数据
    const submit = (callback: Function) => {
      ruleFormRef.value.validate().then(({ valid, errors }: any) => {
        callback && callback(valid, formData.phone)
      })
    }
    // 外部调用此方法设置表单数据
    const setPhone = (phone: string) => {
      formData.phone = phone
    }
    // 外部调用此方法表单验证
    const validateReset = () => {
      ruleFormRef.value.validate()
    }

    return {
      props,
      ruleFormRef,
      formData,
      submit,
      setPhone,
      checkPhone,
      validateReset,
    }
  },
})
</script>

<style lang="scss" scoped>
.input-view {
  flex: 1;
}
</style>
