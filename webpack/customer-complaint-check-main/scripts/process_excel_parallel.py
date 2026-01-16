# -*- coding: utf-8 -*-

"""
专用的Excel并行处理工具
- 线程安全（每个线程独立实例）
- 错误重试（最多3次）
- 进度统计和错误统计
- 支持音频转换
- 默认5个线程

使用方式：
python scripts/process_excel_parallel.py input.xlsx output.xlsx [--workers 5]
"""

import sys
import os
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
from threading import Lock

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.claim_llm_tag import (
    ComplaintTagProcessor,
    AppealTagProcessor,
    SolutionTagProcessor,
    ReconciliationTagProcessor
)
from core.audio_processor import AudioProcessor
from core.parallel_tag_processors import ParallelTagProcessors


class ParallelExcelProcessor:
    """
    并行Excel处理器
    
    特性：
    - 线程安全：每个线程独立创建处理器实例
    - 错误重试：单行失败自动重试最多3次
    - 进度显示：实时显示处理进度
    - 错误统计：统计成功/失败数量
    """
    
    def __init__(self, max_workers=5):
        """
        初始化处理器
        
        Args:
            max_workers: 线程数，默认5
        """
        self.max_workers = max_workers
        
        # 统计信息（线程安全）
        self.lock = Lock()
        self.success_count = 0
        self.error_count = 0
        self.retry_count = 0
    
    def process_single_row_with_retry(self, index, row, max_retries=3):
        """
        处理单行数据（带重试机制）
        
        每个线程独立创建处理器实例，保证线程安全
        
        Args:
            index: 行索引
            row: 数据行
            max_retries: 最大重试次数，默认3次
            
        Returns:
            dict: 处理结果，失败返回None
        """
        # ===== 线程安全：每个线程创建独立实例 =====
        audio_processor = AudioProcessor()
        # 创建并行标签处理器
        parallel_tag_processor = ParallelTagProcessors()
        
        # 重试逻辑
        for attempt in range(max_retries):
            try:
                # 获取对话文本
                chat_text = row.get('chat_text', '')
                audio_url = row.get('audio_url', '')
                generated_chat_text = chat_text

                # 如果chat_text为空但有audio_url，转换音频
                if (pd.isna(chat_text) or str(chat_text).strip() == '') and audio_url:
                    print(f"[线程-行{index+1}] chat_text为空，处理音频URL...")
                    try:
                        audio_result = audio_processor.process_audio_url(audio_url)
                        chat_text = audio_result['chat_text']
                        generated_chat_text = str(chat_text)
                        print(f"[线程-行{index+1}] 音频转换成功，字符数: {len(chat_text)}")
                    except Exception as e:
                        print(f"[线程-行{index+1}] 音频处理失败: {str(e)}")
                        if attempt < max_retries - 1:
                            with self.lock:
                                self.retry_count += 1
                            print(f"[线程-行{index+1}] 重试 {attempt+1}/{max_retries}")
                            time.sleep(1)
                            continue
                        raise
                
                # chat_text为空则跳过
                if pd.isna(chat_text) or str(chat_text).strip() == '':
                    print(f"[线程-行{index+1}] chat_text为空，跳过处理")
                    with self.lock:
                        self.error_count += 1
                    return None
                
                chat_text = str(chat_text)
                
                # ===== 调用并行处理方法 =====
                tag_results = parallel_tag_processor.process_all_tags_parallel(chat_text)
                
                complaint_domain = tag_results['complaint_domain']
                complaint_intent = tag_results['complaint_intent']
                complaint_third_level = tag_results['complaint_third_level']
                complaint_basis = tag_results['complaint_basis']
                
                appeal_domain = tag_results['appeal_domain']
                appeal_intent = tag_results['appeal_intent']
                appeal_third_level = tag_results['appeal_third_level']
                appeal_basis = tag_results['appeal_basis']
                
                solution_domain = tag_results['solution_domain']
                solution_intent = tag_results['solution_intent']
                solution_third_level = tag_results['solution_third_level']
                solution_basis = tag_results['solution_basis']
                
                reconciliation_status = tag_results['reconciliation_status']
                reconciliation_reasoning = tag_results['reconciliation_reasoning']
                
                # 成功
                with self.lock:
                    self.success_count += 1
                
                print(f"[线程-行{index+1}] 处理成功")
                
                return {
                    'index': index,
                    'chat_text': generated_chat_text,
                    'complaint_domain': complaint_domain,
                    'complaint_intent': complaint_intent,
                    'complaint_third_level': complaint_third_level,
                    'complaint_basis': complaint_basis,
                    'appeal_domain': appeal_domain,
                    'appeal_intent': appeal_intent,
                    'appeal_third_level': appeal_third_level,
                    'appeal_basis': appeal_basis,
                    'solution_domain': solution_domain,
                    'solution_intent': solution_intent,
                    'solution_third_level': solution_third_level,
                    'solution_basis': solution_basis,
                    'reconciliation_status': reconciliation_status,
                    'reconciliation_reasoning': reconciliation_reasoning
                }
                
            except Exception as e:
                # 错误处理
                if attempt < max_retries - 1:
                    with self.lock:
                        self.retry_count += 1
                    print(f"[线程-行{index+1}] 处理失败: {str(e)}，重试 {attempt+1}/{max_retries}")
                    time.sleep(1)  # 等待1秒后重试
                else:
                    # 最后一次重试也失败
                    with self.lock:
                        self.error_count += 1
                    print(f"[线程-行{index+1}] 处理失败（已重试{max_retries}次）: {str(e)}")
                    return None
        
        return None
    
    def process_excel(self, input_file, output_file):
        """
        并行处理Excel文件
        
        Args:
            input_file: 输入Excel文件路径
            output_file: 输出Excel文件路径
        """
        print("="*80)
        print(f"开始并行处理")
        print(f"输入文件: {input_file}")
        print(f"输出文件: {output_file}")
        print(f"线程数: {self.max_workers}")
        print("="*80)
        
        start_time = time.time()
        
        # 读取Excel文件
        df = pd.read_excel(input_file)
        if 'chat_text' in df.columns:
            df['chat_text'] = df['chat_text'].astype('object')
        total_rows = len(df)
        print(f"\n读取Excel完成，共 {total_rows} 行数据")
        
        # 添加结果列
        result_columns = [
            'complaint_domain', 'complaint_intent', 'complaint_third_level', 'complaint_basis',
            'appeal_domain', 'appeal_intent', 'appeal_third_level', 'appeal_basis',
            'solution_domain', 'solution_intent', 'solution_third_level', 'solution_basis',
            'reconciliation_status', 'reconciliation_reasoning'
        ]
        
        for col in result_columns:
            if col not in df.columns:
                df[col] = ''
        
        # 准备任务
        tasks = [(index, row) for index, row in df.iterrows()]
        
        print(f"\n开始并行处理...")
        print("-"*80)
        
        # 使用线程池并行处理
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 提交所有任务
            future_to_index = {
                executor.submit(self.process_single_row_with_retry, index, row): index
                for index, row in tasks
            }
            
            # 收集结果
            completed = 0
            
            for future in as_completed(future_to_index):
                completed += 1
                result = future.result()
                
                # 写入结果
                if result is not None:
                    index = result['index']
                    if result.get('chat_text') is not None:
                        df.at[index, 'chat_text'] = result['chat_text']
                    for col in result_columns:
                        df.at[index, col] = result[col]
                
                # 显示进度（每10行或最后一行）
                if completed % 10 == 0 or completed == total_rows:
                    progress = completed * 100 / total_rows
                    print(f"进度: {completed}/{total_rows} ({progress:.1f}%) | "
                          f"成功: {self.success_count} | 失败: {self.error_count} | "
                          f"重试: {self.retry_count}")
        
        # 保存结果
        print("-"*80)
        print(f"\n保存结果到: {output_file}")
        df.to_excel(output_file, index=False)
        
        # 统计信息
        elapsed_time = time.time() - start_time
        print("\n" + "="*80)
        print("处理完成！")
        print("="*80)
        print(f"总行数: {total_rows}")
        print(f"成功: {self.success_count} ({self.success_count*100/total_rows:.1f}%)")
        print(f"失败: {self.error_count} ({self.error_count*100/total_rows:.1f}%)")
        print(f"重试次数: {self.retry_count}")
        print(f"总耗时: {elapsed_time:.2f} 秒")
        print(f"平均速度: {total_rows/elapsed_time:.2f} 行/秒")
        print("="*80)


def main():
    """
    主函数
    """
    import argparse
    
    parser = argparse.ArgumentParser(
        description='并行处理Excel文件（线程安全版）',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  python scripts/process_excel_parallel.py input.xlsx output.xlsx
  python scripts/process_excel_parallel.py input.xlsx output.xlsx --workers 10
        """
    )
    
    parser.add_argument('input_file', help='输入Excel文件路径')
    parser.add_argument('output_file', help='输出Excel文件路径')
    parser.add_argument('--workers', type=int, default=5, 
                        help='线程数 (默认: 5)')
    
    args = parser.parse_args()
    
    # 创建处理器并执行
    processor = ParallelExcelProcessor(max_workers=args.workers)
    processor.process_excel(args.input_file, args.output_file)


if __name__ == "__main__":
    main()