# vue 组件透传所有属性——useAttrs

## 引言

在对某些基础组件进行封装的时候，可能无法通过 props 将所有可能的属性都声明了，这时候就可以使用`useAttrs`，拿到不通过 props 声明的属性

## 实现

```vue
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAttrs } from 'vue'

export default defineComponent({
  name: 'debounceButton',
  setup(props, { emit }) {
    const attrs = useAttrs()
    // attrs 为全部作用在组件上的属性
    const buttonAttrs = computed(() => {
      const { onClick, ...restAttrs } = attrs
      // 通过这种方式实现可以过滤
      return restAttrs
    })
    return {
      buttonAttrs,
    }
  },
})
</script>
```

## 总结

1. 通过 `useAttrs` 可以获取到**全部作用在组件上的属性**
2. 通过解构可以实现过滤
