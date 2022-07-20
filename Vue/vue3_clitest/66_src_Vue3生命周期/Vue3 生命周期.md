# Vue3 生命周期

## 1.Vue3 中可以继续使用 Vue2 中的生命周期钩子，但有两个更名：

- `beforeCreate`
- `created`
- `beforeMount`
- `mounted`
- `beforeUpdate`
- `updated`
- `beforeDestroy`--> `beforeUnmount`
- `destroyed`--> `unmounted`

## Vue3 提供了 Composition API 形式的生命周期钩子，与配置项生命周期钩子对应关系如下：

- `beforeCreate`------>`setup()`
- `created`------>`setup()`
    - setup() 在 beforeCreate(以配置项形式执行的生命周期) 前执行
    - 组合式API中 setup 相当于 beforeCreate 和 created (因此无这两个钩子对应 组合式API)
- `beforeMount` ------>`onBeforeMount`
- `mounted`------>`onMounted`
- `beforeUpdate`------>`onBeforeUpdate`
- `updated` ------>`onUpdated`
- `beforeUnmount` ------>`onBeforeUnmount`
- `unmounted` ------>`onUnmounted`

### 组合式API 使用

-   *import* { `onBeforeMount`,` onMounted`, `onBeforeUpdate`,` onUpdated`, `onBeforeUnmount`, `onUnmounted` } *from* 'vue'
- 组合式API 与 配置项写法 并无优劣，同时写相同生命周期会先执行 组合式API(二者选其一使用，不建议同时使用)
-   生命周期组合式API都是函数，通过传入一个回调函数使用

```js
onBeforeMount( ()=>{ 回调函数 } )
```

