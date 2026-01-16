该代码主要用于实现客诉打标，包含三大主要功能
- 客诉音频数据批量打标
- 打标结果自动评测和分析
- AI打标系统Web服务

# 代码结构

```
customer-complaint-check/
├── README.md
├── core/                         # 核心业务逻辑
│   ├── __init__.py
│   ├── claim_llm_tag.py          # 主要处理逻辑（大模型打标签）
│   └── audio_processor.py        # 音频处理逻辑（语音转文本）
├── frontend/                     # 前端Web界面
│   ├── __init__.py
│   ├── app.py                    # Flask Web应用
│   ├── static/                   # 静态资源文件
│   └── templates/                # HTML模板
├── prompts/                      # 提示词模板
│   ├── __init__.py
│   ├── basis_prompts.py          # 判断依据提示词模板
│   ├── complaint_prompts.py      # 诉点提示词模板
│   ├── appeal_prompts.py         # 诉求提示词模板
│   ├── solution_prompts.py       # 解决方案提示词模板
│   └── reconciliation_prompts.py # 解决状态提示词模板
├── scripts/                      # 可执行脚本
│   ├── __init__.py
│   ├── process_excel.py          # 客诉音频数据批量打标(单线程)
│   ├── process_excel_parallel.py # 客诉音频数据批量打标(多线程)
│   ├── data_analysis_2.0.py      # 打标结果自动评测和分析
│   └── audio_text_classifier.py  # 音频处理和标签分类脚本
├── tag_analysis/                 # 标签分析脚本
│   ├── classification_analysis.py     # 分类性能分析
│   └── domain_intent_distribution.py  # 领域意图分布分析
├── config/                       # 配置文件
└── tests/                        # (预留) 测试代码
```

# 环境配置
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh # 如果没有安装uv，首先安装
uv sync # 同步依赖并创建虚拟环境.venv
source .venv/bin/activate # 激活虚拟环境
```

# 启动模型服务
1. FunASR模型
```bash
# 拉取FunASR代码
git clone http://git.quantgroup.cn/ailab/funasr.git
基于开源funasr对左右声道进行分离转文本

# 配置环境
cd funasr/runtime/python/http
pip install -r requirements.txt

# 启动服务
python server.py --port 8010
```

2. Qwen3-14B模型
```bash
python -m vllm.entrypoints.openai.api_server \
  --model /data/disk3/duanxunrui/models/qwen3_14b \
  --served-model-name Qwen3-14B \
  --trust-remote-code \
  --tensor-parallel-size 1 \
  --gpu-memory-utilization 0.85 \
  --max-model-len 40960 \
  --host 0.0.0.0 \
  --port 8012 \
  --uvicorn-log-level debug \
  --log-error-stack
```


# 使用方法

## 1. 客诉音频数据批量打标

该模块用于处理Excel格式文档中的贷款客户与客服对话数据，通过调用大模型API自动提取对话内容的诉点、诉求、解决方案、解决状态标签。

1. 单线程处理脚本：
```bash
# 使用方法
python scripts/process_excel.py input.xlsx output.xlsx
# 具体例子
python scripts/process_excel.py data/benchmark_10.xlsx data/benchmark_10_promptv1.3.xlsx
```

2. 多线程处理脚本：
```bash
# 使用方法
python scripts/process_excel.py input.xlsx output.xlsx --workers 10
# 具体例子
python scripts/process_excel_parallel.py data/benchmark_10.xlsx data/benchmark_10_promptv1.3.xlsx  --workers 10
```

处理完成后，将在指定位置生成带有相应标签的新Excel文件


## 2. 打标结果自动评测和分析

用来对AI打标结果进行详细分析，包括整体和每个类别的准确率、精确率、召回率等指标，并生成混淆矩阵和热力图：

```bash
python scripts/data_analysis_2.0.py data/benchmark_1800_taggedv1.5_promptv1.3.xlsx
```

## 3. AI打标系统Web服务
AI打标系统Web服务包含：
- 单个音频打标（可以输入URL或本地音频文件）
- 标签修正：传入模型打标后的excel，人工修正标签
- 标签评估：评测打标结果
- 文件浏览：可视化服务器本地的音频

```bash
python frontend/app.py
```

然后在浏览器中访问 `http://localhost:5000`


# 客诉标签体系（诉点举例）

## 一级标签（诉点领域）
- 催收业务
- 息费业务
- 征信业务
- 其他业务

## 二级标签（诉点意图）

### 催收业务下的意图类别：
- 催收违规
- 催收咨询
- 催收其他

### 息费业务下的意图类别：
- 息费争议
- 协商还款
- 息费其他

### 征信业务下的意图类别：
- 征信异议
- 征信其他

### 其他业务下的意图类别：
- 还款异常
- 资料办理
- 其他

详细的标签体系见：[客诉业务标签体系V1.0](https://xf4owgfh43k.sg.larksuite.com/wiki/QMaxwnBF5iYbIIkImhIlqoX7gIc?sheet=9847c2)