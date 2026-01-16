import pandas as pd
import requests
import json
from typing import Dict, List, Tuple
import sys
import os
import time

# Add the parent directory to the path to allow importing from prompts
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import AudioProcessor
from core.audio_processor import AudioProcessor

# Import complaint prompt templates
from prompts import (
    COMPLAINT_DOMAIN_PROMPT_TEMPLATE,
    COMPLAINT_COLLECTION_INTENT_PROMPT_TEMPLATE,
    COMPLAINT_FEE_INTENT_PROMPT_TEMPLATE,
    COMPLAINT_CREDIT_INTENT_PROMPT_TEMPLATE,
    COMPLAINT_OTHER_INTENT_PROMPT_TEMPLATE,
    COMPLAINT_COLLECTION_VIOLATION_PROMPT_TEMPLATE,
    COMPLAINT_COLLECTION_CONSULT_PROMPT_TEMPLATE,
    COMPLAINT_FEE_DISPUTE_PROMPT_TEMPLATE,
    COMPLAINT_FEE_NEGOTIATION_PROMPT_TEMPLATE,
    COMPLAINT_CREDIT_DISPUTE_PROMPT_TEMPLATE,
    COMPLAINT_FEE_PAYMENT_EXCEPTION_PROMPT_TEMPLATE,
    COMPLAINT_DOCUMENT_PROCESSING_PROMPT_TEMPLATE,
)
# Import reconciliation prompt templates
from prompts import (
    RECONCILIATION_PROMPT_TEMPLATE
)
# Import solution prompt templates
from prompts import (
    SOLUTION_DOMAIN_PROMPT_TEMPLATE,
    SOLUTION_COLLECTION_INTENT_PROMPT_TEMPLATE,
    SOLUTION_FEE_INTENT_PROMPT_TEMPLATE,
    SOLUTION_CREDIT_INTENT_PROMPT_TEMPLATE,
    SOLUTION_OTHER_INTENT_PROMPT_TEMPLATE,
    SOLUTION_STOP_COLLECTION_PROMPT_TEMPLATE,
    SOLUTION_REFUND_COMPENSATE_PROMPT_TEMPLATE,
    SOLUTION_REPAYMENT_NEGOTIATION_PROMPT_TEMPLATE,
    SOLUTION_COMFORT_APOLOGY_PROMPT_TEMPLATE,
    SOLUTION_DOCUMENT_PROCESSING_PROMPT_TEMPLATE,
    SOLUTION_UPGRADE_FEEDBACK_PROMPT_TEMPLATE
)
# Import appeal prompt templates
from prompts import (
    APPEAL_DOMAIN_PROMPT_TEMPLATE,
    APPEAL_COLLECTION_INTENT_PROMPT_TEMPLATE,
    APPEAL_FEE_INTENT_PROMPT_TEMPLATE,
    APPEAL_CREDIT_INTENT_PROMPT_TEMPLATE,
    APPEAL_OTHER_INTENT_PROMPT_TEMPLATE,
    APPEAL_STOP_COLLECTION_PROMPT_TEMPLATE,
    APPEAL_REFUND_COMPENSATE_PROMPT_TEMPLATE,
    APPEAL_REPAYMENT_NEGOTIATION_PROMPT_TEMPLATE,
    APPEAL_COMFORT_APOLOGY_PROMPT_TEMPLATE,
    APPEAL_DOCUMENT_PROCESSING_PROMPT_TEMPLATE
)
# Import basis prompt templates
from prompts import (
    COMPLAINT_BASIS_PROMPT_TEMPLATE,
    APPEAL_BASIS_PROMPT_TEMPLATE,
    SOLUTION_BASIS_PROMPT_TEMPLATE
)
from config.env import MODEL_API_URL, MODEL_NAME, COMPLAINT_DOMAIN_INTENT_MAP, COMPLAINT_SECOND_THIRD_INTENT_MAP, \
    RECONCILIATION_INTENT_MAP, SOLUTION_DOMAIN_INTENT_MAP, SOLUTION_SECOND_THIRD_INTENT_MAP, APPEAL_DOMAIN_INTENT_MAP, \
    APPEAL_SECOND_THIRD_INTENT_MAP


def read_excel(file_path: str) -> pd.DataFrame:
    """
    读取Excel文件

    Args:
        file_path: Excel文件路径

    Returns:
        DataFrame: 包含数据的DataFrame
    """
    df = pd.read_excel(file_path)
    return df


