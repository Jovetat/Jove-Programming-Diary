# vue 自定义全局指令实现节流

## 我想通过 vue 的全局指令实现 button click 事件节流的功能

ChatGPT

在 Vue 中，你可以通过自定义全局指令来实现按钮点击事件的节流功能。节流（throttling）是指在一定时间间隔内只执行一次函数，以控制事件处理的频率，防止过多的函数调用。

以下是一个实现按钮点击事件节流的全局指令示例：

```js
// main.js (或者在你的 Vue 项目中合适的位置注册全局指令)
import Vue from 'vue'

// 全局指令名称为 v-throttle-click
Vue.directive('throttle-click', {
  inserted: function (el, binding) {
    let throttleTimeout
    el.addEventListener('click', () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null
        }, binding.value || 1000) // 默认节流时间间隔为1秒，也可以通过传参来设置节流时间
      }
    })
  },
})
```

在上面的例子中，我们创建了一个名为 `throttle-click` 的全局指令。这个指令在按钮元素上进行了定义，用 `inserted` 钩子来添加事件监听器。在点击事件处理程序中，使用了 `setTimeout` 函数来实现节流功能。

使用方法如下：

```vue
<template>
  <div>
    <button v-throttle-click="1000" @click="handleClick">
      Click me (throttled)
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log('Button clicked (throttled)')
      // 这里放置你的点击事件处理逻辑
    },
  },
}
</script>
```

在上面的例子中，我们在按钮上应用了 `v-throttle-click` 指令，并传递了一个参数 `1000`，表示节流的时间间隔为 1 秒。你可以根据需要调整节流的时间间隔。每次点击按钮时，如果节流时间间隔内已经触发了一次点击事件，后续的点击将被忽略，直到节流时间间隔过去后重新生效。

这样，通过这个自定义的全局指令，你可以方便地在整个 Vue 项目中实现按钮点击事件的节流功能。

## 我想要对节流做一个优化，节流对首次事件的处理在时间间隔之后，而我希望首次点击时直接执行 click 事件，忽略首次点击后时间间隔内的其他点击

ChatGPT

如果你希望在按钮首次点击时立即执行点击事件，并且在之后的时间间隔内忽略其他点击事件，可以对节流函数稍作修改。这种需求可以通过结合节流和防抖（debounce）的思路来实现。

在这种情况下，我们需要记录首次点击的时间戳，并在首次点击后立即执行点击事件处理程序。之后的点击事件则需要在指定的时间间隔内被忽略。下面是修改后的全局指令实现：

```js
// main.js (或者在你的 Vue 项目中合适的位置注册全局指令)
import Vue from 'vue'

// 全局指令名称为 v-throttle-click
Vue.directive('throttle-click', {
  inserted: function (el, binding) {
    let lastClickTime = 0
    const throttleTimeout = binding.value || 1000 // 默认节流时间间隔为1秒，也可以通过传参来设置节流时间

    el.addEventListener('click', () => {
      const now = Date.now()
      if (now - lastClickTime >= throttleTimeout) {
        // 超过节流时间间隔，执行点击事件处理程序
        binding.value()
        lastClickTime = now
      }
    })
  },
})
```

在这个示例中，我们记录了 `lastClickTime` 来保存上一次点击的时间戳。当点击事件发生时，我们首先计算当前时间戳 `now`，并检查距离上一次点击的时间间隔是否大于或等于节流时间间隔 `throttleTimeout`。如果是，则执行点击事件处理程序 `binding.value()`，并更新 `lastClickTime` 为当前时间戳。

使用方法保持不变：

```vue
<template>
  <div>
    <button v-throttle-click="handleClick">Click me (throttled)</button>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      console.log('Button clicked (throttled)')
      // 这里放置你的点击事件处理逻辑
    },
  },
}
</script>
```

在这个示例中，我们不再传递时间间隔参数，而是直接将处理函数 `handleClick` 作为指令的值。这样，首次点击时会立即执行处理函数，之后的点击事件则会在指定的时间间隔内被节流。

## 实战

总结全局自定义指令的实现并解决您在 Vue 3 中遇到的问题。关键在于理解 Vue 3 的指令生命周期钩子名称变化，以及正确处理 `binding.value` 作为配置对象而不是单一函数。

## 1. 全局自定义指令的实现

首先，在 Vue 3 中定义全局自定义指令：

```js
// src/directives/index.js
const throttleDirective = {
  mounted(el, binding) {
    let lastClickTime = 0
    console.log(binding)
    const throttleTimeout = 1000
    el.addEventListener('click', () => {
      const now = Date.now()
      if (now - lastClickTime >= throttleTimeout) {
        // 超过节流时间间隔，执行点击事件处理程序
        binding.value()
        lastClickTime = now
      }
    })
  },
}

export default {
  install(app) {
    app.directive('throttle', throttleDirective)
  },
}
```

## 2. 在 `main.js` 中注册全局自定义指令

确保在 `main.js` 中导入并注册这些指令：

```js
import directives from '@/directives' // 导入自定义指令

// 注册全局自定义指令
app.use(directives)
```

## 3. 父组件中使用指令

在父组件中使用指令时，需要传递包含 `handler` 和 `delay` 的对象：

```vue
<template>
  <div>
    <a-button type="primary" class="btn" v-throttle="handleClick">
      防抖
    </a-button>
  </div>
</template>
```

## 总结

1. **Vue 3 指令钩子**：使用 `mounted` 钩子代替 Vue 2 中的 `inserted` 钩子。

2. **解构 `binding.value`**：在指令内部正确解构 `binding.value` 并设置默认值。

3. 在本案例中直接将**click 事件**传入`binding`，如果有其他参数，可以通过一个对象一起传入，在指令中解构

   ```js
   <a-button  v-throttle="{ handler: handleClick, delay: 1000 }">
       防抖
   </a-button>
   // 传入
   const throttleDirective = {
     mounted(el, binding) {
       const { handler, delay = 1000 } = binding.value || {};
       // 解构
       el.addEventListener('click', (event) => {
           handler(event);
         }
       });
     }
   };
   ```
