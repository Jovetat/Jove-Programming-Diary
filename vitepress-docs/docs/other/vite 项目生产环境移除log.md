# vite 项目生产环境移除 log

## 配置 `vite.config.js`

```js
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
```
