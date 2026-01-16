# 后端服务配置说明

## 概述

音频处理功能需要后端Flask服务支持。本文档说明如何配置和启动后端服务。

## 后端API配置

### 1. 配置API基础URL

编辑 `src/config/env.ts` 文件,设置正确的后端API地址:

```typescript
const envConfigs: Record<EnvType, EnvConfig> = {
  test: {
    baseURL: 'http://localhost:5000',  // 本地开发环境
  },
  online: {
    baseURL: 'http://your-production-api.com',  // 生产环境
  },
};
```

### 2. 后端服务依赖

后端服务需要以下Python模块:

- `core/audio_processor.py` - 音频处理核心模块
- `core/claim_llm_tag.py` - 分类标签处理模块
- `config/env.py` - 配置文件
- `prompts/` - 提示词模块

### 3. 启动后端服务

#### 方式一: 使用现有frontend的Flask服务

如果你想复用现有的Flask服务,可以直接启动:

```bash
cd /Users/jove/Lab/Jove-Programming-Diary/webpack/customer-complaint-check-main/frontend
python app.py
```

默认端口: 5000

#### 方式二: 创建独立的后端服务

如果需要独立的后端服务,可以创建新的Flask应用:

```bash
cd /Users/jove/Lab/Jove-Programming-Diary/webpack/customer-complaint-check-main
# 创建新的backend目录
mkdir -p backend
```

然后将以下API端点集成到你的后端服务中:

## 必需的API端点

### 1. POST /process_audio
处理音频URL

**请求体:**
```json
{
  "audio_url": "string"
}
```

**响应:**
```json
{
  "success": true,
  "asr_text": "string",
  "dialogue_segments": [
    {
      "role": "customer_service" | "visitor",
      "text": "string",
      "start": "string",
      "end": "string"
    }
  ],
  "complaint": {
    "domain": "string",
    "intent": "string",
    "intent_reasoning": "string",
    "third_level": "string"
  },
  "appeal": { /* 同上 */ },
  "solution": { /* 同上 */ },
  "reconciliation": {
    "status": "string",
    "reasoning": "string"
  }
}
```

### 2. POST /process_audio_file
处理上传的音频文件

**请求:** multipart/form-data with `audio_file`

**响应:** 同 `/process_audio`

### 3. GET /tag_options
获取标签选项

**响应:**
```json
{
  "success": true,
  "options": {
    "complaint": { "domain1": ["intent1", "intent2"] },
    "appeal": { /* 同上 */ },
    "solution": { /* 同上 */ },
    "reconciliation": { "status1": [], "status2": [] },
    "complaint_second_third_intent_map": { "intent1": ["slot1", "slot2"] },
    "appeal_second_third_intent_map": { /* 同上 */ },
    "solution_second_third_intent_map": { /* 同上 */ }
  }
}
```

### 4. POST /process_audio_for_correction
为修正功能处理音频(可选)

**请求体:**
```json
{
  "audio_url": "string"
}
```

**响应:**
```json
{
  "success": true,
  "dialogue_segments": [ /* 同上 */ ],
  "chat_text": "string"
}
```

## CORS配置

如果前后端分离部署,需要配置CORS:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://your-frontend-domain.com"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

## 环境变量配置

确保后端服务配置了以下环境变量(在 `config/env.py` 中):

- `FUNASR_BASE_URL` - FunASR服务地址
- `USE_AUDIO_PROXY` - 是否使用代理
- `AUDIO_PROXY_CONFIG` - 代理配置
- 各种标签映射配置

## 开发调试

### 前端开发服务器

```bash
cd manager-web
npm run dev
```

访问: http://localhost:5173/audio-processing

### 后端开发服务器

```bash
cd frontend
python app.py
```

或使用Flask开发模式:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

## 生产部署建议

1. **前端**: 使用 `npm run build` 构建静态文件,部署到Nginx或CDN
2. **后端**: 使用Gunicorn或uWSGI部署Flask应用
3. **反向代理**: 使用Nginx配置反向代理和负载均衡
4. **HTTPS**: 配置SSL证书,启用HTTPS

## 故障排查

### 问题1: 跨域错误
- 检查后端CORS配置
- 确认前端baseURL配置正确

### 问题2: API请求失败
- 检查后端服务是否启动
- 查看浏览器Network面板的请求详情
- 检查后端日志

### 问题3: 音频处理超时
- 增加axios timeout配置
- 检查FunASR服务状态
- 优化音频文件大小

## 联系支持

如有问题,请查看:
- 前端README: `src/page/AudioProcessing/README.md`
- 后端日志: `app.log`