class TagProcessorBase:
    def __init__(self, api_url: str, model_name: str):
        """
        初始化处理器
        """
        self.api_url = api_url
        self.model_name = model_name

    def call_llm(self, prompt: str) -> str:
        """
        调用大模型API

        Args:
            prompt: 发送给大模型的提示词

        Returns:
            str: 大模型返回的结果
        """
        headers = {
            "Content-Type": "application/json"
        }

        data = {
            "model": self.model_name,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "max_tokens": 200,  # 增加最大输出长度以容纳JSON格式
            "stop": ["\n\n"],  # 调整停止词以适应JSON输出
            "chat_template_kwargs": {"enable_thinking": False}
        }

        try:
            start_time = time.time()
            response = requests.post(self.api_url, headers=headers, data=json.dumps(data))
            end_time = time.time()

            elapsed_time = end_time - start_time
            print(f"大模型API调用耗时: {elapsed_time:.2f} 秒")

            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                print(f"API调用失败，状态码：{response.status_code}")
                return ""
        except Exception as e:
            print(f"调用大模型API时出错：{e}")
            return ""


class ComplaintTagProcessor(TagProcessorBase):
    def __init__(self):
        """
        初始化投诉标签处理器
        """
        super().__init__(MODEL_API_URL, MODEL_NAME)

        # 定义投诉标签体系
        self.complaint_domain_intent_map = COMPLAINT_DOMAIN_INTENT_MAP
        self.complaint_second_third_intent_map = COMPLAINT_SECOND_THIRD_INTENT_MAP

    def extract_domain_prompt(self, text: str) -> str:
        """
        构造提取投诉类型标签的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本

        Returns:
            str: 构造的提示词
        """
        prompt = COMPLAINT_DOMAIN_PROMPT_TEMPLATE.format(text=text)
        return prompt

    def extract_intent_prompt(self, text: str, domain: str) -> str:
        """
        构造提取具体投诉原因的提示词（二级标签）

        Args:
            text: 需要分析的贷款客户与客服对话文本
            domain: 已确定的投诉类型（一级标签）

        Returns:
            str: 构造的提示词
        """
        # 根据不同投诉类型选择不同的意图prompt模板
        if domain == "催收业务":
            prompt = COMPLAINT_COLLECTION_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "息费业务":
            prompt = COMPLAINT_FEE_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "征信业务":
            prompt = COMPLAINT_CREDIT_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "其他业务":
            prompt = COMPLAINT_OTHER_INTENT_PROMPT_TEMPLATE.format(text=text)
        else:  # 默认使用其他业务模板
            prompt = COMPLAINT_OTHER_INTENT_PROMPT_TEMPLATE.format(text=text)

        return prompt

    def extract_third_level_prompt(self, text: str, intent: str) -> str:
        """
        构造提取具体投诉原因的提示词（三级标签）

        Args:
            text: 需要分析的贷款客户与客服对话文本
            intent: 已确定的二级标签

        Returns:
            str: 构造的提示词
        """
        # 根据不同二级标签选择不同的三级标签prompt模板
        if intent == "催收违规":
            prompt = COMPLAINT_COLLECTION_VIOLATION_PROMPT_TEMPLATE.format(text=text)
        elif intent == "催收咨询":
            prompt = COMPLAINT_COLLECTION_CONSULT_PROMPT_TEMPLATE.format(text=text)
        elif intent == "息费争议":
            prompt = COMPLAINT_FEE_DISPUTE_PROMPT_TEMPLATE.format(text=text)
        elif intent == "协商还款":
            prompt = COMPLAINT_FEE_NEGOTIATION_PROMPT_TEMPLATE.format(text=text)
        elif intent == "征信异议":
            prompt = COMPLAINT_CREDIT_DISPUTE_PROMPT_TEMPLATE.format(text=text)
        elif intent == "还款异常":
            prompt = COMPLAINT_FEE_PAYMENT_EXCEPTION_PROMPT_TEMPLATE.format(text=text)
        elif intent == "资料办理":
            prompt = COMPLAINT_DOCUMENT_PROCESSING_PROMPT_TEMPLATE.format(text=text)
        else:
            # 如果没有对应的三级标签，返回空字符串
            return ""

        return prompt

    def extract_basis_prompt(self, text: str, domain: str, intent: str, third_level: str) -> str:
        """
        构造提取诉点分类整体依据的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本
            domain: 一级标签
            intent: 二级标签
            third_level: 三级标签

        Returns:
            str: 构造的提示词
        """
        prompt = COMPLAINT_BASIS_PROMPT_TEMPLATE.format(
            text=text,
            domain=domain,
            intent=intent,
            third_level=third_level
        )
        return prompt

    def parse_domain_result(self, llm_output: str) -> str:
        """
        解析投诉类型识别结果(一级标签)

        Args:
            llm_output: 大模型返回的原始结果

        Returns:
            str: 解析后的投诉类型
        """
        # 去除可能的空白字符和标点符号
        cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

        # 如果直接匹配到标准标签，则返回
        if cleaned_output in self.complaint_domain_intent_map:
            return cleaned_output

        # 尝试模糊匹配
        for domain in self.complaint_domain_intent_map.keys():
            if domain in cleaned_output:
                return domain

        # 默认返回"其他业务"
        return "其他业务"

    def parse_intent_result(self, llm_output: str, domain: str) -> Tuple[str, str]:
        """
        解析具体投诉原因识别结果(二级标签)

        Args:
            llm_output: 大模型返回的原始结果
            domain: 投诉类型(一级标签)

        Returns:
            tuple: (二级标签, 判断依据)
        """
        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "")
            reasoning = result.get("reasoning", "")

            # 获取该领域下的意图列表
            intent_list = self.complaint_domain_intent_map.get(domain, [])

            # 验证标签是否有效
            if label in intent_list:
                return label, reasoning
            else:
                return intent_list[0] if intent_list else "其他", reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用原来的解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 获取该领域下的意图列表
            intent_list = self.complaint_domain_intent_map.get(domain, [])

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in intent_list:
                return cleaned_output, ""

            # 尝试模糊匹配
            for intent in intent_list:
                if intent in cleaned_output:
                    return intent, ""

            # 默认返回该领域下的第一个意图或"其他"
            return intent_list[0] if intent_list else "其他", ""

    def parse_third_level_result(self, llm_output: str, second_level: str) -> Tuple[str, str]:
        """
        解析具体投诉原因识别结果(三级标签)

        Args:
            llm_output: 大模型返回的原始结果
            second_level: 二级标签

        Returns:
            tuple: (三级标签, 判断依据)
        """
        # 检查是否有对应的三级标签
        if second_level not in self.complaint_second_third_intent_map:
            # 如果没有对应的三级标签，返回空值
            return "", ""

        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "")
            reasoning = result.get("reasoning", "")

            # 获取该二级标签下的三级标签列表
            intent_list = self.complaint_second_third_intent_map.get(second_level, [])

            # 验证标签是否有效
            if label in intent_list:
                return label, reasoning
            else:
                return intent_list[0] if intent_list else "", reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用默认解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 获取该二级标签下的三级标签列表
            intent_list = self.complaint_second_third_intent_map.get(second_level, [])

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in intent_list:
                return cleaned_output, ""

            # 尝试模糊匹配
            for intent in intent_list:
                if intent in cleaned_output:
                    return intent, ""

            # 默认返回该二级标签下的第一个三级标签或空
            return intent_list[0] if intent_list else "", ""

    def parse_basis_result(self, llm_output: str) -> str:
        """
        解析诉点分类整体依据结果

        Args:
            llm_output: 大模型返回的原始结果

        Returns:
            str: 整体分类依据
        """
        # 直接返回模型输出作为整体依据
        return llm_output.strip()

    def process_single_row(self, text: str) -> Tuple[str, str, str, str]:
        """
        处理单条数据，提取投诉类型和具体原因(支持三级标签)

        Args:
            text: 贷款客户与客服对话文本

        Returns:
            tuple: (一级标签, 二级标签, 三级标签, 标签依据)
        """
        # 第一步：提取一级标签
        domain_prompt = self.extract_domain_prompt(text)
        domain_result = self.call_llm(domain_prompt)
        domain = self.parse_domain_result(domain_result)

        # 第二步：根据一级标签提取二级标签
        intent_prompt = self.extract_intent_prompt(text, domain)
        intent_result = self.call_llm(intent_prompt)
        intent, intent_reasoning = self.parse_intent_result(intent_result, domain)

        # 第三步：根据二级标签提取三级标签
        third_level_prompt = self.extract_third_level_prompt(text, intent)
        if third_level_prompt:  # 只有当存在三级标签时才进行提取
            third_level_result = self.call_llm(third_level_prompt)
            third_level, third_level_reasoning = self.parse_third_level_result(third_level_result, intent)
        else:
            third_level, third_level_reasoning = "", ""

        # 第四步：提取整体分类依据
        basis_prompt = self.extract_basis_prompt(text, domain, intent, third_level)
        basis_result = self.call_llm(basis_prompt)
        basis = self.parse_basis_result(basis_result)

        return domain, intent, third_level, basis


