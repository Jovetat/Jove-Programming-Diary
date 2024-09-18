# barcode 自定义扫码

## 使用说明

> `components`目录下的文件是自定义扫码`组件`，使用方法只需通过`v-model`给该组件进行传值即可

```html
<liusheng22-barcode
  ref="barcode"
  v-model="visible"
  @success="success"
  @fail="fail"
/>
```

- `ref`用于调用自定义扫码组件内部的方法
- `v-model`用于控制自定义扫码组件的显示/隐藏
- `@success`扫码成功后的回调
- `@fail`扫码失败后的回调

---

> `page`目录下的文件是自定义扫码`页面`，使用方法将其页面定义到`pages.json`中，然后通过`uni.navigateTo`进行跳转即可

```json
{
  "path": "pages/barcode/barcode",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTextStyle": "white"
  }
}
```

- 该页面扫码成功后，会使用`uni.$emit`进行事件通知，请自行通过`uni.$on`进行接收通知

```js
uni.$emit('barcodeComplete')
```

## 温馨提示

> tips

- 如果使用`页面`级别的自定义扫码，请使用`pages`目录下的文件
- 如果使用`组件`级别的自定义扫码，请使用`components`目录下的文件
