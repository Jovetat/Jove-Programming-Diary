# 通过抽象类复用共用部分状态实现多个 Pinia 状态管理

#### 使用场景

在多个场景中共用同一状态，或部分复用与解耦状态管理。

### 实现步骤

#### 1. **定义一个抽象类来复用共用部分状态**

```typescript
import { defineStore } from 'pinia'

export default abstract class BaseOrderStore {
  protected storeName: string
  protected constructor(storeName: string) {
    this.storeName = storeName
  }
  protected abstract initState(): any
  protected abstract initActions(store: any): any
  init() {
    const storeDefinition = defineStore(this.storeName, {
      state: () => ({
        orderList: [], // 订单列表
        ...this.initState(),
      }),
      // reset: (state: any) => {},
      actions: {
        setOrderList(data: any[]) {
          this.orderList = data
        },
      },
    })

    const store = storeDefinition()
    this.addDynamicPropertiesAndMethods(store)
    return store
  }
  // 将子类属性和方法添加到 store 实例中
  private addDynamicPropertiesAndMethods(store: any) {
    const state = this.initState()
    const actions = this.initActions(store)
    Object.keys(state).forEach((key) => {
      store[key] = state[key]
    })
    Object.keys(actions).forEach((key) => {
      store[key] = actions[key]
    })
  }
}
```

#### 2. **在子类中继承并构造 Pinia 对象，添加自身特定的状态和方法**

```typescript
import BaseOrderStore from './BaseOrderStore'

class ShopOrderStore extends BaseOrderStore {
  constructor() {
    super('ShopOrderStore')
  }
  protected initState() {
    return {
      vipDeliveryInfo: [], // 会员配送地址
    }
  }
  protected initActions(store: any) {
    return {
      async getVipDeliveryInfo(callback?: Function) {},
    }
  }
}

const useShopOrderStore = new ShopOrderStore().init()
export default useShopOrderStore
```

### 过程中出现的问题与解决方式

**获取 Pinia 实例对象问题**：

- 在 `initActions` 中获取到的 `store` 是 `ShopOrderStore` 的实例，而不是 Pinia 实例对象。
- 解决方案：在 `抽象` 类中通过 `addDynamicPropertiesAndMethods` 方法，将 `this.initActions(store)`  Pinia 实例对象传递给 initActions

### 总结

1. **抽象类封装共用状态和方法**：
   - 定义一个抽象类 `BaseOrderStore`，通过封装共用的状态和方法。
2. **动态添加状态和方法**：
   - 通过 `addDynamicPropertiesAndMethods` 方法，将子类特定的状态和方法动态地添加到 Pinia 实例对象上。
3. **子类继承与扩展**：
   - 子类继承 `BaseOrderStore`，并通过实现 `initState` 和 `initActions` 方法来扩展自身特定的状态和方法。

## ❗APP端适配出现的问题

此实现方式在web端没有问题，uniapp app出现了程序白屏的问题，与pinia实例化后再插入`action`和`state`有关

```typescript
const store = storeDefinition()
this.addDynamicPropertiesAndMethods(store)
return store
```

问题出现在这里

### 解决方式，先插入后实例化

1. **定义一个抽象类来复用共用部分状态**

```typescript
import { defineStore } from 'pinia'

export default abstract class BaseOrderStore {
  protected storeName: string
  protected constructor(storeName: string) {
    this.storeName = storeName
  }
  protected abstract initState(): any
  protected abstract initActions(): any
  init() {
    const storeDefinition = {
      state: () => ({
        orderList: [],
        ...this.initState(),
      }),
      actions: {
        setOrderList(data: any[]) {
          this.orderList = data
        },
        ...this.initActions(),
      },
    }
    return defineStore(this.storeName, storeDefinition)
  }
}
```

2. **在子类中继承并构造 Pinia 对象，添加自身特定的状态和方法**

```typescript
import BaseOrderStore from './BaseOrderStore'
class ShopOrderStore extends BaseOrderStore {
  constructor() {
    super('ShopOrderStore')
  }
  protected initState() {
    return {
      vipDeliveryInfo: [], // 会员配送地址
    }
  }
  protected initActions() {
    return {
      async getVipDeliveryInfo() {},
    }
  }
}

const useShopOrderStore = new ShopOrderStore().init()
export default useShopOrderStore
```

