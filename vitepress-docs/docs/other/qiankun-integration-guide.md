# Vite 框架乾坤微前端嵌入指南

本指南详细说明如何将一个 Vite 项目改造为乾坤微前端子应用,实现微服务架构。

## 目录

- [核心依赖](#核心依赖)
- [Vite 配置](#vite-配置)
- [Main.js 配置](#mainjs-配置)
- [路由配置](#路由配置)
- [工具函数](#工具函数)
- [完整流程](#完整流程)

---

## 核心依赖

### 1. vite-plugin-qiankun

**安装:**

```bash
npm install vite-plugin-qiankun --save-dev
```

**作用:**
`vite-plugin-qiankun` 是专为 Vite 项目设计的乾坤微前端插件,解决了 Vite 与乾坤集成的核心问题:

1. **资源加载适配**: 自动处理 Vite 开发环境和生产环境的资源路径问题
2. **UMD 格式转换**: 将 Vite 的 ES Module 输出转换为乾坤要求的 UMD 格式
3. **生命周期注入**: 提供 `renderWithQiankun` 等辅助函数,简化生命周期钩子的实现
4. **环境标识**: 提供 `qiankunWindow` 对象,用于判断当前是否运行在乾坤环境中
5. **开发模式支持**: 通过 `useDevMode` 选项支持本地开发调试

**能实现什么:**

- ✅ 让 Vite 项目无缝接入乾坤微前端框架
- ✅ 支持独立运行和微前端模式双模式运行
- ✅ 自动处理静态资源路径问题
- ✅ 提供完整的生命周期管理能力
- ✅ 支持主应用与子应用的数据通信

---

## Vite 配置

### vite.config.js 完整配置

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import { name } from './package.json';

// 将 package.json 中的 name 转换为合法的 UMD 库名(去除横杠)
const libName = name.replace(/-/g, '');

export default defineConfig({
  plugins: [
    vue(),
    // 【关键配置1】注册 qiankun 插件
    qiankun(name, {
      useDevMode: true, // 开启开发模式,支持本地调试
    }),
  ],

  // 【关键配置2】base 路径配置
  // 必须设置为项目部署的域名地址
  base: 'https://quality-inspection-ui.tjzimu.com/',

  server: {
    port: 5174,
    origin: 'http://localhost:5174',
    // 【关键配置3】CORS 配置,允许主应用跨域加载资源
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    cors: true,
  },

  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        // 【关键配置4】输出 UMD 格式,乾坤要求
        format: 'umd',
        name: libName, // UMD 库名
        exports: 'named',
        // 固定文件名,避免 hash 导致主应用无法找到入口
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
```

### 关键配置说明

| 配置项                                     | 作用                                    | 必须性  |
| ------------------------------------------ | --------------------------------------- | ------- |
| `qiankun(name, { useDevMode: true })`      | 注册乾坤插件,启用开发模式               | ✅ 必须 |
| `base`                                     | 设置为项目部署的域名地址                | ✅ 必须 |
| `server.cors: true`                        | 允许跨域,主应用才能加载子应用资源       | ✅ 必须 |
| `build.rollupOptions.output.format: 'umd'` | 输出 UMD 格式,乾坤要求                  | ✅ 必须 |
| `build.rollupOptions.output.name`          | UMD 库名,需与 package.json 的 name 对应 | ✅ 必须 |

---

## Main.js 配置

### 核心概念

在乾坤微前端架构中,子应用需要:

1. **双模式支持**: 既能独立运行(开发调试),也能作为微应用嵌入主应用
2. **生命周期管理**: 实现 `bootstrap`、`mount`、`unmount` 三个生命周期钩子
3. **路由注册**: 根据运行环境设置路由的 `base` 路径(乾坤环境需与主应用 `activeRule` 一致)
4. **资源清理**: 在 `unmount` 时彻底清理 Vue 实例、路由、定时器等资源

### 完整 main.js 实现

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './router';
import { renderWithQiankun } from 'vite-plugin-qiankun/dist/helper';
import { IS_QIAN_KUN } from '@/utils/qiankun';

// ─────────────────────────────────────────────────────────────────────────────
// 【关键点1】模块级变量:必须可被销毁和重建
// ─────────────────────────────────────────────────────────────────────────────
let app = null; // Vue 实例
let router = null; // 路由实例
let timer = null; // 延迟创建定时器

// ─────────────────────────────────────────────────────────────────────────────
// 【关键点2】创建 Vue 应用实例
// ─────────────────────────────────────────────────────────────────────────────
function createVueApp(mainAppStore = {}) {
  app = createApp(App, {
    // 将主应用下发的 store 作为 props 传递给 App.vue
    mainAppStore,
  });
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);
  app.mount('#app');
}

// ─────────────────────────────────────────────────────────────────────────────
// 【关键点3】renderWithQiankun:实现乾坤生命周期钩子
// ─────────────────────────────────────────────────────────────────────────────
renderWithQiankun({
  /**
   * bootstrap:子应用资源加载完毕后执行一次
   * 用途:全局初始化,只执行一次的操作
   */
  bootstrap() {
    console.log('[qiankun] quality-inspection-ui bootstrap');
  },

  /**
   * mount:每次主应用激活子应用时调用
   * 用途:创建 Vue 实例、注册路由、接收主应用传入的数据
   * @param {Object} props - 主应用传入的数据
   * @param {Object} props.data - 主应用的 store 数据
   * @param {Object} props.http - 主应用的 http 实例
   * @param {Object} props.Cookies - 主应用的 Cookies 工具
   * @param {Object} props.Bus - 主应用的事件总线
   * @param {Object} props.localStorage - 主应用的 localStorage 工具
   */
  mount(props) {
    const { data = {} } = props || {};

    // ① 接收主应用传入的共享数据(如 http、Cookies、Bus、localStorage 等)
    // 根据实际需要挂载到 window 或通过其他方式使用
    // 示例: window.mainAppData = props;

    // ② 创建路由实例,乾坤环境使用与主应用 activeRule 一致的 base
    router = createRouter({
      history: createWebHistory(
        IS_QIAN_KUN
          ? '/micro/quality-inspection-ui' // 乾坤环境:必须与主应用注册的 activeRule 一致
          : '/', // 独立运行:使用 vite.config.js 的 base
      ),
      routes,
    });

    // ③ 延迟创建 Vue 实例,确保主应用已将 #app 容器节点挂载到 DOM
    timer = setTimeout(() => {
      createVueApp(data); // 将主应用 store 传入
    });
  },

  /**
   * unmount:子应用切换离开时调用
   * 用途:彻底清理资源,防止内存泄漏
   */
  unmount() {
    console.log('[qiankun] quality-inspection-ui unmount');

    // ① 清除定时器,防止 unmount 后 Vue 实例仍被创建
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // ② 销毁 Vue 实例,释放路由监听器、事件监听等资源
    if (app) {
      app.unmount();
      app = null;
    }

    // ③ 清理路由实例
    router = null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 【关键点4】独立运行兜底:非 qiankun 环境直接创建应用
// ─────────────────────────────────────────────────────────────────────────────
if (!IS_QIAN_KUN) {
  // 创建路由实例
  router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL || '/'),
    routes,
  });

  // 创建 Vue 应用
  createVueApp();
}
```

### Main.js 核心要点总结

| 要点               | 说明                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| **模块级变量**     | `app`、`router`、`timer` 必须可被销毁和重建                                  |
| **路由注册**       | 根据 `IS_QIAN_KUN` 设置路由 `base` 路径,乾坤环境需与主应用 `activeRule` 一致 |
| **主应用数据接收** | 通过 `mount(props)` 接收主应用传入的共享依赖                                 |
| **资源清理**       | `unmount` 中必须清理所有资源,防止内存泄漏                                    |
| **独立运行兜底**   | 非乾坤环境直接创建应用,支持本地开发                                          |

---

## 路由配置

### 路由 Base 路径设置

路由的 `base` 路径需要根据运行环境设置:

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import { IS_QIAN_KUN } from '@/utils/qiankun';

router = createRouter({
  history: createWebHistory(
    IS_QIAN_KUN
      ? '/micro/quality-inspection-ui' // 乾坤环境:必须与主应用注册的 activeRule 一致
      : '/', // 独立运行:使用 vite.config.js 的 base
  ),
  routes,
});
```

**说明:**

- 乾坤环境: `base` 必须与主应用注册子应用时的 `activeRule` 完全一致
- 独立运行: 使用 `vite.config.js` 中配置的 `base` 路径

---

## 工具函数

### src/utils/qiankun.ts

```typescript
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// qiankun 环境标识
export const IS_QIAN_KUN = qiankunWindow.__POWERED_BY_QIANKUN__;

// qiankun 注入的静态资源加载路径
export const PUBLIC_PATH =
  qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/';
```

**说明:**

- `__POWERED_BY_QIANKUN__`: 乾坤注入的环境标识,用于判断当前是否运行在乾坤环境中
- `__INJECTED_PUBLIC_PATH_BY_QIANKUN__`: 乾坤注入的静态资源路径,用于动态加载资源

---

## 完整流程

### 1. 安装依赖

```bash
npm install vite-plugin-qiankun --save-dev
```

### 2. 配置 package.json

确保 `name` 字段存在且唯一:

```json
{
  "name": "quality-inspection-ui",
  "version": "1.0.0"
}
```

### 3. 配置 vite.config.js

参考 [Vite 配置](#vite-配置) 章节,关键点:

- 注册 `qiankun` 插件
- 设置 `base` 路径
- 开启 CORS
- 输出 UMD 格式

### 4. 改造 main.js

参考 [Main.js 配置](#mainjs-配置) 章节,关键点:

- 使用 `renderWithQiankun` 实现生命周期钩子
- 根据环境注册路由
- 接收主应用传入的数据
- 在 `unmount` 中清理资源
- 支持独立运行

### 5. 创建工具函数(可选)

创建 `src/utils/qiankun.ts`,导出 `IS_QIAN_KUN` 和 `PUBLIC_PATH`。

---

## 总结

将 Vite 项目改造为乾坤微前端子应用的核心步骤:

1. ✅ 安装 `vite-plugin-qiankun`
2. ✅ 配置 `vite.config.js`:注册插件、设置 base 为部署域名、开启 CORS、输出 UMD
3. ✅ 改造 `main.js`:实现 `renderWithQiankun` 生命周期钩子
4. ✅ 注册路由:根据环境设置路由 `base` 路径(乾坤环境需与主应用 `activeRule` 一致)
5. ✅ 接收主应用数据:通过 `mount(props)` 接收共享依赖
6. ✅ 清理资源:在 `unmount` 中彻底清理
7. ✅ 支持独立运行:非乾坤环境直接创建应用

通过以上配置,您的 Vite 项目即可作为乾坤微前端子应用运行,同时保留独立运行的能力。
