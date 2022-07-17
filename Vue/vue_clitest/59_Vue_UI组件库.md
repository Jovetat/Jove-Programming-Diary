## Vue UI 组件库

#### 移动端常用 UI 组件库
    1. Vant
        https://youzan.github.io/vant-weapp/#/home
    2. Cube UI
        https://didi.github.io/cube-ui/#/zh-CN
    3. Mint UI
        https://mint-ui.github.io/#!/zh-cn

#### PC 端常用 UI 组件库
    1. Element UI
        https://element.eleme.cn/#/zh-CN
    2. IView UI
        https://www.iviewui.com/

#### Element UI
    0. 案例在 src 内，为了方便 src 就不命名(59_src_UI组件库)了
    1. 根据文档组件部分使用
        https://element.eleme.cn/#/zh-CN/component/installation
    2. npm i element-ui
    3. 完整引入的使用方式(全部引入)
```js
// 在 main.js 中写入:
// 引入 Element UI
import ElementUI from 'element-ui'
// 引入 Element UI 全部样式
import 'element-ui/lib/theme-chalk/index.css'
// 应用 Element UI
Vue.use(ElementUI)
```
        4) 在文档组件中选择喜欢的样式
        5) 将选好的组件代码复制过来
```html
<el-button type="primary" plain>主要按钮</el-button>
<div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
        v-model="value1"
        type="date"
        placeholder="选择日期">
    </el-date-picker>
</div>
```
```js
// 日期选择的相关代码
data() {
    return {
        pickerOptions: {
        disabledDate(time) {
            return time.getTime() > Date.now();
        },
        shortcuts: [{
            text: '今天',
            onClick(picker) {
            picker.$emit('pick', new Date());
            }
        }, {
            text: '昨天',
            onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
            }
        }, {
            text: '一周前',
            onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
            }
        }]
        },
        value1: '',
        value2: '',
    };
}
```
        6) 每个组件文档的最下方会有详解的 API 说明具体参数对应的不同内容
    4. 按需引入的使用方式(全部引入文件会很大)
        1) 借助 babel-plugin-component，可以只引入需要的组件，以达到减小项目体积的目的
        2) 安装 babel-plugin-component
            npm install babel-plugin-component -D
            (-D 指开发依赖)
        3) 将 babel.config.js 追加修改为：
```js
    module.exports = {
      presets: [
          '@vue/cli-plugin-babel/preset',
          ["@babel/preset-env", { "modules": false }]
      ],
      plugins: [
          [
              "component",
              {
                  "libraryName": "element-ui",
                  "styleLibraryName": "theme-chalk"
              }
          ]
      ]
    }
```
        4) 引入所需组件
```js
    // 在 main.js 中写入以下内容：
    // 1. 按需引入,按组件名去掉 el 并按大驼峰命名
    import { Button, DatePicker } from 'element-ui'
    // 2. 注册全局组件
    // 3. 官方的命名：name 属性为组件对应名称 DatePicker --> el-date-picker 
    // 4. 可自己起名 Vue.component('joves-button', Button)，在页面使用对应组件标签即可
    Vue.component(Button.name, Button)
    Vue.component(DatePicker.name, DatePicker)
    /* 或写为
     * Vue.use(Button)
     * Vue.use(DatePicker)
    */
```
        5) 使用了 babel-plugin-component 会自动引入用到的样式