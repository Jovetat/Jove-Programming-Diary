<template>
  <view class="page">
    <view class="content">
      <view class="form">
        <every-form
          ref="everyFormRef"
          v-model="formData"
          :formOptions="formOptions"
          :formProps="formProps"
        />
      </view>
      <view class="btn-view">
        <nut-button
          type="primary"
          class="btn"
          :loading="loginLoading"
          @click.stop="loginCheck"
        >
          登录
        </nut-button>
      </view>
    </view>
    <view class="bottom">
      <text>版本号:</text>
      <text style="margin-left: 5px">{{ systemInfo.appVersion }}</text>
    </view>
  </view>
  <wrap-version-update
    v-if="systemInfo.appVersion && update && !isDev"
    :id="update"
    :apiUrl="versionUrl"
    :version="systemInfo.appVersion"
  ></wrap-version-update>
</template>
<script lang="ts" setup>
import WrapVersionUpdate from '@/uni_modules/wrap-version-update/components/wrap-version-update/wrap-version-update.nvue'
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { update, versionUrl } from '@/utils/config'
import everyForm from '@/components/every-form/index.vue'
import type { FormOption } from '@/components/every-form/types'

const formOptions: FormOption[] = [
  {
    type: 'Input',
    dataIndex: 'code',
    comProps: {
      clearable: true,
      type: 'text',
      maxLength: 15,
      placeholder: '请输入账号',
    },
    span: 24,
  },
  {
    type: 'Input',
    dataIndex: 'password',
    comProps: {
      clearable: true,
      maxLength: 20,
      type: 'password',
      placeholder: '请输入密码',
    },
    span: 24,
  },
]
const rules = {
  code: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
}
const formProps = { rules }
const everyFormRef = ref<any>(null)
const systemInfo = ref<any>(null)
const isDev = ref<boolean>(false)
const loginLoading = ref<boolean>(false)
const formData = ref<any>({
  code: '',
  password: '',
})

onShow(() => {
  uni.getSystemInfo({
    success: function (res) {
      systemInfo.value = {
        appVersion: res?.appWgtVersion || res.appVersion,
      }
    },
  })
})

const loginCheck = () => {
  everyFormRef.value.submit((valid: boolean, data: any) => {
    if (valid) {
      login()
    }
  })
}
const login = async () => {
  loginLoading.value = true
  uni.navigateTo({
    url: '/pages/home/home',
  })
  loginLoading.value = false
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  width: 100vw;
}
.content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .form {
    width: 80%;
    margin-top: 10vh;
    display: flex;
    justify-content: center;
  }
  .btn-view {
    margin-top: 10px;
    .btn {
      height: 40px;
      width: 120px;
    }
  }
}

.bottom {
  position: absolute;
  bottom: 12px;
  right: 15px;
}
</style>
