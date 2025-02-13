# uniApp 命令式确认框组件

## 背景与问题

在 uniApp 开发过程中， Android 原生应用环境下存在以下限制：

**动态 DOM 操作限制**  
Android 原生应用（非 Web 端）中无法通过 JavaScript 直接动态生成和添加 DOM 节点。这导致传统的通过 `document.createElement` 创建弹窗的方式在原生应用中不可用。

## 解决方案

### 核心思路
通过 Vue3 的组合式 API 结合 ref 引用对象实现组件挂载：

1. **Ref 挂载机制**：将组件挂载到预先定义的 ref 节点上
2. **平台适配**：根据运行环境自动切换挂载策略
   - Web 端：动态创建 div 节点
   - Android 端：使用传入的 ref 对象进行挂载

### 功能
- 实现真正的命令式调用（通过函数调用触发弹窗）
- 支持异步加载状态和二次确认功能
- 保持跨平台兼容性（Web/Android/iOS）

## 使用说明

### 参数说明

| 参数           | 类型             | 必填 | 说明                          |
| :------------- | :--------------- | :--- | :---------------------------- |
| options        | Options / string | 是   | 配置对象或直接字符串          |
| mountRef       | any              | 是   | **必须传入已定义的 ref 对象** |
| configCallback | Function         | 否   | 确认回调                      |
| cancelCallback | Function         | 否   | 取消回调                      |

### 组件特性

#### 1. 多形态配置支持

```ts
// 简写形式
configDialog('确认删除吗？', this.$refs.myRef)

// 完整配置
configDialog({
  msg: '确认提交？',
  isLoading: true,
  confirmAgain: '请再次确认',
  style: { width: '300px' }
}, this.$refs.myRef, handleConfirm)
```

## 使用指南

### 基础用法

```vue
<template>
  <!-- 定义挂载节点 -->
  <view ref="dialogRef"></view>
  
  <button @click="showDialog">打开弹窗</button>
</template>

<script setup>
const dialogRef = ref(null)

const showDialog = () => {
  configDialog(
    {
      msg: '确认执行操作？',
      configText: '确认',
      cancelText: '关闭'
    },
    dialogRef,  // 必须传入 ref 对象
    () => console.log('Confirmed!')
  )
}
</script>
```

### 二次确认实现

```ts
configDialog({
  msg: '删除后不可恢复',
  confirmAgain: '请再次确认删除'
}, c, handleDelete)
```

#### 异步操作处理

```ts
const dialogRef = ref<any>()
const popupConfig = () => {
  const closeDiglog = configDialog(
    {
      msg: '确定要提交数据吗...\n调用接口',
      isLoading: true,
    },
    dialogRef,
    () => {
      setTimeout(() => {
        closeDiglog()
      }, 5000)
    },
  )
}
```

## 源代码

### 核心函数 `configDialog`

```typescript
import { createApp, defineComponent, h } from 'vue'
import config from './config.vue'

interface Options {
  msg: string // 提示信息
  isLoading?: boolean // 是否显示loading
  confirmAgain?: string // 是否再次确认
  configText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
  title?: string // 弹窗标题
  style?: any // 自定义样式
}

/**
 * @description 生成一个确认弹窗，支持异步加载状态和二次确认功能
 * @param {Options | string} options - 弹窗配置对象，或者直接传入字符串作为 `msg` 提示信息
 *   @property {string} msg - 必填，弹窗提示信息
 *   @property {boolean} [isLoading=false] - 选填，点击确认后按钮是否进入 loading 状态，isLoading开启时，必须根据return主动关闭弹窗
 *   @property {string} [confirmAgain=false] - 选填，是否需要二次确认，默认 false
 *   @property {string} [configText='确定'] - 选填，确认按钮文字，默认“确定”
 *   @property {string} [cancelText='取消'] - 选填，取消按钮文字，默认“取消”
 *   @property {string} [title=false] - 选填，弹窗标题，默认不显示标题
 *   @property {any} [style] - 选填，自定义弹窗样式
 * @param {any} mountRef - 需要挂载弹窗的目标 `ref`（需传入一个 `ref` 对象）
 * @param {Function} [configCallback] - 选填，点击“确认”按钮时执行的回调函数
 * @param {Function} [cancelCallback] - 选填，点击“取消”按钮时执行的回调函数
 * @returns {Function} - 返回一个 `destroy` 方法，可手动调用以销毁弹窗
 */
export function configDialog(
  options: Options | string,
  mountRef: any, // 传入的 ref 对象
  configCallback?: Function,
  cancelCallback?: Function,
) {
  const popupApp = createApp(
    defineComponent({
      render() {
        return h(config, {
          options,
          configCallback,
          cancelCallback,
          destroy: this.destroy,
        })
      },
      methods: {
        destroy() {
          destroyApp()
        },
      },
    }),
  )

  const systemInfo = uni.getSystemInfoSync()
  if (systemInfo.uniPlatform === 'web') {
    const div = document.createElement('div')
    document.body.appendChild(div)
    popupApp.mount(div)
  } else {
    popupApp.mount(mountRef.value)
  }

  // 销毁实例
  const destroyApp = () => {
    popupApp.unmount()
  }

  return destroyApp
}
```

