<template>
  <view class="page">
    <view class="content">
      <view class="form">
        <nut-form ref="ruleForm" :model-value="formData" :rules="rules">
          <nut-form-item prop="code">
            <view class="displayFlex">
              <view class="nutinput greenBorder">
                <nut-input
                  v-model="formData.code"
                  type="text"
                  max-length="12"
                  :clearable="true"
                  placeholder="请输入账号"
                  cursor-spacing="30"
                />
              </view>
            </view>
          </nut-form-item>
          <nut-form-item prop="password">
            <view class="displayFlex">
              <view class="nutinput greenBorder">
                <nut-input
                  v-model="formData.password"
                  max-length="15"
                  type="password"
                  :clearable="true"
                  placeholder="请输入密码"
                  cursor-spacing="30"
                />
              </view>
            </view>
          </nut-form-item>
        </nut-form>
      </view>

      <view class="btn-view">
        <nut-button
          type="primary"
          shape="square"
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

const rules = {
  code: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
}
const ruleForm = ref<any>(null)
const systemInfo = ref<any>(null)
const isDev = ref<boolean>(false)
const loginLoading = ref<boolean>(false)
const formData = ref<any>({
  serverUrl: '',
  code: '',
  password: '',
})

onShow(() => {
  uni.getSystemInfo({
    success: function (res) {
      systemInfo.value = {
        appVersion: res?.appWgtVersion || res.appVersion,
      }
      if (res.platform === 'android') {
        plus.navigator.setFullscreen(false)
      }
    },
  })
})

const loginCheck = () => {
  ruleForm.value.validate().then(({ valid, errors }: any) => {
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
  position: relative;
  height: 100%;
  width: 100%;
}
.content {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;

  .form {
    width: 400px;
    margin-top: 20px;

    &-header {
      display: flex;
      align-items: center;
    }

    &-body {
      margin-left: 10px;
    }
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
  bottom: 20px;
  right: 20px;
}
</style>
