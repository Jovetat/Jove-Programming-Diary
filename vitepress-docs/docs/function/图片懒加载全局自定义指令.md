# UniApp 图片懒加载

在 UniApp 中，`<image>` 组件的图片渲染策略是通过子元素div背景图 (`background-image`) 来进行处理，而不是直接修改 `src`。

## 全局自定义指令

```ts
const lazyDirective = {
  mounted(el, binding) {
    const pic_src = binding.value

    const obServer = new IntersectionObserver((entries) => {
      // 如果 intersectionRatio 为 0，则目标在视野外
      if (entries.find((v) => v.intersectionRatio)) {
        el.querySelector('div').style.backgroundImage = `url(${pic_src})`
        obServer.unobserve(el)
      }
    })
    obServer.observe(el)
  },
}

export default {
  install(app) {
    app.directive('lazy-load', lazyDirective)
  },
}
```

## 使用方式

```vue
<image
  v-lazy-load="https://fastly.picsum.photos/id/340/2000/3000.jpg?hmac=ld6APbTLoweLXmHjqJtxYobjFQBPv_8PwPAngEbdZNw"
></image>
```