### 被生成组件`config`

```vue
<template>
  <popupPlus :isShow="isShow" :popupStyle="options.style">
    <view v-if="options.title" class="header">{{ options.title }}</view>
    <view class="content">{{ options.msg }}</view>
    <view class="bottom">
      <view class="btn-view" style="width: 70%">
        <nut-button type="primary" shape="square" @click="cancel">
          {{ options.cancelText }}
        </nut-button>
        <nut-button
          type="default"
          shape="square"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ options.configText }}
        </nut-button>
      </view>
    </view>
    <view ref="confirmAgainRef"></view>
  </popupPlus>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import popupPlus from '@/components/popup-plus.vue'
import { configDialog } from './index'

const popupStyle = {
  width: '400px',
}

interface Options {
  msg: string // 提示信息
  isLoading?: boolean // 是否显示loading
  confirmAgain?: string // 是否再次确认
  configText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
  title?: string // 弹窗标题
  style?: any // 自定义样式
}

export default defineComponent({
  props: {
    options: {
      type: [Object, String],
      required: true,
      validator(value: any) {
        if (typeof value === 'string') return true
        if (typeof value === 'object' && value?.msg) return true
        return false
      },
    },
    configCallback: {
      type: Function,
      default: () => {},
    },
    cancelCallback: {
      type: Function,
      default: () => {},
    },
    destroy: {
      type: Function,
      required: true, // 销毁函数
    },
  },
  components: {
    popupPlus,
  },
  setup(props) {
    const loading = ref<boolean>(false)
    const isShow = ref<boolean>(true)
    const confirmAgainRef = ref<any>(null)

    const options = computed<Options>(() => {
      // 如果传入的是字符串，封装为对象并添加默认值
      if (typeof props.options === 'string') {
        return {
          msg: props.options,
          isLoading: false,
          confirmAgain: '',
          configText: '确定',
          cancelText: '取消',
          title: '',
          style: popupStyle,
        }
      }
      return {
        msg: props.options.msg || '',
        isLoading: props.options.isLoading ?? false,
        confirmAgain: props.options.confirmAgain ?? '',
        configText: props.options.configText ?? '确定',
        cancelText: props.options.cancelText ?? '取消',
        title: props.options.title ?? '',
        style: props.options.style ?? popupStyle,
      }
    })

    const cancel = () => {
      props.cancelCallback && props.cancelCallback()
      closePopup()
    }

    const handleConfirm = () => {
      if (options.value.confirmAgain) {
        configDialog(
          {
            msg: options.value.confirmAgain,
            style: {
              width: '300px',
              padding: '10px',
            },
          },
          executeConfirmAction,
        )
        return
      }
      executeConfirmAction()
    }

    const executeConfirmAction = () => {
      if (options.value.isLoading) {
        loading.value = true
        props.configCallback && props.configCallback()
      } else {
        props.configCallback && props.configCallback()
        closePopup()
      }
    }

    const closePopup = () => {
      isShow.value = false
      props.destroy()
    }

    return {
      loading,
      isShow,
      options,
      confirmAgainRef,
      cancel,
      handleConfirm,
    }
  },
})
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  white-space: pre-line;
}
.content {
  padding: 20px 10px 30px 10px;
  text-align: center;
  font-size: 18px;
  white-space: pre-line;
}
</style>
```

## 优化

