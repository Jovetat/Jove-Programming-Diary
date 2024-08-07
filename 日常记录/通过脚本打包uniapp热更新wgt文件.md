# 通过脚本打包uniapp热更新wgt文件

**前言**：uniapp只能通过hbuilder打包wgt文件

**目标**：通过脚本命令打包wgt文件

### 实现思路

uniapp官方文档已经提供了wgt文件的的生成思路：

目前使用`npm run build:app-plus`会在`/dist/build/app-plus`下生成app打包资源。如需制作wgt包，将`app-plus`中的文件压缩成zip（注意：不要包含`app-plus目录`），再重命名为`${appid}.wgt`， `appid`为`manifest.json`文件中的`appid`

### package.json 注册脚本

`wgtScripts.js` 位于文件根目录

```json
{
  "scripts": {
    "build:wgt": "node wgtScripts.js"
  }
}
```

### 编写脚本

1. 执行 `uni build -p app` 打包资源文件
2. 读取`src/manifest.json`中的版本号
3. 在回调中通过`archiver`库压缩文件
4. 重命名，并将文件放置`dist` 目录下

环境要求：安装 `archiver`

```
yarn add archiver
```

**wgtScripts.js**

```js
// 脚本执行命令  yarn run build:wgt
const { exec } = require('child_process')
const fs = require('fs')
const archiver = require('archiver') // 用于压缩文件
const path = require('path')

// 获取项目根目录路径
const projectRoot = path.resolve(__dirname)
// 定义要执行的命令，打包 uniapp wgt 资源
const command = 'uni build -p app'

// 获取版本号
const getVersionName = () => {
  // 读取 manifest.json 中的版本号
  const manifestPath = path.resolve(__dirname, 'src/manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  return manifest.versionName
}
// 将资源文件打压缩包
const compress = () => {
  const versionName = getVersionName()
  console.log('版本号: ', versionName)
  // 定义要打包的目录和输出的压缩包文件名
  const outputDirectory = path.resolve(__dirname, 'dist/build/app')
  const outputZip = path.resolve(__dirname, `dist/star-site-${versionName}.wgt`)
  const output = fs.createWriteStream(outputZip)
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
  })
  // 监听所有 archive 数据已写入完成事件
  output.on('close', () => {
    console.log(`wgt已创建，总共 ${archive.pointer()} 字节`)
  })
  // 监听压缩过程中出现的警告（例如压缩过程中的可恢复错误）
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn(err)
    } else {
      throw err
    }
  })
  // 监听压缩过程中出现的错误
  archive.on('error', (err) => {
    throw err
  })
  // 连接 archive 流和输出流
  archive.pipe(output)
  // 将指定目录中的内容添加到压缩包中
  archive.directory(outputDirectory, false)
  // 完成压缩
  archive.finalize()
}

const build = () => {
  // 1. 执行命令
  exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
    // uniapp 打包完成的回调
    if (error) {
      console.error(`执行命令时出错: ${error}`)
      return
    }
    // 2. 压缩 wgt 文件
    compress()
  })
}
build()
```

#### 在根目录中执行`yarn run build:wgt`即可获得wgt文件

### 优化：打包完成通过 ftp 上传服务器

1. 在文件压缩后建立ftp链接
2. 向对应目录传递文件

环境要求：安装 `archiver basic-ftp` 

```
yarn add archiver
yarn add basic-ftp
```

**wgtScripts.js**

```js
// 脚本执行命令  yarn run build:wgt
const { exec } = require('child_process')
const fs = require('fs')
const archiver = require('archiver') // 用于压缩文件
const path = require('path')
const ftp = require('basic-ftp') // 用于建立 ftp 链接

// 获取项目根目录路径
const projectRoot = path.resolve(__dirname)
// 定义要执行的命令，打包 uniapp wgt 资源
const ftpInfo = {
  host: '116.196.73.177',
  user: 'homeTest',
  password: 'fmcfHxpRFWbDS7nB',
  secure: false, // 如果使用安全连接，设置为 true
}
const ftpFilePath = '/apks/'

// 获取版本号
const getVersionName = () => {
  // 读取 manifest.json 中的版本号
  const manifestPath = path.resolve(__dirname, 'src/manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  return manifest.versionName
}
// 将资源文件打压缩包
const compress = (callback) => {
  const versionName = getVersionName()
  console.log('版本号: ', versionName)
  // 定义要打包的目录和输出的压缩包文件名
  const outputDirectory = path.resolve(__dirname, 'dist/build/app')
  const outputName = `star-site-${versionName}.wgt`
  const outputPath = `dist/${outputName}`
  const outputZip = path.resolve(__dirname, outputPath)
  const output = fs.createWriteStream(outputZip)
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
  })
  // 监听所有 archive 数据已写入完成事件
  output.on('close', () => {
    console.log(`wgt已创建，总共 ${archive.pointer()} 字节`)
    callback && callback(outputPath, outputName)
  })
  // 监听压缩过程中出现的警告（例如压缩过程中的可恢复错误）
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn(err)
    } else {
      throw err
    }
  })
  // 监听压缩过程中出现的错误
  archive.on('error', (err) => {
    throw err
  })
  // 连接 archive 流和输出流
  archive.pipe(output)
  // 将指定目录中的内容添加到压缩包中
  archive.directory(outputDirectory, false)
  // 完成压缩
  archive.finalize()
}

const ftpServer = async (outputPath, outputName) => {
  const client = new ftp.Client()
  client.ftp.verbose = true // 开启详细日志

  try {
    // 连接到 FTP 服务器
    await client.access(ftpInfo)
    console.log('FTP 连接成功')
    // 指定本地文件路径和远程上传路径
    const localFilePath = path.resolve(__dirname, outputPath)
    const remoteFilePath = `${ftpFilePath}${outputName}`

    // 上传文件
    await client.uploadFrom(localFilePath, remoteFilePath)
    console.log('文件上传成功')
  } catch (error) {
    console.error('文件上传失败:', error)
  }

  client.close() // 关闭连接
}

const build = () => {
  const command = 'uni build -p app'
  // 1. 执行命令
  exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
    // uniapp 打包完成的回调
    if (error) {
      console.error(`执行命令时出错: ${error}`)
      return
    }
    // 2. 压缩 wgt 文件
    compress((outputPath, outputName) => {
      // 3. 上传服务器
      ftpServer(outputPath, outputName)
    })
  })
}
build()
```