class ReconciliationTagProcessor(TagProcessorBase):
    def __init__(self):
        """
        初始化处理器
        """
        super().__init__(MODEL_API_URL, MODEL_NAME)

        # 定义和解状态标签体系
        self.reconciliation_intent_map = RECONCILIATION_INTENT_MAP

    def extract_reconciliation_prompt(self, text: str) -> str:
        """
        构造提取和解状态的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本

        Returns:
            str: 构造的提示词
        """
        prompt = RECONCILIATION_PROMPT_TEMPLATE.format(text=text)
        return prompt

    def parse_reconciliation_result(self, llm_output: str) -> Tuple[str, str]:
        """
        解析和解状态识别结果

        Args:
            llm_output: 大模型返回的原始JSON结果

        Returns:
            tuple: (和解状态标签, 判断依据)
        """
        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "其他")
            reasoning = result.get("reasoning", "")

            # 验证标签是否有效
            if label in self.reconciliation_intent_map:
                return label, reasoning
            else:
                return "其他", reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用原来的解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in self.reconciliation_intent_map:
                return cleaned_output, llm_output

            # 尝试模糊匹配
            for reconciliation in self.reconciliation_intent_map.keys():
                if reconciliation in cleaned_output:
                    return reconciliation, llm_output

            # 默认返回"其他"
            return "其他", llm_output

    def process_single_row_with_reconciliation(self, text: str) -> Tuple[str, str]:
        """
        处理单条数据，提取和解状态和依据

        Args:
            text: 贷款客户与客服对话文本

        Returns:
            tuple: (和解状态, 判断依据)
        """
        new_text = [
            line for line in text.splitlines()
        ]
        if len(new_text) > 20:
            new_text = new_text[-20:]
        new_text = "\n".join(new_text)

        reconciliation_prompt = self.extract_reconciliation_prompt(new_text)
        reconciliation_result = self.call_llm(reconciliation_prompt)
        reconciliation, reasoning = self.parse_reconciliation_result(reconciliation_result)

        return reconciliation, reasoning


