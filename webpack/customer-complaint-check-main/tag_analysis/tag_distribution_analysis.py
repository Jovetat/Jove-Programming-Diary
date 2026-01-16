#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
标签分布统计脚本
================

功能概述：
--------
统计指定Excel文件中各种标签的分布情况，包括：
1. 诉点标签（一二级标签）
2. 诉求标签（一二级标签）
3. 解决方案标签（一二级标签）
4. 解决状态标签

输出：
-----
生成一个新的Excel文件，包含各个标签维度的分布统计情况

使用方法：
--------
python tag_distribution_analysis.py
"""

import pandas as pd
import sys
import os
from collections import defaultdict

# 添加项目根目录到路径中
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.env import (
    COMPLAINT_DOMAIN_INTENT_MAP,
    COMPLAINT_SECOND_THIRD_INTENT_MAP,
    SOLUTION_DOMAIN_INTENT_MAP,
    SOLUTION_SECOND_THIRD_INTENT_MAP,
    APPEAL_DOMAIN_INTENT_MAP,
    APPEAL_SECOND_THIRD_INTENT_MAP,
    RECONCILIATION_INTENT_MAP
)


def analyze_complaint_distribution(df, writer):
    """
    分析诉点标签分布（一二级标签放在一起）
    """
    print("正在分析诉点标签分布...")
    
    # 统计一级标签分布
    domain_counts = df['complaint_domain'].value_counts()
    
    # 统计二级标签分布
    intent_counts = df['complaint_intent'].value_counts()
    
    # 统计三级标签分布
    third_level_counts = df['complaint_third_level'].value_counts()
    
    # 构建完整的映射关系用于排序
    full_mapping = {}
    for domain, intents in COMPLAINT_DOMAIN_INTENT_MAP.items():
        full_mapping[domain] = intents
        
    # 创建诉点分布统计表
    complaint_stats = []
    
    # 按照预定义顺序处理一级标签
    for domain in COMPLAINT_DOMAIN_INTENT_MAP.keys():
        domain_count = domain_counts.get(domain, 0)
        domain_pct = (domain_count / len(df)) * 100 if len(df) > 0 else 0
        
        complaint_stats.append({
            '一级标签': domain,
            '二级标签': '总计',
            '三级标签': '',
            '数量': domain_count,
            '占比(%)': round(domain_pct, 2)
        })
        
        # 处理该一级标签下的二级标签
        if domain in COMPLAINT_DOMAIN_INTENT_MAP:
            for intent in COMPLAINT_DOMAIN_INTENT_MAP[domain]:
                intent_count = intent_counts.get(intent, 0)
                intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
                
                complaint_stats.append({
                    '一级标签': '',
                    '二级标签': intent,
                    '三级标签': '总计',
                    '数量': intent_count,
                    '占比(%)': round(intent_pct, 2)
                })
                
                # 处理该二级标签下的三级标签
                if intent in COMPLAINT_SECOND_THIRD_INTENT_MAP:
                    for third_level in COMPLAINT_SECOND_THIRD_INTENT_MAP[intent]:
                        # 筛选出同时满足一二级标签条件的数据
                        intent_data = df[(df['complaint_domain'] == domain) & 
                                       (df['complaint_intent'] == intent)]
                        third_level_count = len(intent_data[intent_data['complaint_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        complaint_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': third_level,
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
                        
                    # 处理未在预定义中的三级标签
                    intent_data = df[(df['complaint_domain'] == domain) & 
                                   (df['complaint_intent'] == intent)]
                    actual_third_levels = intent_data['complaint_third_level'].unique()
                    defined_third_levels = set(COMPLAINT_SECOND_THIRD_INTENT_MAP.get(intent, []))
                    undefined_third_levels = [third_level for third_level in actual_third_levels 
                                            if pd.notna(third_level) and third_level not in defined_third_levels]
                    
                    for third_level in undefined_third_levels:
                        third_level_count = len(intent_data[intent_data['complaint_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        complaint_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': f"*{third_level}",
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
                
        # 处理未在预定义中的二级标签
        domain_data = df[df['complaint_domain'] == domain]
        actual_intents = domain_data['complaint_intent'].unique()
        defined_intents = set(COMPLAINT_DOMAIN_INTENT_MAP.get(domain, []))
        undefined_intents = [intent for intent in actual_intents 
                            if pd.notna(intent) and intent not in defined_intents]
        
        for intent in undefined_intents:
            intent_count = len(domain_data[domain_data['complaint_intent'] == intent])
            intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
            
            complaint_stats.append({
                '一级标签': '',
                '二级标签': f"*{intent}",  # 标记未预定义的标签
                '三级标签': '总计',
                '数量': intent_count,
                '占比(%)': round(intent_pct, 2)
            })
            
            # 处理该未定义二级标签下的三级标签（如果有）
            intent_data = domain_data[domain_data['complaint_intent'] == intent]
            third_levels = intent_data['complaint_third_level'].unique()
            for third_level in third_levels:
                if pd.notna(third_level):
                    third_level_count = len(intent_data[intent_data['complaint_third_level'] == third_level])
                    third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                    
                    complaint_stats.append({
                        '一级标签': '',
                        '二级标签': '',
                        '三级标签': f"*{third_level}",
                        '数量': third_level_count,
                        '占比(%)': round(third_level_pct, 2)
                    })
            
    # 处理未在预定义中的一级标签
    actual_domains = df['complaint_domain'].unique()
    defined_domains = set(COMPLAINT_DOMAIN_INTENT_MAP.keys())
    undefined_domains = [domain for domain in actual_domains 
                        if pd.notna(domain) and domain not in defined_domains]
    
    for domain in undefined_domains:
        domain_count = len(df[df['complaint_domain'] == domain])
        domain_pct = (domain_count / len(df)) * 100 if len(df) > 0 else 0
        
        complaint_stats.append({
            '一级标签': f"*{domain}",  # 标记未预定义的标签
            '二级标签': '总计',
            '三级标签': '',
            '数量': domain_count,
            '占比(%)': round(domain_pct, 2)
        })
        
        # 处理该未定义一级标签下的二级标签
        domain_data = df[df['complaint_domain'] == domain]
        intents = domain_data['complaint_intent'].unique()
        for intent in intents:
            if pd.notna(intent):
                intent_count = len(domain_data[domain_data['complaint_intent'] == intent])
                intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
                
                complaint_stats.append({
                    '一级标签': '',
                    '二级标签': f"*{intent}",
                    '三级标签': '总计',
                    '数量': intent_count,
                    '占比(%)': round(intent_pct, 2)
                })
                
                # 处理该二级标签下的三级标签
                intent_data = domain_data[domain_data['complaint_intent'] == intent]
                third_levels = intent_data['complaint_third_level'].unique()
                for third_level in third_levels:
                    if pd.notna(third_level):
                        third_level_count = len(intent_data[intent_data['complaint_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        complaint_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': f"*{third_level}",
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
    
    complaint_df = pd.DataFrame(complaint_stats)
    complaint_df.to_excel(writer, sheet_name='诉点分布', index=False)
    print(f"诉点标签分布分析完成，共 {len(complaint_stats)} 行记录")


def analyze_appeal_distribution(df, writer):
    """
    分析诉求标签分布（一二级）
    """
    print("正在分析诉求标签分布...")
    
    # 统计一级标签分布
    domain_counts = df['appeal_domain'].value_counts()
    
    # 统计二级标签分布
    intent_counts = df['appeal_intent'].value_counts()
    
    # 统计三级标签分布
    third_level_counts = df['appeal_third_level'].value_counts()
    
    # 创建诉求分布统计表
    appeal_stats = []
    
    # 按照预定义顺序处理一级标签
    for domain in APPEAL_DOMAIN_INTENT_MAP.keys():
        domain_count = domain_counts.get(domain, 0)
        domain_pct = (domain_count / len(df)) * 100 if len(df) > 0 else 0
        
        appeal_stats.append({
            '一级标签': domain,
            '二级标签': '总计',
            '三级标签': '',
            '数量': domain_count,
            '占比(%)': round(domain_pct, 2)
        })
        
        # 处理该一级标签下的二级标签
        if domain in APPEAL_DOMAIN_INTENT_MAP:
            for intent in APPEAL_DOMAIN_INTENT_MAP[domain]:
                intent_count = intent_counts.get(intent, 0)
                intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
                
                appeal_stats.append({
                    '一级标签': '',
                    '二级标签': intent,
                    '三级标签': '总计',
                    '数量': intent_count,
                    '占比(%)': round(intent_pct, 2)
                })
                
                # 处理该二级标签下的三级标签
                if intent in APPEAL_SECOND_THIRD_INTENT_MAP:
                    for third_level in APPEAL_SECOND_THIRD_INTENT_MAP[intent]:
                        # 筛选出同时满足一二级标签条件的数据
                        intent_data = df[(df['appeal_domain'] == domain) & 
                                       (df['appeal_intent'] == intent)]
                        third_level_count = len(intent_data[intent_data['appeal_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        appeal_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': third_level,
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
                        
                    # 处理未在预定义中的三级标签
                    intent_data = df[(df['appeal_domain'] == domain) & 
                                   (df['appeal_intent'] == intent)]
                    actual_third_levels = intent_data['appeal_third_level'].unique()
                    defined_third_levels = set(APPEAL_SECOND_THIRD_INTENT_MAP.get(intent, []))
                    undefined_third_levels = [third_level for third_level in actual_third_levels 
                                            if pd.notna(third_level) and third_level not in defined_third_levels]
                    
                    for third_level in undefined_third_levels:
                        third_level_count = len(intent_data[intent_data['appeal_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        appeal_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': f"*{third_level}",
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
    
    # 处理未在预定义中的一级标签
    actual_domains = df['appeal_domain'].unique()
    defined_domains = set(APPEAL_DOMAIN_INTENT_MAP.keys())
    undefined_domains = [domain for domain in actual_domains 
                        if pd.notna(domain) and domain not in defined_domains]
    
    for domain in undefined_domains:
        domain_count = len(df[df['appeal_domain'] == domain])
        domain_pct = (domain_count / len(df)) * 100 if len(df) > 0 else 0
        
        appeal_stats.append({
            '一级标签': f"*{domain}",
            '二级标签': '总计',
            '三级标签': '',
            '数量': domain_count,
            '占比(%)': round(domain_pct, 2)
        })
        
        # 处理该未定义一级标签下的二级标签
        domain_data = df[df['appeal_domain'] == domain]
        intents = domain_data['appeal_intent'].unique()
        for intent in intents:
            if pd.notna(intent):
                intent_count = len(domain_data[domain_data['appeal_intent'] == intent])
                intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
                
                appeal_stats.append({
                    '一级标签': '',
                    '二级标签': f"*{intent}",
                    '三级标签': '总计',
                    '数量': intent_count,
                    '占比(%)': round(intent_pct, 2)
                })
                
                # 处理该二级标签下的三级标签
                intent_data = domain_data[domain_data['appeal_intent'] == intent]
                third_levels = intent_data['appeal_third_level'].unique()
                for third_level in third_levels:
                    if pd.notna(third_level):
                        third_level_count = len(intent_data[intent_data['appeal_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        appeal_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': f"*{third_level}",
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
    
    appeal_df = pd.DataFrame(appeal_stats)
    appeal_df.to_excel(writer, sheet_name='诉求分布', index=False)
    print(f"诉求标签分布分析完成，共 {len(appeal_stats)} 行记录")


def analyze_solution_distribution(df, writer):
    """
    分析解决方案标签分布（一二级）
    """
    print("正在分析解决方案标签分布...")
    
    # 统计一级标签分布
    domain_counts = df['solution_domain'].value_counts()
    
    # 统计二级标签分布
    intent_counts = df['solution_intent'].value_counts()
    
    # 统计三级标签分布
    third_level_counts = df['solution_third_level'].value_counts()
    
    # 创建解决方案分布统计表
    solution_stats = []
    
    # 按照预定义顺序处理一级标签
    for domain in SOLUTION_DOMAIN_INTENT_MAP.keys():
        domain_count = domain_counts.get(domain, 0)
        domain_pct = (domain_count / len(df)) * 100 if len(df) > 0 else 0
        
        solution_stats.append({
            '一级标签': domain,
            '二级标签': '总计',
            '三级标签': '',
            '数量': domain_count,
            '占比(%)': round(domain_pct, 2)
        })
        
        # 处理该一级标签下的二级标签
        if domain in SOLUTION_DOMAIN_INTENT_MAP:
            for intent in SOLUTION_DOMAIN_INTENT_MAP[domain]:
                intent_count = intent_counts.get(intent, 0)
                intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
                
                solution_stats.append({
                    '一级标签': '',
                    '二级标签': intent,
                    '三级标签': '总计',
                    '数量': intent_count,
                    '占比(%)': round(intent_pct, 2)
                })
                
                # 处理该二级标签下的三级标签
                if intent in SOLUTION_SECOND_THIRD_INTENT_MAP:
                    for third_level in SOLUTION_SECOND_THIRD_INTENT_MAP[intent]:
                        # 筛选出同时满足一二级标签条件的数据
                        intent_data = df[(df['solution_domain'] == domain) & 
                                       (df['solution_intent'] == intent)]
                        third_level_count = len(intent_data[intent_data['solution_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        solution_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': third_level,
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
                        
                    # 处理未在预定义中的三级标签
                    intent_data = df[(df['solution_domain'] == domain) & 
                                   (df['solution_intent'] == intent)]
                    actual_third_levels = intent_data['solution_third_level'].unique()
                    defined_third_levels = set(SOLUTION_SECOND_THIRD_INTENT_MAP.get(intent, []))
                    undefined_third_levels = [third_level for third_level in actual_third_levels 
                                            if pd.notna(third_level) and third_level not in defined_third_levels]
                    
                    for third_level in undefined_third_levels:
                        third_level_count = len(intent_data[intent_data['solution_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        solution_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': f"*{third_level}",
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
    
    # 处理未在预定义中的一级标签
    actual_domains = df['solution_domain'].unique()
    defined_domains = set(SOLUTION_DOMAIN_INTENT_MAP.keys())
    undefined_domains = [domain for domain in actual_domains 
                        if pd.notna(domain) and domain not in defined_domains]
    
    for domain in undefined_domains:
        domain_count = len(df[df['solution_domain'] == domain])
        domain_pct = (domain_count / len(df)) * 100 if len(df) > 0 else 0
        
        solution_stats.append({
            '一级标签': f"*{domain}",
            '二级标签': '总计',
            '三级标签': '',
            '数量': domain_count,
            '占比(%)': round(domain_pct, 2)
        })
        
        # 处理该未定义一级标签下的二级标签
        domain_data = df[df['solution_domain'] == domain]
        intents = domain_data['solution_intent'].unique()
        for intent in intents:
            if pd.notna(intent):
                intent_count = len(domain_data[domain_data['solution_intent'] == intent])
                intent_pct = (intent_count / len(df)) * 100 if len(df) > 0 else 0
                
                solution_stats.append({
                    '一级标签': '',
                    '二级标签': f"*{intent}",
                    '三级标签': '总计',
                    '数量': intent_count,
                    '占比(%)': round(intent_pct, 2)
                })
                
                # 处理该二级标签下的三级标签
                intent_data = domain_data[domain_data['solution_intent'] == intent]
                third_levels = intent_data['solution_third_level'].unique()
                for third_level in third_levels:
                    if pd.notna(third_level):
                        third_level_count = len(intent_data[intent_data['solution_third_level'] == third_level])
                        third_level_pct = (third_level_count / len(df)) * 100 if len(df) > 0 else 0
                        
                        solution_stats.append({
                            '一级标签': '',
                            '二级标签': '',
                            '三级标签': f"*{third_level}",
                            '数量': third_level_count,
                            '占比(%)': round(third_level_pct, 2)
                        })
    
    solution_df = pd.DataFrame(solution_stats)
    solution_df.to_excel(writer, sheet_name='解决方案分布', index=False)
    print(f"解决方案标签分布分析完成，共 {len(solution_stats)} 行记录")


def analyze_reconciliation_distribution(df, writer):
    """
    分析解决状态分布
    """
    print("正在分析解决状态分布...")
    
    # 统计解决状态分布
    status_counts = df['reconciliation_status'].value_counts()
    
    # 创建解决状态统计表
    recon_stats = []
    
    # 按照预定义顺序处理
    for status in ['认可', '不认可', '其他']:
        count = status_counts.get(status, 0)
        pct = (count / len(df)) * 100 if len(df) > 0 else 0
        
        recon_stats.append({
            '解决状态': status,
            '数量': count,
            '占比(%)': round(pct, 2)
        })
    
    # 处理未在预定义中的状态
    actual_statuses = df['reconciliation_status'].unique()
    defined_statuses = {'认可', '不认可', '其他'}
    undefined_statuses = [status for status in actual_statuses 
                         if pd.notna(status) and status not in defined_statuses]
    
    for status in undefined_statuses:
        count = len(df[df['reconciliation_status'] == status])
        pct = (count / len(df)) * 100 if len(df) > 0 else 0
        
        recon_stats.append({
            '解决状态': f"*{status}",
            '数量': count,
            '占比(%)': round(pct, 2)
        })
    
    recon_df = pd.DataFrame(recon_stats)
    recon_df.to_excel(writer, sheet_name='解决状态分布', index=False)
    print(f"解决状态分布分析完成，共 {len(recon_stats)} 行记录")


def main():
    # 输入文件路径
    #input_file = "./data/benchmark_1800_taggedv1.5_promptv1.3.xlsx"
    #input_file = "./data/11_cat_res.xlsx"
    input_file = "./data/10_cat_res.xlsx"
    
    # 检查输入文件是否存在
    if not os.path.exists(input_file):
        print(f"错误: 输入文件 {input_file} 不存在")
        return
    
    # 输出文件路径
    output_file = "./data/tag_distribution_analysis.xlsx"
    
    print(f"开始分析标签分布...")
    print(f"输入文件: {input_file}")
    
    # 读取Excel文件
    try:
        df = pd.read_excel(input_file)
        print(f"成功读取数据，共 {len(df)} 行")
    except Exception as e:
        print(f"读取Excel文件失败: {e}")
        return
    
    # 创建输出Excel文件
    try:
        with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
            # 分析各类标签分布
            analyze_complaint_distribution(df, writer)      # 诉点分布
            analyze_appeal_distribution(df, writer)         # 诉求分布
            analyze_solution_distribution(df, writer)       # 解决方案分布
            analyze_reconciliation_distribution(df, writer) # 解决状态分布
        
        print(f"\n标签分布分析完成!")
        print(f"结果已保存到: {output_file}")
        
    except Exception as e:
        print(f"写入Excel文件失败: {e}")
        return


if __name__ == "__main__":
    main()