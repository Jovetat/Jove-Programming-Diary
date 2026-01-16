# -*- coding: utf-8 -*-

"""
Backward compatibility script for processing Excel files
"""

import sys
import os
import argparse

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.claim_llm_tag import process_excel

def main():
    """
    主函数，用于执行投诉标签提取任务
    """
    parser = argparse.ArgumentParser(
    description='处理Excel文件（单线程版）',
    formatter_class=argparse.RawDescriptionHelpFormatter,
    epilog="""
    示例：
    python scripts/process_excel.py input.xlsx output.xlsx
    """
    )
    
    parser.add_argument('input_file', help='输入Excel文件路径')
    parser.add_argument('output_file', help='输出Excel文件路径')
    
    args = parser.parse_args()
    
    # 处理Excel文件
    process_excel(args.input_file, args.output_file)

if __name__ == "__main__":
    main()