class SolutionTagProcessor(TagProcessorBase):
    def __init__(self):
        """
        初始化解决方案标签处理器
        """
        super().__init__(MODEL_API_URL, MODEL_NAME)

        # 定义解决方案标签体系
        self.solution_domain_intent_map = SOLUTION_DOMAIN_INTENT_MAP
        self.solution_second_third_intent_map = SOLUTION_SECOND_THIRD_INTENT_MAP

    def extract_solution_domain_prompt(self, text: str) -> str:
        """
        构造提取解决方案类型标签的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本

        Returns:
            str: 构造的提示词
        """
        prompt = SOLUTION_DOMAIN_PROMPT_TEMPLATE.format(text=text)
        return prompt

    def extract_solution_intent_prompt(self, text: str, domain: str) -> str:
        """
        构造提取具体解决方案类型的提示词（二级标签）

        Args:
            text: 需要分析的贷款客户与客服对话文本
            domain: 已确定的解决方案类型（一级标签）

        Returns:
            str: 构造的提示词
        """
        # 根据不同解决方案类型选择不同的意图prompt模板
        if domain == "催收业务":
            prompt = SOLUTION_COLLECTION_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "息费业务":
            prompt = SOLUTION_FEE_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "征信业务":
            prompt = SOLUTION_CREDIT_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "其他业务":
            prompt = SOLUTION_OTHER_INTENT_PROMPT_TEMPLATE.format(text=text)
        else:  # 默认使用其他业务模板
            prompt = SOLUTION_OTHER_INTENT_PROMPT_TEMPLATE.format(text=text)

        return prompt

    def extract_solution_third_level_prompt(self, text: str, second_level: str) -> str:
        """
        构造提取具体解决方案类型的提示词（三级标签）

        Args:
            text: 需要分析的贷款客户与客服对话文本
            second_level: 已确定的二级标签

        Returns:
            str: 构造的提示词
        """
        # 根据不同二级标签选择不同的三级标签prompt模板
        if second_level == "停催":
            prompt = SOLUTION_STOP_COLLECTION_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "退赔":
            prompt = SOLUTION_REFUND_COMPENSATE_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "协商还款":
            prompt = SOLUTION_REPAYMENT_NEGOTIATION_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "安抚致歉":
            prompt = SOLUTION_COMFORT_APOLOGY_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "资料办理":
            prompt = SOLUTION_DOCUMENT_PROCESSING_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "升级反馈":
            prompt = SOLUTION_UPGRADE_FEEDBACK_PROMPT_TEMPLATE.format(text=text)
        else:
            # 如果没有对应的三级标签，返回空字符串
            return ""

        return prompt

    def extract_basis_prompt(self, text: str, domain: str, intent: str, third_level: str) -> str:
        """
        构造提取解决方案分类整体依据的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本
            domain: 一级标签
            intent: 二级标签
            third_level: 三级标签

        Returns:
            str: 构造的提示词
        """
        prompt = SOLUTION_BASIS_PROMPT_TEMPLATE.format(
            text=text,
            domain=domain,
            intent=intent,
            third_level=third_level
        )
        return prompt

    def parse_solution_domain_result(self, llm_output: str) -> str:
        """
        解析解决方案类型识别结果（一级标签）

        Args:
            llm_output: 大模型返回的原始结果

        Returns:
            str: 解析后的解决方案类型
        """
        # 去除可能的空白字符和标点符号
        cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

        # 如果直接匹配到标准标签，则返回
        if cleaned_output in self.solution_domain_intent_map:
            return cleaned_output

        # 尝试模糊匹配
        for domain in self.solution_domain_intent_map.keys():
            if domain in cleaned_output:
                return domain

        # 默认返回"其他业务"作为最常见的类型
        return "其他业务"

    def parse_solution_intent_result(self, llm_output: str, domain: str) -> Tuple[str, str]:
        """
        解析具体解决方案类型识别结果（二级标签）

        Args:
            llm_output: 大模型返回的原始结果
            domain: 解决方案类型（一级标签）

        Returns:
            tuple: (二级标签, 判断依据)
        """
        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "")
            reasoning = result.get("reasoning", "")

            # 获取该领域下的意图列表
            intent_list = self.solution_domain_intent_map.get(domain, [])

            # 验证标签是否有效
            if label in intent_list:
                return label, reasoning
            else:
                return intent_list[0] if intent_list else "其他", reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用默认解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 获取该领域下的意图列表
            intent_list = self.solution_domain_intent_map.get(domain, [])

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in intent_list:
                return cleaned_output, ""

            # 尝试模糊匹配
            for intent in intent_list:
                if intent in cleaned_output:
                    return intent, ""

            # 默认返回该领域下的第一个意图或"其他"
            return intent_list[0] if intent_list else "其他", ""

    def parse_solution_third_level_result(self, llm_output: str, second_level: str) -> Tuple[str, str]:
        """
        解析具体解决方案类型识别结果（三级标签）

        Args:
            llm_output: 大模型返回的原始结果
            second_level: 二级标签

        Returns:
            tuple: (三级标签, 判断依据)
        """
        # 检查是否有对应的三级标签
        if second_level not in self.solution_second_third_intent_map:
            # 如果没有对应的三级标签，返回空值
            return "", ""

        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "")
            reasoning = result.get("reasoning", "")

            # 获取该二级标签下的三级标签列表
            intent_list = self.solution_second_third_intent_map.get(second_level, [])

            # 验证标签是否有效
            if label in intent_list:
                # 确保返回的是字符串而不是NaN
                label = str(label) if label is not None else ""
                reasoning = str(reasoning) if reasoning is not None else ""
                return label, reasoning
            else:
                default_label = intent_list[0] if intent_list else ""
                # 确保返回的是字符串而不是NaN
                default_label = str(default_label) if default_label is not None else ""
                reasoning = str(reasoning) if reasoning is not None else ""
                return default_label, reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用默认解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 获取该二级标签下的三级标签列表
            intent_list = self.solution_second_third_intent_map.get(second_level, [])

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in intent_list:
                # 确保返回的是字符串而不是NaN
                cleaned_output = str(cleaned_output) if cleaned_output is not None else ""
                return cleaned_output, ""

            # 尝试模糊匹配
            for intent in intent_list:
                if intent in cleaned_output:
                    # 确保返回的是字符串而不是NaN
                    intent = str(intent) if intent is not None else ""
                    return intent, ""

            # 默认返回该二级标签下的第一个三级标签或空
            default_label = intent_list[0] if intent_list else ""
            # 确保返回的是字符串而不是NaN
            default_label = str(default_label) if default_label is not None else ""
            return default_label, ""

    def parse_basis_result(self, llm_output: str) -> str:
        """
        解析解决方案分类整体依据结果

        Args:
            llm_output: 大模型返回的原始结果

        Returns:
            str: 整体分类依据
        """
        # 直接返回模型输出作为整体依据
        return llm_output.strip()

    def process_single_row_solution(self, text: str) -> Tuple[str, str, str, str]:
        """
        处理单条数据，提取解决方案类型和具体解决方案（支持三级标签）

        Args:
            text: 贷款客户与客服对话文本

        Returns:
            tuple: (一级标签, 二级标签, 三级标签, 标签依据)
        """
        # 去掉客户的话语
        new_text = [
            line for line in text.splitlines()
            if line.strip().startswith("坐席:")
        ]
        new_text = "\n".join(new_text)

        # 第一步：提取一级标签
        domain_prompt = self.extract_solution_domain_prompt(new_text)
        domain_result = self.call_llm(domain_prompt)
        domain = self.parse_solution_domain_result(domain_result)

        # 第二步：根据一级标签提取二级标签
        intent_prompt = self.extract_solution_intent_prompt(new_text, domain)
        intent_result = self.call_llm(intent_prompt)
        intent, intent_reasoning = self.parse_solution_intent_result(intent_result, domain)

        # 第三步：根据二级标签提取三级标签（如果存在）
        third_level_prompt = self.extract_solution_third_level_prompt(new_text, intent)
        if third_level_prompt:  # 只有当存在三级标签时才进行提取
            third_level_result = self.call_llm(third_level_prompt)
            third_level, third_level_reasoning = self.parse_solution_third_level_result(third_level_result, intent)
        else:
            third_level, third_level_reasoning = "", ""

        # 第四步：提取整体分类依据
        basis_prompt = self.extract_basis_prompt(new_text, domain, intent, third_level)
        basis_result = self.call_llm(basis_prompt)
        basis = self.parse_basis_result(basis_result)

        return domain, intent, third_level, basis


