import { defineConfig } from 'vitepress'
import { set_sidebar } from '../utils/auto_sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Jove docs',
  description: "Jove's daily learning record",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '../public/logo.png',
    outlineTitle: '文章目录',
    outline: [2, 6], // 侧边栏显示的层级
    nav: [
      { text: '首页', link: '/' },
      {
        text: '笔记',
        items: [
          {
            text: '组件',
            link: '/docs/component/vue 双向绑定数据的时间范围组件',
          },
          {
            text: '函数',
            link: '/docs/function/vue 全局指令实现节流',
          },
          {
            text: 'js 脚本',
            link: '/docs/js-script/js导出EXCEL表格(基于ExcelJS,支持表头说明和合计)',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: '组件',
        items: set_sidebar('/docs/component'),
      },
      {
        text: '函数',
        items: set_sidebar('/docs/function'),
      },
      {
        text: 'js 脚本',
        items: set_sidebar('/docs/js-script'),
      },
      {
        text: '其他',
        items: set_sidebar('/docs/other'),
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/Jovetat' }],

    footer: {
      copyright: 'Copyright © 2022-present Jove',
    },
  },
})
