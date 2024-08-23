// 存放和安卓交互的代码

export const sendError = (msg: string, callback?: Function) => {
  const systemInfo = uni.getSystemInfoSync()
  if (systemInfo.uniPlatform !== 'web') {
    const settingModule = uni.requireNativePlugin('SettingModule')
    settingModule.sendError(msg, () => {
      callback && callback()
    })
  } else {
    callback && callback()
  }
}