class AppealTagProcessor(TagProcessorBase):
    def __init__(self):
        """
        初始化诉求标签处理器
        """
        super().__init__(MODEL_API_URL, MODEL_NAME)

        # 定义诉求标签体系
        self.appeal_domain_intent_map = APPEAL_DOMAIN_INTENT_MAP
        self.appeal_second_third_intent_map = APPEAL_SECOND_THIRD_INTENT_MAP

    def extract_appeal_domain_prompt(self, text: str) -> str:
        """
        构造提取诉求类型标签的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本

        Returns:
            str: 构造的提示词
        """
        prompt = APPEAL_DOMAIN_PROMPT_TEMPLATE.format(text=text)
        return prompt

    def extract_appeal_intent_prompt(self, text: str, domain: str) -> str:
        """
        构造提取具体诉求类型的提示词（二级标签）

        Args:
            text: 需要分析的贷款客户与客服对话文本
            domain: 已确定的诉求类型（一级标签）

        Returns:
            str: 构造的提示词
        """
        # 根据不同诉求类型选择不同的意图prompt模板
        if domain == "催收业务":
            prompt = APPEAL_COLLECTION_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "息费业务":
            prompt = APPEAL_FEE_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "征信业务":
            prompt = APPEAL_CREDIT_INTENT_PROMPT_TEMPLATE.format(text=text)
        elif domain == "其他业务":
            prompt = APPEAL_OTHER_INTENT_PROMPT_TEMPLATE.format(text=text)
        else:  # 默认使用其他业务模板
            prompt = APPEAL_OTHER_INTENT_PROMPT_TEMPLATE.format(text=text)

        return prompt

    def extract_appeal_third_level_prompt(self, text: str, second_level: str) -> str:
        """
        构造提取具体诉求类型的提示词（三级标签）

        Args:
            text: 需要分析的贷款客户与客服对话文本
            second_level: 已确定的二级标签

        Returns:
            str: 构造的提示词
        """
        # 根据不同二级标签选择不同的三级标签prompt模板
        if second_level == "停催":
            prompt = APPEAL_STOP_COLLECTION_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "退赔":
            prompt = APPEAL_REFUND_COMPENSATE_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "协商还款":
            prompt = APPEAL_REPAYMENT_NEGOTIATION_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "安抚致歉":
            prompt = APPEAL_COMFORT_APOLOGY_PROMPT_TEMPLATE.format(text=text)
        elif second_level == "资料办理":
            prompt = APPEAL_DOCUMENT_PROCESSING_PROMPT_TEMPLATE.format(text=text)
        else:
            # 如果没有对应的三级标签，返回空字符串
            return ""

        return prompt

    def extract_basis_prompt(self, text: str, domain: str, intent: str, third_level: str) -> str:
        """
        构造提取诉求分类整体依据的提示词

        Args:
            text: 需要分析的贷款客户与客服对话文本
            domain: 一级标签
            intent: 二级标签
            third_level: 三级标签

        Returns:
            str: 构造的提示词
        """
        prompt = APPEAL_BASIS_PROMPT_TEMPLATE.format(
            text=text,
            domain=domain,
            intent=intent,
            third_level=third_level
        )
        return prompt

    def parse_appeal_domain_result(self, llm_output: str) -> str:
        """
        解析诉求类型识别结果（一级标签）

        Args:
            llm_output: 大模型返回的原始结果

        Returns:
            str: 解析后的一级标签
        """
        # 去除可能的空白字符和标点符号
        cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

        # 如果直接匹配到标准标签，则返回
        if cleaned_output in self.appeal_domain_intent_map:
            return cleaned_output

        # 尝试模糊匹配
        for domain in self.appeal_domain_intent_map.keys():
            if domain in cleaned_output:
                return domain

        # 默认返回"其他业务"作为最常见的类型
        return "其他业务"

    def parse_appeal_intent_result(self, llm_output: str, domain: str) -> Tuple[str, str]:
        """
        解析具体诉求类型识别结果（二级标签）

        Args:
            llm_output: 大模型返回的原始结果
            domain: 诉求类型（一级标签）

        Returns:
            tuple: (二级标签, 判断依据)
        """
        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "")
            reasoning = result.get("reasoning", "")

            # 获取该领域下的意图列表
            intent_list = self.appeal_domain_intent_map.get(domain, [])

            # 验证标签是否有效
            if label in intent_list:
                return label, reasoning
            else:
                return intent_list[0] if intent_list else "其他", reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用默认解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 获取该领域下的意图列表
            intent_list = self.appeal_domain_intent_map.get(domain, [])

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in intent_list:
                return cleaned_output, ""

            # 尝试模糊匹配
            for intent in intent_list:
                if intent in cleaned_output:
                    return intent, ""

            # 默认返回该领域下的第一个意图或"其他"
            return intent_list[0] if intent_list else "其他", ""

    def parse_appeal_third_level_result(self, llm_output: str, second_level: str) -> Tuple[str, str]:
        """
        解析具体诉求类型识别结果（三级标签）

        Args:
            llm_output: 大模型返回的原始结果
            second_level: 二级标签

        Returns:
            tuple: (三级标签, 判断依据)
        """
        # 检查是否有对应的三级标签
        if second_level not in self.appeal_second_third_intent_map:
            # 如果没有对应的三级标签，返回空值
            return "", ""

        try:
            # 尝试解析JSON格式的输出
            result = json.loads(llm_output)
            label = result.get("label", "")
            reasoning = result.get("reasoning", "")

            # 获取该二级标签下的三级标签列表
            intent_list = self.appeal_second_third_intent_map.get(second_level, [])

            # 验证标签是否有效
            if label in intent_list:
                # 确保返回的是字符串而不是NaN
                label = str(label) if label is not None else ""
                reasoning = str(reasoning) if reasoning is not None else ""
                return label, reasoning
            else:
                default_label = intent_list[0] if intent_list else ""
                # 确保返回的是字符串而不是NaN
                default_label = str(default_label) if default_label is not None else ""
                reasoning = str(reasoning) if reasoning is not None else ""
                return default_label, reasoning
        except json.JSONDecodeError:
            # 如果不是JSON格式，使用默认解析方法
            cleaned_output = llm_output.strip().strip('"\'\n\t .,;')

            # 获取该二级标签下的三级标签列表
            intent_list = self.appeal_second_third_intent_map.get(second_level, [])

            # 如果直接匹配到标准标签，则返回
            if cleaned_output in intent_list:
                # 确保返回的是字符串而不是NaN
                cleaned_output = str(cleaned_output) if cleaned_output is not None else ""
                return cleaned_output, ""

            # 尝试模糊匹配
            for intent in intent_list:
                if intent in cleaned_output:
                    # 确保返回的是字符串而不是NaN
                    intent = str(intent) if intent is not None else ""
                    return intent, ""

            # 默认返回该二级标签下的第一个三级标签或空
            default_label = intent_list[0] if intent_list else ""
            # 确保返回的是字符串而不是NaN
            default_label = str(default_label) if default_label is not None else ""
            return default_label, ""

    def parse_basis_result(self, llm_output: str) -> str:
        """
        解析诉求分类整体依据结果

        Args:
            llm_output: 大模型返回的原始结果

        Returns:
            str: 整体分类依据
        """
        # 直接返回模型输出作为整体依据
        return llm_output.strip()

    def process_single_row_appeal(self, text: str) -> Tuple[str, str, str, str]:
        """
        处理单条数据，提取诉求类型和具体诉求（支持三级标签）

        Args:
            text: 贷款客户与客服对话文本

        Returns:
            tuple: (一级标签, 二级标签, 三级标签, 标签依据)
        """
        # 第一步：提取一级标签
        domain_prompt = self.extract_appeal_domain_prompt(text)
        domain_result = self.call_llm(domain_prompt)
        domain = self.parse_appeal_domain_result(domain_result)

        # 第二步：根据一级标签提取二级标签
        intent_prompt = self.extract_appeal_intent_prompt(text, domain)
        intent_result = self.call_llm(intent_prompt)
        intent, intent_reasoning = self.parse_appeal_intent_result(intent_result, domain)

        # 第三步：根据二级标签提取三级标签（如果存在）
        third_level_prompt = self.extract_appeal_third_level_prompt(text, intent)
        if third_level_prompt:  # 只有当存在三级标签时才进行提取
            third_level_result = self.call_llm(third_level_prompt)
            third_level, third_level_reasoning = self.parse_appeal_third_level_result(third_level_result, intent)
        else:
            third_level, third_level_reasoning = "", ""

        # 第四步：提取整体分类依据
        basis_prompt = self.extract_basis_prompt(text, domain, intent, third_level)
        basis_result = self.call_llm(basis_prompt)
        basis = self.parse_basis_result(basis_result)

        return domain, intent, third_level, basis


