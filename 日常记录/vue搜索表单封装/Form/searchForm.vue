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
            <template v-if="item.type !== 'Slot'">
              <a-form-item :label="item.label" :name="item.dataIndex">
                <view :style="{ ...item.style }" class="item">
                  <formItem
                    :type="item.type"
                    :comProps="item.comProps"
                    v-model="formData[item.dataIndex]"
                  />
                </view>
              </a-form-item>
            </template>
            <template v-else>
              <slot
                :name="item.dataIndex"
                :formData="formData"
                :item="item"
              ></slot>
            </template>
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
import { defineComponent, PropType, computed } from 'vue'
import { FormOption } from './types'
import formItem from './formItem.vue'

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
      formOptions type 为 Slot 时为具名插槽，携带 modelValue 和 item
    */
  },
  components: { formItem },
  setup(props, { emit }) {
    const formData = computed(() => props.modelValue)

    const updataValue = (data?: any) => {
      emit('update:modelValue', data || {})
    }
    const query = () => {
      props.queryCallback && props.queryCallback(formData.value)
    }
    const reset = () => {
      updataValue()
      props.resetCallback && props.resetCallback(query)
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
  padding: 15px 15px 0 15px;
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
  .item {
    display: block;
    width: 100%;
  }
}
</style>
