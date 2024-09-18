<template>
  <view class="form">
    <nut-form
      ref="formRef"
      v-bind="props.formProps"
      :model="formData"
      style="width: 100%"
    >
      <nut-row>
        <nut-col
          v-for="(item, index) in props.formOptions"
          :key="index"
          :span="item.span"
        >
          <slot
            v-if="item.type === 'Slot'"
            :name="item.dataIndex"
            :formData="formData"
            :item="item"
          ></slot>
          <nut-form-item v-else :prop="item.dataIndex">
            <view class="displayFlex item-block">
              <view class="blackColor item-lable">{{ item.label }}:</view>
              <view
                :style="{ ...item.style }"
                class="item"
                :class="[
                  item.type === 'Input' ? 'nutinput-min greenBorder' : '',
                ]"
              >
                <formItem
                  :type="item.type"
                  :comProps="item.comProps"
                  v-model="formData[item.dataIndex]"
                />
              </view>
            </view>
          </nut-form-item>
        </nut-col>
      </nut-row>
    </nut-form>
  </view>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import type { FormOption } from './types'
import formItem from './formItem.vue'

export default defineComponent({
  props: {
    formProps: {
      type: Object,
      default: {},
    }, // 透传表单属性,包括 rules
    modelValue: {
      type: Object as () => any,
      required: true,
    }, // 双向绑定表单数据, 通过 v-model="" 传递
    formOptions: {
      type: Array<FormOption>,
      required: true,
    }, // form 选项

    /* 插槽
      formOptions type 为 Slot 时为具名插槽，携带 modelValue 和 item
    */
  },
  components: { formItem },
  setup(props, { emit }) {
    const formRef = ref<any>(null)
    const formData = computed(() => props.modelValue)

    const updataValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }
    const reset = () => {
      updataValue()
      formRef.value.reset()
    }
    // 外部调用此方法提交表单
    const submit = (callback: Function) => {
      formRef.value.validate().then(({ valid, errors }: any) => {
        const data = {
          ...formData.value,
        }
        callback && callback(valid, data)
      })
    }

    return { props, formData, formRef, reset, submit }
  },
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  background-color: white;
  box-sizing: border-box;
  .item {
    display: block;
    width: 100%;
  }
  .item-lable {
    font-size: 16px;
    margin-right: 15px;
    white-space: nowrap;
  }
  .item-block {
    height: 40px;
  }
}
</style>
