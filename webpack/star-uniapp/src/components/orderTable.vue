<template>
  <view class="page">
    <nut-row v-if="props.isHeader">
      <nut-col
        v-for="(item, index) in props.columns"
        :key="index"
        :span="item.span"
      >
        <text :style="item?.stylehead ? item.stylehead : ''" class="ellipsis">
          {{ item.title }}
        </text>
      </nut-col>
    </nut-row>
    <view class="line"><nut-divider dashed /></view>
    <view class="content">
      <nut-row v-for="dataItem in props.data" :key="dataItem.id">
        <nut-col
          v-for="(item, index) in props.columns"
          :key="index"
          :span="item.span"
        >
          <view :style="`height: ${props.colHeight}px;`" class="cell">
            <!-- <view class="cell"> -->
            <text
              :style="item?.stylecolumn ? item.stylecolumn : ''"
              class="ellipsis"
            >
              {{
                item.formattor
                  ? item.formattor(dataItem)
                  : item.key
                    ? dataItem[item.key] ?? ''
                    : ''
              }}
            </text>
            <text
              v-if="item.notes"
              :style="item?.styleNotes ? item.styleNotes : ''"
              class="notes ellipsis"
            >
              {{ item.notes(dataItem) }}
            </text>
          </view>
        </nut-col>
      </nut-row>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
interface Row {
  title?: string // 表格头，不显示表头时可不选
  key?: string | undefined // 数据索引，传入formattor可不传
  span: number // 宽度，共 24
  formattor?: Function // 处理数据
  notes?: Function // 小字备注
  stylehead?: string
  stylecolumn?: string
  styleNotes?: string
}
interface DataItem {
  [key: string]: any
}
export default defineComponent({
  props: {
    columns: {
      type: Array<Row>,
      required: true,
    }, // 表格配置
    data: {
      type: Array<DataItem>,
      required: true,
    }, // 表格数据
    isHeader: {
      type: Boolean,
      default: false,
    }, // 是否显示表头
    colHeight: { type: [Number, String], default: 40 }, // 行高度
  },
  setup(props) {
    return { props }
  },
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
}

.line {
  padding: 7px 0 4px 0;
}

.cell {
  display: flex;
  flex-direction: column;

  .notes {
    font-size: 12px;
    color: #858585;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>