### 前提条件
**项目必须存在统一的 Layout 组件**
所有页面需继承自同一个基础 Layout 组件

###  优化核心思路

1. 通过应用框架层`统一管理弹窗容器`
2. 在全局布局文件中`预置挂载节点`
3. 应用启动时注册全局引用
4. 自动选择容器进行挂载


### Layout 层设置

```html
<!-- /layouts/layout.vue -->
<template>
  <!-- 主内容 -->
  <slot />
  <!-- 弹窗挂载点 -->
  <view ref="globalDialogContainer"></view>
  <view ref="globalDialogContainer2"></view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setGlobalDialogRef } from '@/components/configModelFun'

// 初始化全局容器
const globalDialogContainer = ref(null)
const globalDialogContainer2 = ref(null)

onMounted(() => {
  setGlobalDialogRef(globalDialogContainer, globalDialogContainer2)
})
</script>
```

### 核心代码变更对比

| 变更点         | 旧版本                | 新版本                         |
| :------------- | :-------------------- | :----------------------------- |
| **函数参数**   | 需显式传递 `mountRef` | 移除 `mountRef` 参数           |
| **挂载逻辑**   | 直接使用传入的 ref    | 根据弹窗类型选择全局容器       |
| **初始化方式** | 无全局注册            | 通过 `setGlobalDialogRef` 注册 |

 ### 调用简化

**旧方式：**

```ts
configDialog(options, this.$refs.dialogRef, callback)
```

**新方式：**

```ts
configDialog(options, callback) // 无需传递 ref
```

### 更改后核心代码

```ts
import { createApp, defineComponent, h } from 'vue'
import config from './config.vue'

let globalModelRef: any = null
let globalModelRef2: any = null

export function setGlobalDialogRef(ref1: any, ref2: any) {
  globalModelRef = ref1
  globalModelRef2 = ref2
}

interface Options {
  msg: string // 提示信息
  isLoading?: boolean // 是否显示loading
  confirmAgain?: string // 是否再次确认
  configText?: string // 确认按钮文字
  cancelText?: string // 取消按钮文字
  title?: string // 弹窗标题
  style?: any // 自定义样式
}

/**
 * @description 生成一个确认弹窗，支持异步加载状态和二次确认功能
 * @param {Options | string} options - 弹窗配置对象，或者直接传入字符串作为 `msg` 提示信息
 *   @property {string} msg - 必填，弹窗提示信息
 *   @property {boolean} [isLoading=false] - 选填，点击确认后按钮是否进入 loading 状态，isLoading开启时，必须根据return主动关闭弹窗
 *   @property {string} [confirmAgain=false] - 选填，是否需要二次确认，默认 false
 *   @property {string} [configText='确定'] - 选填，确认按钮文字，默认“确定”
 *   @property {string} [cancelText='取消'] - 选填，取消按钮文字，默认“取消”
 *   @property {string} [title=false] - 选填，弹窗标题，默认不显示标题
 *   @property {any} [style] - 选填，自定义弹窗样式
 * @param {Function} [configCallback] - 选填，点击“确认”按钮时执行的回调函数
 * @param {Function} [cancelCallback] - 选填，点击“取消”按钮时执行的回调函数
 * @returns {Function} - 返回一个 `destroy` 方法，可手动调用以销毁弹窗
 */
export function configDialog(
  options: Options | string,
  configCallback?: Function,
  cancelCallback?: Function,
) {
  const popupApp = createApp(
    defineComponent({
      render() {
        return h(config, {
          options,
          configCallback,
          cancelCallback,
          destroy: this.destroy,
        })
      },
      methods: {
        destroy() {
          destroyApp()
        },
      },
    }),
  )

  const systemInfo = uni.getSystemInfoSync()
  const isConfirmAgain = typeof options === 'object' && options.confirmAgain

  if (systemInfo.uniPlatform === 'web') {
    const div = document.createElement('div')
    document.body.appendChild(div)
    popupApp.mount(div)
  } else {
    // 使得二次确认和首次渲染在不同 ref 上
    popupApp.mount(
      isConfirmAgain ? globalModelRef.value : globalModelRef2.value,
    )
  }

  // 销毁实例
  const destroyApp = () => {
    popupApp.unmount()
  }

  return destroyApp
}
```

