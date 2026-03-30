/**
 * 开发环境本地配置
 *
 * 仅在 vite dev 时生效（由 src/config/index.ts 按环境切换）。
 *
 * 切换测试环境：修改 environment 变量值即可，所有域名自动更新。
 *   '1test' → http://quality-control-1test.tjzimu.com
 *   'test'  → http://quality-control-test.tjzimu.com
 */

// 当前测试环境标识，修改此处即可一键切换测试环境
const environment = '1test';

// ─── 本项目请求地址 ──────────────────────────────────────────────────────────

const lawUrgeUrl = `http://quality-control-${environment}.tjzimu.com`;

// ─── 导出（结构与 production.config.ts 保持一致） ────────────────────────────
export default {
  lawUrgeUrl, // 法催作业 API
};
