# 前端网页界面

该目录包含客户投诉分析系统的网页前端。

## 模块组成

1. **Web应用** (`app.py`) - Flask应用，提供Web界面和API接口
2. **HTML模板** (`templates/index.html`) - 主页面界面
3. **模板文件** (`templates/`) - HTML模板文件
4. **静态资源** (`static/`) - CSS, JavaScript等静态资源文件

## 功能说明

- 提供Web界面供用户输入音频URL或上传音频文件
- 调用后端音频处理服务将音频转换为文本
- 调用后端投诉分类服务对文本进行分类
- 展示处理结果，包括ASR文本、对话分段结果和分类结果

## 运行方式

```bash
python frontend/app.py
```

然后在浏览器中访问 `http://localhost:5000`

## 使用说明

1. 在输入框中输入音频URL或选择本地音频文件
2. 点击相应的"处理音频"按钮
3. 查看ASR文本、对话片段和分类结果

## API接口

- `GET /` - 返回主页面
- `POST /process_audio` - 处理音频URL并以JSON格式返回结果
- `POST /process_audio_file` - 处理上传的音频文件并以JSON格式返回结果

## 本地文件上传功能扩展说明

要支持本地文件上传，需要在后端实现以下功能：
1. 接收上传的文件
2. 将文件存储在可访问的位置
3. 生成文件的访问URL
4. 使用现有流程处理该URL

## 依赖项

- Flask
- Requests
- 主项目要求的其他依赖项