# quality-inspection-ui

自牧星球-质检管理系统

## 测试账号

Jove&&20260107🔒Jove&&20260107
Jove@20260107🔒Jove@20260107

## 技术栈

- **框架**: Vue 3.5 + Vite 7.2
- **语言**: JavaScript + TypeScript 5.9
- **UI 组件**: Ant Design Vue 4.2.6
- **状态管理**: Pinia 3.0
- **样式**: Sass 1.97
- **代码规范**: ESLint 9.39 + Prettier 3.7
- **路由**: Vue Router 4.6 + history 模式
- **HTTP 请求**: Axios 1.13

## 环境配置

### API baseURL 配置

项目支持 `test` 和 `online` 两个环境，配置文件位于 `src/config/env.ts`：

```typescript
const envConfigs: Record<EnvType, EnvConfig> = {
  test: {
    baseURL: '/api', // 开发环境，使用 Vite 代理
  },
  online: {
    baseURL: 'http://api.example.com', // 生产环境，真实 API 地址
  },
};
```

**环境切换规则：**

- `pnpm dev` → test 环境
- `pnpm build` → online 环境

**代理配置：**

开发环境使用 Vite 代理，配置在 `vite.config.js`：

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // 后端服务地址
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

**请求示例：**

```javascript
// 开发环境
request.get({ api: '/users' });
// → http://localhost:5173/api/users → http://localhost:8080/users

// 生产环境
request.get({ api: '/users' });
// → http://api.example.com/users
```
