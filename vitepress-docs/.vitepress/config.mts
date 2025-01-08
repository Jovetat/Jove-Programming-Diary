import { defineConfig } from 'vitepress'
import { set_sidebar } from '../utils/auto_sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Jove docs',
  description: "Jove's daily learning record",
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '../public/logo.png',
      },
    ],
  ],
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

    // 设置搜索框
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Jovetat' }],

    footer: {
      copyright: 'Copyright © 2022-present Jove',
    },
  },
})
