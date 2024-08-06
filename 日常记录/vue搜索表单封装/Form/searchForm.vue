<template>
  <view class="form">
    <view class="left">
      <a-form v-bind="props.formProps" :model="formData">
        <a-row>
          <a-col
            v-for="(item, index) in props.formOptions"
            :key="index"
            :span="item.span"
          >
            <a-form-item :label="item.label" :name="item.dataIndex">
              <view :style="{ ...item.style }">
                <template v-if="item.type !== 'Slot'">
                  <formItem
                    :type="item.type"
                    :comProps="item.comProps"
                    v-model="formData[item.dataIndex]"
                  />
                </template>
                <template v-else>
                  <slot
                    :name="item.dataIndex"
                    :formData="formData"
                    :item="item"
                  ></slot>
                </template>
              </view>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </view>
    <view class="right">
      <view class="btn-view">
        <a-button v-if="props.queryCallback" type="primary" @click="query">
          搜索
        </a-button>
        <a-button v-if="props.resetCallback" @click="reset" class="cancel-btn">
          重置
        </a-button>
      </view>
      <slot name="underRight"></slot>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue'
import { FormOption } from './types'
import formItem from './formItem.vue'
import CityCascader from '@/components/CityCascader/index.vue'

export default defineComponent({
  props: {
    formProps: {
      type: Object,
      default: {},
    }, // 透传表单属性
    modelValue: {
      type: Object as () => any,
      required: true,
    }, // 双向绑定表单数据, 通过 v-model="" 传递
    formOptions: {
      type: Array as PropType<FormOption[]>,
      required: true,
    }, // form 选项
    queryCallback: {
      type: Function,
    },
    resetCallback: {
      type: Function,
    },
    /* 插槽
      underRight 为按钮下方插槽
      formOptions type 为 Slot 时为具名插槽，携带 formData 和 item
    */
  },
  components: { formItem, CityCascader },
  setup(props, { emit }) {
    const formData = ref({ ...props.modelValue })
    const isOutsideChange = ref<boolean>(false)
    // 双向绑定
    watch(
      formData,
      (newData) => {
        if (isOutsideChange.value) {
          return (isOutsideChange.value = false)
        }
        updataValue(newData)
      },
      { deep: true },
    )
    watch(
      () => props.modelValue,
      (newVal) => {
        formData.value = newVal
        isOutsideChange.value = true
      },
    )
    const updataValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }
    const query = () => {
      props.queryCallback && props.queryCallback(formData.value)
    }
    const reset = () => {
      updataValue()
      props.resetCallback && props.resetCallback()
    }

    return { props, formData, query, reset }
  },
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  width: 100%;
  background-color: white;
  padding: 15px;
  box-sizing: border-box;
  .left {
    display: block;
    width: calc(100% - 160px);
  }
  .right {
    display: block;
    width: 160px;
    .btn-view {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
