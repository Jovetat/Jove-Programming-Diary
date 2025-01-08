# 全局点击事件节流

## 功能需求

1. **全局监听 `click` 事件**，实现节流功能，防止短时间内多次点击。

2. 排除特定元素：

   `input` 输入框不受节流限制。
   
   含有 `no-throttle` 属性的元素不受节流限制。

## 封装全局节流监听器

首先，在 `src/utils` 目录下创建一个工具文件，命名为 `throttl.ts`。

**文件路径**：`src/utils/throttle.ts`

```ts
// 全局节流状态
let isThrottled = false

/**
 * 节流点击事件处理器
 * @param delay 节流时间（毫秒）
 * 排除包含 no-throttle 属性的元素
 */
export const initGlobalThrottleClick = (delay: number = 1000) => {
  const throttledClickHandler = (event: Event) => {
    const target = event.target as HTMLElement

    // 排除 input 元素
    if (target.tagName === 'INPUT') {
      return
    }

    // 排除包含 no-throttle 属性的元素
    if (target.hasAttribute('no-throttle')) {
      return
    }

    // 节流控制
    if (isThrottled) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }

    isThrottled = true // 开启节流

    // 指定时间后解除节流状态
    setTimeout(() => {
      isThrottled = false
    }, delay)
  }

  // 在捕获阶段全局监听 click 事件
  document.addEventListener('click', throttledClickHandler, true)
}
```

## 2在项目入口文件中注册全局节流

在 `main.ts` 中引入工具函数，调用初始化方法。

**文件路径**：`src/main.ts`

```ts
import App from './App.vue'
import { initGlobalThrottleClick } from './utils/throttleClickHandler'

const app = createApp(App)

// 注册全局节流点击事件，设置节流时间为 1000 毫秒（1 秒）
initGlobalThrottleClick(1000)

app.mount('#app')
```

##  示例代码

```html
<template>
  <div>
    <!-- 受节流控制的按钮 -->
    <button>需要节流的按钮</button>

    <!-- 不受节流控制的按钮 -->
    <button no-throttle>无需节流的按钮</button>

    <!-- input 元素不受节流控制 -->
    <input type="text" placeholder="普通输入框" />

    <!-- 其他元素 -->
    <div>点击这里也会受到节流控制</div>
  </div>
</template>
```
