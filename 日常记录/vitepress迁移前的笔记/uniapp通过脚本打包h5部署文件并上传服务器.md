# uniapp通过脚本打包h5部署文件

### package.json 注册脚本

`wgtScripts.js` 位于文件根目录

```json
{
  "scripts": {
    "build:web": "node webScripts.mjs"
  }
}
```

### 编写脚本

1. 执行 `yarn build:h5` 打包资源文件
2. 将`dist/build/h5`打包路径内的文件递归上传服务器

环境要求：安装 `ora`

```
yarn add basic-ftp
yarn add ora
```

**webScripts.mjs**

```js
// 脚本执行命令  yarn run build:web
import { exec } from 'child_process'
import path from 'path'
import { Client } from 'basic-ftp'
import ora from 'ora'

const branchObj = {
  ftpInfo: {
     host: '116.****.****.****',
     user: '******',
     password: '*****',
     secure: false, // 如果使用安全连接，设置为 true
  },
  ftpFilePath: '/apks/devApks/',
}
const outputPath = 'dist/build/h5'

const projectRoot = path.resolve() // 获取项目根目录路径
// 上传服务器
const ftpServer = async () => {
  const ftpInfo = branchObj.ftpInfo
  const ftpFilePath = branchObj.ftpFilePath
  const client = new Client()
  client.ftp.verbose = true // 开启详细日志

  const uploadSpinner = ora('正在上传文件至 FTP 服务器...').start()

  try {
    await client.access(ftpInfo)
    console.log('FTP 连接成功')
    const localFilePath = path.join(projectRoot, outputPath)

    // 递归上传目录中的所有内容
    await client.uploadFromDir(localFilePath, ftpFilePath)
    uploadSpinner.succeed('文件上传成功')
  } catch (error) {
    uploadSpinner.fail('文件上传失败: ' + error)
    console.error('文件上传失败:', error)
  }

  client.close()
}

const build = () => {
  const command = 'yarn build:h5'
  const buildSpinner = ora('正在打包项目...').start()

  exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
    if (error) {
      buildSpinner.fail(`执行命令时出错: ${error}`)
      console.error(`执行命令时出错: ${error}`)
      return
    }
    buildSpinner.succeed('项目打包完成')
    ftpServer()
  })
}

build()
```
