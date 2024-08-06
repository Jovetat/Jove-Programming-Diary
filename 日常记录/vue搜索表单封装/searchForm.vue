<template>
  <searchForm
    v-model="formData"
    :formOptions="formOptions"
    :queryCallback="queryCallback"
    :resetCallback="resetCallback"
  >
    <template #otherInfo="{ formData, item }">
      {{ formData.cardCatalogName }}
    </template>
    <template #timeRange>
      <timeRange ref="timeRangeRef" :change="timeChange" />
    </template>
  </searchForm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import searchForm from '@/components/Form/searchForm.vue'
import { FormOption } from '@/components/Form/types'
import { cardType } from './options'
import timeRange from '@/components/Form/timeRange.vue'

export default defineComponent({
  components: { searchForm, timeRange },
  setup() {
    const formData = ref()
    const formOptions: FormOption[] = [
      {
        label: '会员卡名称',
        type: 'Input',
        dataIndex: 'cardCatalogName',
        comProps: { autocomplete: 'off', allowClear: true, maxlength: 20 },
        span: 7,
      },
      {
        label: '会员卡类别',
        type: 'CheckboxGroup',
        dataIndex: 'cardTypes',
        comProps: { options: cardType },
        span: 13,
      },
      {
        type: 'Slot',
        dataIndex: 'otherInfo',
        span: 6,
      },
    ]
    const timeRangeRef = ref<any>(null)

    const queryCallback = (res: object) => {
      console.log(res)
    }
    const resetCallback = () => {
      timeRangeRef.value.reset()
    }

    return { formData, formOptions, timeRangeRef, queryCallback, resetCallback }
  },
})
</script>
