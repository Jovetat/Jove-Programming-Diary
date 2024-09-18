<template>
  <BossTable
    :columns="columns"
    :list="dataList"
    :clickRow="tapRow"
    @memberEdit="(item) => tapRow(item.row)"
  ></BossTable>
</template>

<script setup>
import { ref } from 'vue'
import BossTable from '@/components/bossTable.vue'

const dataList = ref([])
const columns = [
  {
    title: '序号',
    formate: (res, index, item) => {
      return (searchValue.value.current - 1) * 10 + index + 1
    },
    $width: '80px',
  },
  { key: 'code', title: '员工号', $width: '90px' },
  {
    key: 'headImageUrl',
    title: '员工头像',
    type: 'photo',
    $width: '100px',
  },
  { key: 'name', title: '员工姓名', $width: '140px' },
  { key: 'sexText', title: '性别', $width: '80px' },
  { key: 'telePhone', title: '联系电话', $width: '180px' },
  // {  key: 'userTypeText', title: '员工类型' },
  { key: 'roleTypeText', title: '账号权限', $width: '160px' },
  { key: 'statusText', title: '状态', $width: '80px' },
  { key: 'createTime', title: '创建时间', $width: '130px' },
  {
    key: '$operate',
    title: '操作',
    $fixed: 'right',
    $operateList: [
      {
        label: '编辑',
        event: 'memberEdit',
        id: 'memberEdit',
        styles: 'iconPrimaryGreen',
      },
    ],
    $width: '110px',
  },
]

const tapRow = (item) => {}
</script>
