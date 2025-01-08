# 配置 Prettier 在 VSCode 中自动格式化代码的教程

## 1. 安装 Prettier VSCode 插件

1. 打开 VSCode。
2. 点击左侧活动栏的扩展市场图标（或按 `Ctrl+Shift+X`）。
3. 在搜索栏中输入 `Prettier - Code formatter`。
4. 找到插件并点击 `Install` 安装它。

## 2. 配置 VSCode 设置

确保 VSCode 配置正确，使其在保存文件时自动格式化代码：

1. 打开 VSCode 设置文件（按 `Ctrl + ,` 或 `Cmd + ,`）。
2. 选择右上角的 `{}` 图标，打开 `settings.json` 文件。
3. 添加以下配置：

```json
// prettier vscode格式化选型配置
"editor.defaultFormatter": "esbenp.prettier-vscode", // 默认的代码格式化工具
"[javascript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[typescript]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[typescriptreact]": {
"editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[vue]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"[json]": {
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
},
"prettier.configPath": ".prettierrc", // 使用项目的配置(注释则使用vscode的配置)
"prettier.arrowParens": "always",
"prettier.bracketSpacing": true,
"prettier.endOfLine": "lf",
"prettier.printWidth": 80,
"prettier.tabWidth": 2,
"prettier.trailingComma": "all",
"prettier.semi": false,
"prettier.singleQuote": true,
```

## 3. 确保 Prettier 配置文件正确

在你的项目根目录下创建或检查 `.prettierrc` 文件，并确保其配置正确。例如：

`.prettierrc`：

```json
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "all",
  "htmlWhitespaceSensitivity": "ignore"
}
```

如果需要忽略某些文件或文件夹，可以创建 `.prettierignore` 文件：

`.prettierignore`：

```
node_modules
dist
```

## 4. 重启 VSCode

有时重启 VSCode 可以解决插件未正确加载的问题。重启 VSCode 后，保存文件时应自动格式化代码。

## 项目中引入 prettier

```
yarn add prettier
```

## 全局代码风格化

```
yarn prettier --write
```
