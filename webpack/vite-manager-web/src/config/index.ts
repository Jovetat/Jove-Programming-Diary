/**
 * 配置入口
 */

import localConfig from './local.config';
import productionConfig from './production.config';
// production.config 依赖 apollo.config.js（构建时由插件请求）。

// 统一的配置类型（以本地配置为基准，生产配置结构保持一致）
export type AppConfig = typeof localConfig;

// import.meta.env.PROD 在 vite build 时为 true，vite dev 时为 false
const appConfig: AppConfig = import.meta.env.PROD
  ? productionConfig
  : localConfig;

export default appConfig;
