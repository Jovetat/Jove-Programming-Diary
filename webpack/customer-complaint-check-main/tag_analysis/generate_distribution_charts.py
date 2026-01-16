#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
标签分布图表生成脚本
==================

功能概述：
--------
读取由 tag_distribution_analysis.py 生成的Excel文件，并为各类标签生成可视化图表，
包括：
1. 诉点标签分布图（一级、二级、三级分别制图）
2. 诉求标签分布图（一级、二级、三级分别制图）
3. 解决方案标签分布图（一级、二级、三级分别制图）
4. 解决状态分布图

使用方法：
--------
python generate_distribution_charts.py
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import sys
import matplotlib
from collections import defaultdict

# 设置中文字体支持
matplotlib.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'FangSong', 'KaiTi', 'Arial Unicode MS']
matplotlib.rcParams['axes.unicode_minus'] = False
matplotlib.rcParams['font.size'] = 10

# 添加项目根目录到路径中
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def plot_simple_distribution(data, title, filename, figsize=(10, 6)):
    """
    绘制简单分布图
    """
    # 过滤掉占比为0的数据
    data = data[data['数量'] > 0]
    
    if len(data) == 0:
        print(f"警告: {title} 没有有效数据")
        return
    
    plt.figure(figsize=figsize)
    bars = plt.bar(range(len(data)), data['数量'], color='#3498db', edgecolor='black', linewidth=0.5)
    
    # 在柱子上添加数值标签
    for i, (idx, row) in enumerate(data.iterrows()):
        plt.text(i, row['数量'] + max(data['数量']) * 0.01, f"{row['数量']}\n{row['占比(%)']}%",
                ha='center', va='bottom', fontsize=6)
    
    plt.xlabel('标签类别', fontsize=12)
    plt.ylabel('数量', fontsize=12)
    plt.title(title, fontsize=14, fontweight='bold', pad=20)
    plt.xticks(range(len(data)), data.iloc[:, 0], rotation=45, ha='right')
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"已生成图表: {filename}")


def plot_level_distribution(df, level_name, level_column, title, filename):
    """
    绘制指定级别的标签分布图
    """
    # 筛选出指定级别的数据
    level_data = df[df[level_column] != ""].copy()
    level_data = level_data.drop_duplicates(subset=[level_column])  # 去重
    
    # 过滤掉数量为0的行
    level_data = level_data[level_data['数量'] > 0]
    
    if len(level_data) == 0:
        print(f"警告: {title} 没有有效数据")
        return
    
    # 排序
    level_data = level_data.sort_values('数量', ascending=False)
    
    plt.figure(figsize=(max(10, len(level_data) * 0.5), 6))
    bars = plt.bar(range(len(level_data)), level_data['数量'], 
                   color='#3498db' if level_name == '一级' else '#e74c3c' if level_name == '二级' else '#2ecc71',
                   edgecolor='black', linewidth=0.5)
    
    # 在柱子上添加数值标签
    for i, (idx, row) in enumerate(level_data.iterrows()):
        plt.text(i, row['数量'] + max(level_data['数量']) * 0.01, f"{row['数量']}\n({row['占比(%)']}%)",
                ha='center', va='bottom', fontsize=9)
    
    plt.xlabel(f'{level_name}标签', fontsize=12)
    plt.ylabel('数量', fontsize=12)
    plt.title(title, fontsize=14, fontweight='bold', pad=20)
    plt.xticks(range(len(level_data)), level_data[level_column], rotation=45, ha='right')
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"已生成图表: {filename}")


def plot_reconciliation_distribution(df, title, filename):
    """
    绘制解决状态分布图
    """
    # 过滤掉数量为0的行
    df = df[df['数量'] > 0]
    
    if len(df) == 0:
        print(f"警告: {title} 没有有效数据")
        return
    
    plt.figure(figsize=(8, 8))
    colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
    
    # 准备标签（添加数量和百分比）
    labels = [f"{row['解决状态']}\n{row['数量']} ({row['占比(%)']}%)" 
              for _, row in df.iterrows()]
    
    # 修复：正确处理饼图返回值
    pie_result = plt.pie(df['数量'], labels=labels, autopct='', startangle=90, 
                         colors=colors[:len(df)])
    
    plt.title(title, fontsize=14, fontweight='bold', pad=20)
    plt.axis('equal')
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"已生成图表: {filename}")


def process_hierarchical_sheet(df, base_name):
    """
    处理层级结构的sheet，分别生成一、二、三级标签的分布图
    """
    # 一级标签
    level1_data = df[(df['一级标签'] != "") & (df['二级标签'] == "总计")]
    if not level1_data.empty:
        plot_simple_distribution(
            level1_data[['一级标签', '数量', '占比(%)']].rename(columns={'一级标签': '标签'}),
            f'{base_name}一级标签分布',
            f'./data/charts/{base_name.lower()}_level1_distribution.png'
        )
    
    # 二级标签
    level2_data = df[(df['二级标签'] != "") & (df['二级标签'] != "总计") & (df['三级标签'] == "总计" if '三级标签' in df.columns else True)]
    if not level2_data.empty:
        plot_simple_distribution(
            level2_data[['二级标签', '数量', '占比(%)']].rename(columns={'二级标签': '标签'}),
            f'{base_name}二级标签分布',
            f'./data/charts/{base_name.lower()}_level2_distribution.png'
        )
    
    # 三级标签
    level3_data = df[(df['三级标签'] != "") & (df['三级标签'] != "总计")]
    # 过滤掉NaN值
    level3_data = level3_data.dropna(subset=['三级标签'])
    if not level3_data.empty:
        plot_simple_distribution(
            level3_data[['三级标签', '数量', '占比(%)']].rename(columns={'三级标签': '标签'}),
            f'{base_name}三级标签分布',
            f'./data/charts/{base_name.lower()}_level3_distribution.png'
        )


def main():
    # 输入文件路径
    input_file = "./data/tag_distribution_analysis.xlsx"
    
    # 检查输入文件是否存在
    if not os.path.exists(input_file):
        print(f"错误: 输入文件 {input_file} 不存在")
        print("请先运行 tag_distribution_analysis.py 脚本生成该文件")
        return
    
    # 创建图表输出目录
    charts_dir = "./data/charts"
    if not os.path.exists(charts_dir):
        os.makedirs(charts_dir)
    
    print(f"开始生成标签分布图表...")
    print(f"输入文件: {input_file}")
    
    try:
        # 读取各个sheet的数据
        complaint_df = pd.read_excel(input_file, sheet_name='诉点分布')
        appeal_df = pd.read_excel(input_file, sheet_name='诉求分布')
        solution_df = pd.read_excel(input_file, sheet_name='解决方案分布')
        reconciliation_df = pd.read_excel(input_file, sheet_name='解决状态分布')
        
        print(f"成功读取数据")
        
        # 分别为诉点、诉求、解决方案生成一、二、三级标签分布图
        process_hierarchical_sheet(complaint_df, '诉点')
        process_hierarchical_sheet(appeal_df, '诉求')
        process_hierarchical_sheet(solution_df, '解决方案')
        
        # 生成解决状态分布图
        plot_reconciliation_distribution(reconciliation_df, '解决状态分布', f'{charts_dir}/reconciliation_distribution.png')
        
        print(f"\n标签分布图表生成完成!")
        print(f"图表已保存到: {charts_dir}")
        
    except Exception as e:
        print(f"生成图表时发生错误: {e}")
        import traceback
        traceback.print_exc()
        return


if __name__ == "__main__":
    main()