def process_excel(input_file: str, output_file: str):
    """
    处理Excel文件，批量提取投诉标签

    Args:
        input_file: 输入Excel文件路径
        output_file: 输出Excel文件路径
    """
    # 初始化处理器
    complaint_processor = ComplaintTagProcessor()
    appeal_processor = AppealTagProcessor()
    solution_processor = SolutionTagProcessor()
    reconciliation_processor = ReconciliationTagProcessor()

    # 读取Excel文件
    df = pd.read_excel(input_file)

    # 确保必要的列存在
    required_columns = ['chat_text']
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要的列: {col}")

    # 添加结果列
    # 诉点分类结果列
    df['complaint_domain'] = ''  # 诉点领域
    df['complaint_intent'] = ''  # 诉点意图
    df['complaint_third_level'] = ''  # 诉点三级标签
    df['complaint_basis'] = ''  # 诉点分类依据

    # 诉求分类结果列
    df['appeal_domain'] = ''  # 诉求领域
    df['appeal_intent'] = ''  # 诉求意图
    df['appeal_third_level'] = ''  # 诉求三级标签
    df['appeal_basis'] = ''  # 诉求分类依据

    # 解决方案分类结果列
    df['solution_domain'] = ''  # 解决方案领域
    df['solution_intent'] = ''  # 解决方案意图
    df['solution_third_level'] = ''  # 解决方案三级标签
    df['solution_basis'] = ''  # 解决方案分类依据

    # 和解状态结果列
    df['reconciliation_status'] = ''  # 和解状态
    df['reconciliation_reasoning'] = ''  # 和解状态依据

    # 处理每一行数据
    for index, row in df.iterrows():
        try:
            print(f"正在处理第 {index + 1} 行...")
            row_start_time = time.time()

            # 如果chat_text为空但有audio_url，则调用convert_spk_to_analysis生成chat_text
            chat_text = row['chat_text']
            audio_url = row.get('audio_url', '') if 'audio_url' in df.columns else ''

            if (pd.isna(chat_text) or str(chat_text).strip() == '') and audio_url:
                print(f"第 {index + 1} 行 chat_text 为空，但存在 audio_url，正在调用 convert_spk_to_analysis...")
                try:
                    audio_processor = AudioProcessor()
                    start_time = time.time()
                    result = audio_processor.process_audio_url(audio_url)
                    end_time = time.time()
                    elapsed_time = end_time - start_time
                    print(f"音频处理耗时: {elapsed_time:.2f} 秒")
                    chat_text = result['chat_text']
                    print(f"成功生成对话文本，字符数: {len(chat_text)}")
                except Exception as e:
                    print(f"处理音频URL时出错: {str(e)}")
                    continue  # 跳过这一行
            elif pd.isna(chat_text) or str(chat_text).strip() == '':
                print(f"第 {index + 1} 行 chat_text 为空，跳过处理")
                continue

            # 处理诉点分类
            complaint_domain, complaint_intent, complaint_third_level, complaint_basis = complaint_processor.process_single_row(
                str(chat_text))
            df.at[index, 'complaint_domain'] = complaint_domain
            df.at[index, 'complaint_intent'] = complaint_intent
            df.at[index, 'complaint_third_level'] = complaint_third_level
            df.at[index, 'complaint_basis'] = complaint_basis

            # 处理诉求分类
            appeal_domain, appeal_intent, appeal_third_level, appeal_basis = appeal_processor.process_single_row_appeal(
                str(chat_text))
            df.at[index, 'appeal_domain'] = appeal_domain
            df.at[index, 'appeal_intent'] = appeal_intent
            df.at[index, 'appeal_third_level'] = appeal_third_level
            df.at[index, 'appeal_basis'] = appeal_basis

            # 处理解决方案分类
            solution_domain, solution_intent, solution_third_level, solution_basis = solution_processor.process_single_row_solution(
                str(chat_text))
            df.at[index, 'solution_domain'] = solution_domain
            df.at[index, 'solution_intent'] = solution_intent
            df.at[index, 'solution_third_level'] = solution_third_level
            df.at[index, 'solution_basis'] = solution_basis

            # 处理和解状态
            reconciliation_status, reconciliation_reasoning = reconciliation_processor.process_single_row_with_reconciliation(
                str(chat_text))
            df.at[index, 'reconciliation_status'] = reconciliation_status
            df.at[index, 'reconciliation_reasoning'] = reconciliation_reasoning

            row_end_time = time.time()
            row_elapsed_time = row_end_time - row_start_time

            print(f"第 {index + 1} 行处理完成:")
            print(f"  诉点: {complaint_domain} -> {complaint_intent} -> {complaint_third_level}")
            print(f"  诉点依据: {complaint_basis}")
            print(f"  诉求: {appeal_domain} -> {appeal_intent} -> {appeal_third_level}")
            print(f"  诉求依据: {appeal_basis}")
            print(f"  解决方案: {solution_domain} -> {solution_intent} -> {solution_third_level}")
            print(f"  解决方案依据: {solution_basis}")
            print(f"  和解状态: {reconciliation_status}")
            print(f"  和解状态依据: {reconciliation_reasoning}")

            print(f"  总耗时: {row_elapsed_time:.2f} 秒")

        except Exception as e:
            print(f"处理第 {index + 1} 行时出错: {str(e)}")
            continue

    # 保存结果到Excel文件
    df.to_excel(output_file, index=False)
    print(f"处理完成，结果已保存到 {output_file}")


def main():
    """
    主函数，用于直接运行此脚本处理Excel文件
    """
    import argparse

    parser = argparse.ArgumentParser(description='自动提取贷款客户投诉标签')
    parser.add_argument('input_file', help='输入Excel文件路径')
    parser.add_argument('output_file', help='输出Excel文件路径')

    args = parser.parse_args()

    process_excel(args.input_file, args.output_file)


if __name__ == "__main__":
    main()
