# -*- coding: utf-8 -*-

"""
并行化标签处理脚本
- 将投诉、诉求、解决方案、和解状态四个处理步骤并行化
- 提高单行数据处理速度
- 线程安全

使用方式：
此脚本作为一个模块被其他脚本调用，不直接运行
"""

import sys
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.claim_llm_tag import (
    ComplaintTagProcessor,
    AppealTagProcessor,
    SolutionTagProcessor,
    ReconciliationTagProcessor
)


class ParallelTagProcessors:
    """
    并行标签处理器
    
    特性：
    - 将四个标签处理步骤并行化执行
    - 每个处理器在线程中独立实例化，保证线程安全
    - 提高单行数据处理速度
    """
    
    def __init__(self, max_workers=4):
        """
        初始化并行处理器
        
        Args:
            max_workers: 线程数，默认4（对应4个处理步骤）
        """
        self.max_workers = max_workers
    
    def process_complaint(self, chat_text):
        """
        处理投诉标签
        
        Args:
            chat_text: 对话文本
            
        Returns:
            tuple: (complaint_domain, complaint_intent, complaint_third_level, complaint_basis)
        """
        complaint_processor = ComplaintTagProcessor()
        return complaint_processor.process_single_row(chat_text)
    
    def process_appeal(self, chat_text):
        """
        处理诉求标签
        
        Args:
            chat_text: 对话文本
            
        Returns:
            tuple: (appeal_domain, appeal_intent, appeal_third_level, appeal_basis)
        """
        appeal_processor = AppealTagProcessor()
        return appeal_processor.process_single_row_appeal(chat_text)
    
    def process_solution(self, chat_text):
        """
        处理解决方案标签
        
        Args:
            chat_text: 对话文本
            
        Returns:
            tuple: (solution_domain, solution_intent, solution_third_level, solution_basis)
        """
        solution_processor = SolutionTagProcessor()
        return solution_processor.process_single_row_solution(chat_text)
    
    def process_reconciliation(self, chat_text):
        """
        处理和解状态标签
        
        Args:
            chat_text: 对话文本
            
        Returns:
            tuple: (reconciliation_status, reconciliation_reasoning)
        """
        reconciliation_processor = ReconciliationTagProcessor()
        return reconciliation_processor.process_single_row_with_reconciliation(chat_text)
    
    def process_all_tags_parallel(self, chat_text):
        """
        并行处理所有标签
        
        Args:
            chat_text: 对话文本
            
        Returns:
            dict: 包含所有标签结果的字典
        """
        # 定义任务列表
        tasks = [
            (self.process_complaint, "complaint"),
            (self.process_appeal, "appeal"),
            (self.process_solution, "solution"),
            (self.process_reconciliation, "reconciliation")
        ]
        
        results = {}
        
        # 使用线程池并行处理
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交所有任务
            future_to_task = {
                executor.submit(task[0], chat_text): task[1]
                for task in tasks
            }
            
            # 收集结果
            for future in as_completed(future_to_task):
                task_type = future_to_task[future]
                try:
                    result = future.result()
                    if task_type == "complaint":
                        results['complaint_domain'], results['complaint_intent'], \
                        results['complaint_third_level'], results['complaint_basis'] = result
                    elif task_type == "appeal":
                        results['appeal_domain'], results['appeal_intent'], \
                        results['appeal_third_level'], results['appeal_basis'] = result
                    elif task_type == "solution":
                        results['solution_domain'], results['solution_intent'], \
                        results['solution_third_level'], results['solution_basis'] = result
                    elif task_type == "reconciliation":
                        results['reconciliation_status'], results['reconciliation_reasoning'] = result
                except Exception as e:
                    print(f"处理{task_type}标签时出错: {str(e)}")
                    # 设置默认值
                    if task_type == "complaint":
                        results['complaint_domain'], results['complaint_intent'], \
                        results['complaint_third_level'], results['complaint_basis'] = "", "", "", ""
                    elif task_type == "appeal":
                        results['appeal_domain'], results['appeal_intent'], \
                        results['appeal_third_level'], results['appeal_basis'] = "", "", "", ""
                    elif task_type == "solution":
                        results['solution_domain'], results['solution_intent'], \
                        results['solution_third_level'], results['solution_basis'] = "", "", "", ""
                    elif task_type == "reconciliation":
                        results['reconciliation_status'], results['reconciliation_reasoning'] = "", ""
        
        return results


def main():
    """
    主函数 - 示例用法
    """
    # 示例文本
    sample_text = """坐席: 您好，请问有什么可以帮助您的？
客户: 我要投诉你们的催收方式，太恶劣了！
坐席: 非常抱歉给您带来不愉快的体验，请问具体是什么情况呢？
客户: 你们的人每天晚上12点还打电话催收，严重影响我的生活！
坐席: 非常抱歉，我们会立刻处理这个问题。请问您还有其他需要帮助的吗？
客户: 我希望你们能够停催，并给予合理解释。
坐席: 我们会尽快安排专人联系您处理此事，请您留下联系方式。"""
    
    # 创建并行处理器
    parallel_processor = ParallelTagProcessors()
    
    # 记录开始时间
    start_time = time.time()
    
    # 并行处理所有标签
    results = parallel_processor.process_all_tags_parallel(sample_text)
    
    # 记录结束时间
    end_time = time.time()
    
    # 打印结果
    print("并行处理结果:")
    for key, value in results.items():
        print(f"{key}: {value}")
    
    print(f"\n处理耗时: {end_time - start_time:.2f} 秒")


if __name__ == "__main__":
    main()