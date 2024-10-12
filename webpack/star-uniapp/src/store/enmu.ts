import { defineStore } from 'pinia'

interface enumStateType {
  globalEnums: any
  [key: string]: any
}

export const enumStore = defineStore('enum', {
  state: (): enumStateType => ({
    globalEnums: uni.getStorageSync('globalEnums'),
  }),
  actions: {
    setEnum(data: any) {
      this.globalEnums = data
      uni.setStorage({
        key: 'globalEnums',
        data,
      })
    },
    getEnum(key: string) {
      if (this.globalEnums?.[key]) {
        return this.globalEnums[key]
      }
      const locationEnum = uni.getStorageSync('globalEnums')
      return locationEnum?.[key]
    },
    clearEnumState() {
      this.$reset()
    },
  },
})
