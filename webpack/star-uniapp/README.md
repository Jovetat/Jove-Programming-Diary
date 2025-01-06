## 项目集成

- [x] `vite` + `vue3.3` + `pina` + `nuiui`
- [x] `sass`
- [x] `git` 代码提交规范

## 参考资料

- [uniapp官网](https://uniapp.dcloud.net.cn/quickstart-cli.html)
- [vite官网](https://cn.vitejs.dev/)
- [vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)
- [pina](https://pinia.vuejs.org/)
- [nuiui](https://nutui-uniapp.netlify.app/components/basic/button.html)
- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [1万字！uni-app+vue3.2+ts+vite大杂烩实战](https://juejin.cn/post/7148008686911225864)
- [https://juejin.cn/post/7244192313844154424](https://juejin.cn/post/7244192313844154424)
- [Vue3 + typescript + vite + pinia+ mock框架](https://ext.dcloud.net.cn/plugin?id=13525)

## 全局样式

`主题配置`:src\custom_theme.scss
`全局公共样式`:src\utils\global.scss

## 项目结构

├─ dist # 打包文件
├─ node_modules # 项目依赖的第三方模块和库
├─ src # 源代码目录，包含项目的主要代码
├──── common # 公共资源和模块
├─────── iconfont # 字体图标文件，阿里巴巴图标库
├──── components # 自定义组件
├──── pages # 页面组件
├──── service # 服务层，接口请求
├──── static # 静态资源，例如图片、样式文件等
├──── store # Pinia 状态管理
├──── types # TypeScript 类型定义文件
├──── uni_modules # UniApp 特定的模块和插件
├──── utils # 公共函数、样式
├──── App # 主应用组件
├──── custom_theme # 自定义主题样式自定义主题样式
├──── env.d.ts # 为ts提供类型声明
├──── main # 应用的入口文件
├──── manifest # 应用的配置信息，包含应用的基本信息和权限设置
├──── pages # 页面路由配置
├──── shime-uni.d.ts # TypeScript 的类型定义文件
├─ unpackage # 打包文件
├─ env # 环境配置文件夹
├─ eslintignore # ESLint 忽略文件
├─ eslintrc # ESLint 配置文件
├─ .gitignore # Git 忽略文件
├─ .prettierignore # Prettier 忽略文件
├─ .prettierrc # Prettier 配置文件
├─ auto-imports.d # 自动导入的定义文件
├─ commitlint.config # : Commitlint 配置文件，提交信息的格式检查规则
├─ components.d # 组件类型定义文件
├─ index # 应用程序的入口
├─ package # 包管理器
├─ shims-uni.d # 声明特定的全局类型
├─ tsconfig # TypeScript 配置文件
├─ vite.config # Vite 配置文件
├─ wgtScripts # 自动化打包wgt与上传脚本

## 规范

### git 提交规范

1. `feature` 新功能（feature）
2. `bug` 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
3. `fix` 修补bug
4. `ui` 更新 ui
5. `docs` 文档（documentation）
6. `style` 格式（不影响代码运行的变动）
7. `perf` 性能优化
8. `release` 发布
9. `deploy` 部署
10. `refactor` 重构（即不是新增功能，也不是修改bug的代码变动）
11. `test` 增加测试
12. `chore` 构建过程或辅助工具的变动
13. `revert` feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
14. `merge` 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
15. `build` 打包

### debug 提交规范

1. fix:`pingcode bug号` +` 更改内容`
2. pingcode 评论影响范围

### 开发规范

1. 代码命名与注释

- 变量和函数命名应清晰简洁，遵循驼峰命名法
- 添加必要的注释，帮助理解代码逻辑

2. 代码清理与维护

- 重构或功能调整后，及时删除无用代码
- 定期进行代码审查，保持代码质量

3. 公共组件管理

- 修改公共组件需团队讨论，达成一致后再进行
- 公共组件设计前收集团队需求，确保易于维护

4. 代码复用与封装

- 遇到重复功能，务必进行封装，避免冗余
- 遵循模块化开发原则，提升可维护性

5. 开发流程与协作

- 开发前进行需求分析，确保理解无误
- 使用项目管理工具跟踪任务进度
- 代码合并需通过审查，确保无冲突，严格版本控制

6. 性能与安全

- 慎用定时器，避免内存泄漏等问题
- 优化渲染性能，提升用户体验
