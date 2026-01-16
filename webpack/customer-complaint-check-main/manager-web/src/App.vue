<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NLoadingBarProvider } from 'naive-ui'
import { naiveThemeOverrides } from '@/config/naive'
</script>

<template>
  <n-config-provider :theme-overrides="naiveThemeOverrides">
    <n-message-provider>
      <n-dialog-provider>
        <n-loading-bar-provider>
          <router-view />
        </n-loading-bar-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss">
@import '@/styles/global.scss';
</style>
