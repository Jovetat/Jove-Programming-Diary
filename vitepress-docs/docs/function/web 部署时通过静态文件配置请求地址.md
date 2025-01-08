# web 部署动态更改请求地址

通过访问根目录`config配置`实现在`打包文件外部更改请求地址`

## 配置 Vite

```js
export default defineConfig({
  base: '/', // 设置公共路径
})
```

## 创建配置文件

#### 开发：

在`根目录`创建`config.json`文件

**不影响 proxy 代理**

```json
{
  "apiBaseUrl": "/"
}
```

#### 部署

在`dist文件 根目录`创建`config.json`文件

```json
{
  "apiBaseUrl": "https://example.com/api"
}
```

## 加载配置文件

src\utils\configure.ts

```ts
export const defaultBaseUrl = 'https://example.com/api/'
export async function loadConfig() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}config.json`)
    if (!response.ok) {
      console.error('获取配置文件失败')
    }
    const config = await response.json()
    return config
  } catch (error) {
    console.error('加载配置文件时出错:', error)
    return {
      apiBaseUrl: defaultBaseUrl,
    }
  }
}
```

## 配置 Pinia 存储

在 `src/store/config.js` 中定义一个存储来管理配置：

```js
import { defineStore } from 'pinia'
import { defaultBaseUrl } from '@/utils/configure'

export const useConfigStore = defineStore('config', {
  state: () => ({
    apiBaseUrl: '',
  }),
  actions: {
    setConfig(config) {
      this.apiBaseUrl = config?.apiBaseUrl ?? defaultBaseUrl
    },
  },
})
```

## 在应用启动时加载配置并设置存储

```js
import { createApp } from 'vue'
import App from './App.vue'
import { loadConfig } from './config'
import { createPinia } from 'pinia'
import { useConfigStore } from '@/store/piniaStore/config'

loadConfig().then((config) => {
  const { setConfig } = useConfigStore(pinia)
  setConfig(config)

  const app = createApp(App)
  app.mount('#app')
})
```

## 配置 Axios 实例

```js
import axios from 'axios'
import { useConfigStore } from '@/store/piniaStore/config.js'
import { defaultBaseUrl } from '@/utils/configure'

const request = axios.create({
  baseURL: defaultBaseUrl,
  timeout: 600000,
})
request.interceptors.request.use((config) => {
  config.baseURL = useConfigStore().apiBaseUrl || config.baseURL
  return config
})
```
