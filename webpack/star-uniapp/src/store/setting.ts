import { defineStore } from 'pinia'

interface initStateType {
  dataMenuList: Array<any>
  selectedMenuId: number
  selectedMenuName: string
}

export const settingStore = defineStore('setting', {
  state: (): initStateType => ({
    dataMenuList: [],
    selectedMenuId: 1,
    selectedMenuName: '新增会员',
  }),
  actions: {
    async setSelectMenuId(value: number) {
      this.selectedMenuId = value
    },
    clearSettingState() {
      this.$reset()
    },
  },
})
