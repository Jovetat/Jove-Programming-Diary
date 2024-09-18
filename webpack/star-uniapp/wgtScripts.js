// 脚本执行命令  yarn run build:wgt
const { exec } = require('child_process')
const fs = require('fs')
const archiver = require('archiver') // 用于压缩文件
const path = require('path')
const ftp = require('basic-ftp') // 用于建立 ftp 链接
const inquirer = require('inquirer') // 用于用户选择

const branchObj = {
  dev: {
    ftpInfo: {
      host: '116.196.73.177',
      user: 'homeTest',
      password: 'Aa123456',
      secure: false, // 如果使用安全连接，设置为 true
    },
    ftpFilePath: '/apks/devApks/',
  },
  test: {
    ftpInfo: {
      host: '116.196.73.177',
      user: 'homeTest',
      password: 'Aa123456',
      secure: false,
    },
    ftpFilePath: '/apks/testApks/',
  },
  release: {
    ftpInfo: {
      host: '116.196.73.177',
      user: 'Retirement',
      password: 'Aa123456',
      secure: false,
    },
    ftpFilePath: '/releaseApks/',
  },
  prod: {
    ftpInfo: {
      host: '116.196.73.177',
      user: 'Retirement',
      password: 'Aa123456',
      secure: false,
    },
    ftpFilePath: '/prodApks/',
  },
}
const projectRoot = path.resolve(__dirname) // 获取项目根目录路径

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

// 上传服务器
const ftpServer = async (outputPath, outputName, develop) => {
  const ftpInfo = branchObj[develop].ftpInfo
  const ftpFilePath = branchObj[develop].ftpFilePath
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

// 选择环境
const selectEnvironment = () => {
  return inquirer.default.prompt([
    {
      type: 'list',
      name: 'environment',
      message: '请选择要上传的环境:',
      default: 'dev',
      choices: ['no', 'dev', 'test', 'release', 'prod'],
    },
  ])
}

const build = () => {
  selectEnvironment().then((answer) => {
    const develop = answer.environment
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
        if (develop !== 'no') {
          ftpServer(outputPath, outputName, develop)
        }
      })
    })
  })
}
build()
