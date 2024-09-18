<template>
  <view class="table">
    <n-table
      :columns="props.columns"
      :list="props.list"
      :clickRow="props.clickRow"
      :lastBgGrey="props.lastBgGrey"
      selection="none"
      v-bind="tableAttrs"
    ></n-table>
  </view>
</template>

<script lang="ts">
import { defineComponent, useAttrs, computed } from 'vue'
import nTable from './no-bad-table/table.vue'

export default defineComponent({
  components: {
    nTable,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
    clickRow: {
      type: Function,
      default: () => {},
    },
    lastBgGrey: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const attrs = useAttrs()
    const tableAttrs = computed(() => {
      const { columns, list, clickRow, lastBgGrey, ...restAttrs } = attrs
      return restAttrs
    })
    return {
      props,
      tableAttrs,
    }
  },
})
</script>

<style lang="scss" scoped>
.table {
  max-width: 100%;
  display: inline-block;
  overflow-x: scroll;
  box-sizing: border-box;
  border: 2px rgb(142, 142, 142) solid;
  border-bottom: none;
}
</style>
