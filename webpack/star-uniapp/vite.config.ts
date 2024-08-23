import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'
import Components from '@uni-helper/vite-plugin-uni-components'
import { NutResolver } from 'nutui-uniapp'
import AutoImport from 'unplugin-auto-import/vite'

const pathResolve = (dir: string): any => {
  return resolve(__dirname, '.', dir)
}
const alias: Record<string, string> = {
  '@': pathResolve('./src/'),
}

// https://vitejs.dev/config/
const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd())
  return {
    resolve: { alias },
    plugins: [
      Components({
        resolvers: [NutResolver()],
      }),
      uni(),
      AutoImport({
        imports: [
          'vue',
          'uni-app',
          'pinia',
          {
            'nutui-uniapp/composables': [
              // 在这里添加需要自动导入的API
              'useToast',
            ],
          },
        ],
      }),
    ],
    server: {
      port: 3001,
      open: true,
      proxy: {
        // 开发环境
        '/': {
          target: 'http://10.0.192.29:19000',
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            "@import '@/custom_theme.scss';@import 'nutui-uniapp/styles/variables.scss';",
        },
      },
    },
  }
})

export default viteConfig
