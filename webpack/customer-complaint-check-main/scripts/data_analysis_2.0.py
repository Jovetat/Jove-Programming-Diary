"""
数据分析脚本 v2.0
=================

功能概述：
---------
评估多级标签分类模型的性能，对比AI预测标签和人工修正标签

主要功能：
1. 计算评估指标：准确率、精确率、召回率、F1分数
2. 生成详细的标签级别评估报告
3. 计算并可视化混淆矩阵
4. 支持多级标签（诉点、诉求、解决方案）和单级标签（解决状态）

输出文件：
1. {输入文件名}_all_evaluation.xlsx - 包含所有评估指标
   - 总体统计：各层级的汇总指标
   - 详细统计：每个标签的详细指标
2. {输入文件名}_confusion_matrix.xlsx - 混淆矩阵（带总计行列）
3. 4个PNG热力图文件 - 可视化混淆矩阵

使用方法：
python data_analysis_2.0.py [输入文件路径]
"""
import pandas as pd
import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
import os
import sys
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib import rcParams

# 设置中文字体支持
#rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei', 'DejaVu Sans']
rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'FangSong', 'KaiTi', 'Arial Unicode MS']
rcParams['axes.unicode_minus'] = False

# 添加项目根目录到路径中
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def evaluate_multi_level_tags(df, tag_config):
    """
    通用函数：评估多级标签（domain-intent-third_level）
    
    多级标签结构：
        一级：领域（domain）       例如：催收业务
        二级：意图（intent）       例如：催收违规
        三级：槽位（third_level）  例如：频次过高
        组合：催收业务-催收违规-频次过高
    
    参数:
        df: DataFrame，包含预测和修正标签的数据
        tag_config: 字典，包含标签配置信息
            - tag_type_name: 标签类型名称（如'诉点'、'诉求'、'解决方案'）
            - domain_col: 预测的domain列名
            - intent_col: 预测的intent列名
            - third_level_col: 预测的third_level列名
            - corrected_domain_col: 修正的domain列名
            - corrected_intent_col: 修正的intent列名
            - corrected_third_level_col: 修正的third_level列名
    
    返回:
        dict: 包含评估结果的字典
            - results_df_two_level: 二级标签评估结果DataFrame（保存到详细Sheet）
            - results_df_three_level: 三级标签评估结果DataFrame（保存到详细Sheet）
            - summary_rows: 总体统计列表（保存到总体统计Sheet）
    """
    tag_type_name = tag_config['tag_type_name']
    domain_col = tag_config['domain_col']
    intent_col = tag_config['intent_col']
    third_level_col = tag_config['third_level_col']
    corrected_domain_col = tag_config['corrected_domain_col']
    corrected_intent_col = tag_config['corrected_intent_col']
    corrected_third_level_col = tag_config['corrected_third_level_col']
    
    # ========== 步骤1：数据验证和过滤 ==========
    # 检查必要的列是否存在
    required_columns = [
        domain_col, intent_col, third_level_col,
        corrected_domain_col, corrected_intent_col, corrected_third_level_col
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据
    # 只保留有人工修正的数据才能进行评估
    df_filtered = df[df[corrected_domain_col].notna() & df[corrected_intent_col].notna()].copy()
    
    if len(df_filtered) == 0:
        print(f"警告: 没有找到经过人工修正的{tag_type_name}标签数据")
        return None
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的{tag_type_name}标签数据进行评估")
    
    # 处理空值，将其替换为空字符串以避免错误
    # 这样可以确保后续的字符串拼接不会出错
    df_filtered.loc[:, domain_col] = df_filtered[domain_col].fillna('')
    df_filtered.loc[:, intent_col] = df_filtered[intent_col].fillna('')
    df_filtered.loc[:, third_level_col] = df_filtered[third_level_col].fillna('')
    df_filtered.loc[:, corrected_domain_col] = df_filtered[corrected_domain_col].fillna('')
    df_filtered.loc[:, corrected_intent_col] = df_filtered[corrected_intent_col].fillna('')
    df_filtered.loc[:, corrected_third_level_col] = df_filtered[corrected_third_level_col].fillna('')
    
    # ========== 步骤2：创建组合标签 ==========
    # 创建二级组合标签（domain-intent）
    # 例如："催收业务" + "-" + "催收违规" = "催收业务-催收违规"
    full_tag_pred_col = f'{tag_type_name}_full_tag_pred'
    full_tag_true_col = f'{tag_type_name}_full_tag_true'
    df_filtered.loc[:, full_tag_pred_col] = (
        df_filtered[domain_col].astype(str) + '-' + df_filtered[intent_col].astype(str)
    )

    df_filtered.loc[:, full_tag_true_col] = (
        df_filtered[corrected_domain_col].astype(str) + '-' + df_filtered[corrected_intent_col].astype(str)
    )

    # 创建三级组合标签（domain-intent-third_level）
    # 例如："催收业务-催收违规-频次过高"
    full_tag_third_pred_col = f'{tag_type_name}_full_tag_third_pred'
    full_tag_third_true_col = f'{tag_type_name}_full_tag_third_true'
    df_filtered.loc[:, full_tag_third_pred_col] = (
        df_filtered[domain_col].astype(str) + '-' +
        df_filtered[intent_col].astype(str) + '-' +
        df_filtered[third_level_col].astype(str)
    )
    df_filtered.loc[:, full_tag_third_true_col] = (
        df_filtered[corrected_domain_col].astype(str) + '-' +
        df_filtered[corrected_intent_col].astype(str) + '-' +
        df_filtered[corrected_third_level_col].astype(str)
    )
    
    # ========== 步骤3：计算整体准确率 ==========
    # 整体准确率 = 正确预测的样本数 / 总样本数
    # 这些准确率会用于"总体统计"Sheet中的"准确率"列
    
    # 二级组合标签的整体准确率（domain-intent）
    overall_accuracy = (df_filtered[full_tag_pred_col] == df_filtered[full_tag_true_col]).mean()
    
    # 三级组合标签的整体准确率（domain-intent-third_level）
    overall_three_level_accuracy = (df_filtered[full_tag_third_pred_col] == df_filtered[full_tag_third_true_col]).mean()
    
    # 一级标签（领域）的整体准确率
    domain_accuracy = (df_filtered[domain_col] == df_filtered[corrected_domain_col]).mean()
    
    # 二级标签（意图）的整体准确率
    intent_accuracy = (df_filtered[intent_col] == df_filtered[corrected_intent_col]).mean()
    
    # 三级标签（槽位）的整体准确率
    third_level_accuracy = (df_filtered[third_level_col] == df_filtered[corrected_third_level_col]).mean()
    
    # 打印准确率信息
    print(f"{tag_type_name}标签整体准确率 (domain-intent-third): {overall_three_level_accuracy:.4f}")
    print(f"{tag_type_name}标签整体准确率 (domain-intent): {overall_accuracy:.4f}")
    print(f"{tag_type_name}一级标签准确率 (domain): {domain_accuracy:.4f}")
    print(f"{tag_type_name}二级标签准确率 (intent): {intent_accuracy:.4f}")
    print(f"{tag_type_name}三级标签准确率 (third_level): {third_level_accuracy:.4f}")
    
    # ========== 步骤4：二级标签详细评估 ==========
    # 目的：为每个具体的二级标签（如"催收业务-催收违规"）计算评估指标
    # 结果会保存到详细Sheet中，如"诉点-领域意图"
    
    # 获取所有唯一的真实标签（去重并排序）
    unique_true_labels = sorted(df_filtered[full_tag_true_col].unique())
    evaluation_results = []  # 用于存储每个标签的评估结果
    
    # 遍历每个唯一的真实标签
    for label in unique_true_labels:  # 例如：label = "催收业务-催收违规"
        # 找出所有真实标签为当前label的样本
        label_mask = df_filtered[full_tag_true_col] == label
        label_count = label_mask.sum()  # 统计该标签的样本数量
        
        if label_count == 0:
            continue  # 如果没有样本，跳过
        
        # ===== 【应用1：二分类转换】 =====
        # 将多分类问题转换为二分类问题：是否为当前标签
        # 例如：当前label = "催收业务-催收违规"
        # 真实标签 = ["催收业务-催收违规", "信贷业务-贷款", "催收业务-催收违规", ...]
        # 转换后   = [1, 0, 1, ...]  (1表示是当前标签，0表示不是)
        y_true_binary = (df_filtered[full_tag_true_col] == label).astype(int)
        y_pred_binary = (df_filtered[full_tag_pred_col] == label).astype(int)
        
        # 使用sklearn计算二分类指标
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        # 精确率 = TP / (TP + FP)
        # 含义：在所有预测为"催收业务-催收违规"的样本中，真正是该标签的比例
        
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        # 召回率 = TP / (TP + FN)
        # 含义：在所有真实为"催收业务-催收违规"的样本中，被正确预测的比例
        
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        # F1分数 = 2 * (精确率 * 召回率) / (精确率 + 召回率)
        
        # 提取标签组成部分
        parts = label.split('-')
        domain_part = parts[0] if len(parts) > 0 else ''
        intent_part = parts[1] if len(parts) > 1 else ''
        
        evaluation_results.append({
            '标签类型': tag_type_name,
            '完整标签': label,
            '一级标签': domain_part,
            '二级标签': intent_part,
            '样本数量': label_count,
            '准确率': round(recall, 4),  # 准确率 = 召回率
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    results_df_two_level = pd.DataFrame(evaluation_results)
    
    # ========== 三级标签评估 ==========
    unique_true_labels_third = sorted(df_filtered[full_tag_third_true_col].unique())
    evaluation_results_third = []
    
    for label in unique_true_labels_third:
        label_mask = df_filtered[full_tag_third_true_col] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
        
        # 使用sklearn计算精确率、召回率和F1分数
        y_true_binary = (df_filtered[full_tag_third_true_col] == label).astype(int)
        y_pred_binary = (df_filtered[full_tag_third_pred_col] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        # 提取标签组成部分
        parts = label.split('-')
        domain_part = parts[0] if len(parts) > 0 else ''
        intent_part = parts[1] if len(parts) > 1 else ''
        third_part = parts[2] if len(parts) > 2 else ''
        
        evaluation_results_third.append({
            '标签类型': tag_type_name,
            '完整标签': label,
            '一级标签': domain_part,
            '二级标签': intent_part,
            '三级标签': third_part,
            '样本数量': label_count,
            '准确率': round(recall, 4),  # 准确率 = 召回率
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    results_df_three_level = pd.DataFrame(evaluation_results_third)
    
    # ========== 步骤6：计算各层级的Macro平均指标 ==========
    # Macro平均：对每个标签单独计算指标，然后取平均值（不考虑样本数量，每个标签权重相同）
    # 这些Macro平均会用于"总体统计"Sheet中的"精确率"、"召回率"、"F1分数"列
    
    # --- 1. 二级组合标签的Macro平均 ---
    # 直接从已经计算好的详细结果中取平均值
    two_level_macro_precision = results_df_two_level['精确率'].mean() if not results_df_two_level.empty else 0
    two_level_macro_recall = results_df_two_level['召回率'].mean() if not results_df_two_level.empty else 0
    two_level_macro_f1 = results_df_two_level['F1分数'].mean() if not results_df_two_level.empty else 0
    
    # --- 2. 三级组合标签的Macro平均 ---
    three_level_macro_precision = results_df_three_level['精确率'].mean() if not results_df_three_level.empty else 0
    three_level_macro_recall = results_df_three_level['召回率'].mean() if not results_df_three_level.empty else 0
    three_level_macro_f1 = results_df_three_level['F1分数'].mean() if not results_df_three_level.empty else 0
    
    # --- 3. 一级标签（领域）的Macro平均 ---
    # ===== 【应用2：二分类转换】 =====
    # 这里需要重新计算，因为一级标签是独立的，不在二级/三级组合中
    unique_domain_labels = sorted(df_filtered[corrected_domain_col].unique())
    domain_metrics = []  # 用于存储每个领域的指标
    
    for domain_label in unique_domain_labels:  # 例如：domain_label = "催收业务"
        # 将多分类问题转换为二分类：是否为当前领域
        y_true_binary = (df_filtered[corrected_domain_col] == domain_label).astype(int)
        y_pred_binary = (df_filtered[domain_col] == domain_label).astype(int)
        
        # 计算该领域的二分类指标
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        domain_metrics.append({'precision': precision, 'recall': recall, 'f1': f1})
    
    # 计算所有领域的Macro平均
    # 例如：3个领域的精确率 = [0.85, 0.90, 0.75]，Macro平均 = (0.85 + 0.90 + 0.75) / 3 = 0.8333
    domain_macro_precision = np.mean([m['precision'] for m in domain_metrics]) if domain_metrics else 0
    domain_macro_recall = np.mean([m['recall'] for m in domain_metrics]) if domain_metrics else 0
    domain_macro_f1 = np.mean([m['f1'] for m in domain_metrics]) if domain_metrics else 0
    
    # --- 4. 二级标签（意图）的Macro平均 ---
    # 逻辑与一级标签相同，对每个意图单独计算指标
    unique_intent_labels = sorted(df_filtered[corrected_intent_col].unique())
    intent_metrics = []  # 用于存储每个意图的指标
    
    for intent_label in unique_intent_labels:  # 例如：intent_label = "催收违规"
        # 将多分类问题转换为二分类：是否为当前意图
        y_true_binary = (df_filtered[corrected_intent_col] == intent_label).astype(int)
        y_pred_binary = (df_filtered[intent_col] == intent_label).astype(int)
        
        # 计算该意图的二分类指标
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        intent_metrics.append({'precision': precision, 'recall': recall, 'f1': f1})
    
    # 计算所有意图的Macro平均
    intent_macro_precision = np.mean([m['precision'] for m in intent_metrics]) if intent_metrics else 0
    intent_macro_recall = np.mean([m['recall'] for m in intent_metrics]) if intent_metrics else 0
    intent_macro_f1 = np.mean([m['f1'] for m in intent_metrics]) if intent_metrics else 0
    
    # --- 5. 三级标签（槽位）的Macro平均 ---
    # 逻辑与一级、二级标签相同，对每个槽位单独计算指标
    unique_third_labels = sorted(df_filtered[corrected_third_level_col].unique())
    third_metrics = []  # 用于存储每个槽位的指标
    
    for third_label in unique_third_labels:  # 例如：third_label = "频次过高"
        # 将多分类问题转换为二分类：是否为当前槽位
        y_true_binary = (df_filtered[corrected_third_level_col] == third_label).astype(int)
        y_pred_binary = (df_filtered[third_level_col] == third_label).astype(int)
        
        # 计算该槽位的二分类指标
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        third_metrics.append({'precision': precision, 'recall': recall, 'f1': f1})
    
    # 计算所有槽位的Macro平均
    third_macro_precision = np.mean([m['precision'] for m in third_metrics]) if third_metrics else 0
    third_macro_recall = np.mean([m['recall'] for m in third_metrics]) if third_metrics else 0
    third_macro_f1 = np.mean([m['f1'] for m in third_metrics]) if third_metrics else 0
    
    # ========== 步骤7：构建总体统计表数据 ==========
    # 这个列表会被保存到Excel的"总体统计"Sheet中
    # 每个字典代表一行数据
    # 注意：准确率使用整体准确率，精确率/召回率/F1使用Macro平均
    
    summary_rows = [
        # --- 第1行：诉点领域意图（二级组合标签） ---
        {
            '标签层级': f'{tag_type_name}领域意图',  # 例如："诉点领域意图"
            '准确率': round(overall_accuracy, 4),    # 使用整体准确率（正确数/总数）
            '精确率': round(two_level_macro_precision, 4),  # 使用Macro平均
            '召回率': round(two_level_macro_recall, 4),     # 使用Macro平均
            'F1分数': round(two_level_macro_f1, 4)          # 使用Macro平均
        },
        # --- 第2行：诉点领域意图槽位（三级组合标签） ---
        {
            '标签层级': f'{tag_type_name}领域意图槽位',
            '准确率': round(overall_three_level_accuracy, 4),  # 使用整体准确率
            '精确率': round(three_level_macro_precision, 4),   # 使用Macro平均
            '召回率': round(three_level_macro_recall, 4),      # 使用Macro平均
            'F1分数': round(three_level_macro_f1, 4)           # 使用Macro平均
        },
        # --- 第3行：诉点一级（领域） ---
        {
            '标签层级': f'{tag_type_name}一级',
            '准确率': round(domain_accuracy, 4),         # 使用整体准确率
            '精确率': round(domain_macro_precision, 4),  # 使用Macro平均（来自步骤6的计算）
            '召回率': round(domain_macro_recall, 4),     # 使用Macro平均
            'F1分数': round(domain_macro_f1, 4)          # 使用Macro平均
        },
        # --- 第4行：诉点二级（意图） ---
        {
            '标签层级': f'{tag_type_name}二级',
            '准确率': round(intent_accuracy, 4),         # 使用整体准确率
            '精确率': round(intent_macro_precision, 4),  # 使用Macro平均
            '召回率': round(intent_macro_recall, 4),     # 使用Macro平均
            'F1分数': round(intent_macro_f1, 4)          # 使用Macro平均
        },
        # --- 第5行：诉点三级（槽位） ---
        {
            '标签层级': f'{tag_type_name}三级',
            '准确率': round(third_level_accuracy, 4),    # 使用整体准确率
            '精确率': round(third_macro_precision, 4),   # 使用Macro平均
            '召回率': round(third_macro_recall, 4),      # 使用Macro平均
            'F1分数': round(third_macro_f1, 4)           # 使用Macro平均
        }
    ]
    
    return {
        'results_df_two_level': results_df_two_level,
        'results_df_three_level': results_df_three_level,
        'summary_rows': summary_rows
    }


def evaluate_single_level_tags(df, tag_config):
    """
    通用函数：评估单级标签（如解决状态）
    
    单级标签特点：
        - 只有一个层级，没有domain-intent-third_level的层次结构
        - 例如：解决状态 = ["已解决", "未解决", "部分解决"]
        - 相比多级标签，逻辑更简单，但计算方法相同
    
    参数:
        df: DataFrame，包含预测和修正标签的数据
        tag_config: 字典，包含标签配置信息
            - tag_type_name: 标签类型名称（如'解决状态'）
            - pred_col: 预测标签列名
            - corrected_col: 修正标签列名
    
    返回:
        dict: 包含评估结果的字典
            - results_df: 详细评估结果DataFrame（保存到详细Sheet）
            - summary_rows: 总体统计列表（保存到总体统计Sheet）
    """
    tag_type_name = tag_config['tag_type_name']
    pred_col = tag_config['pred_col']
    corrected_col = tag_config['corrected_col']
    
    # ========== 步骤1：数据验证和过滤 ==========
    # 检查必要的列是否存在
    required_columns = [pred_col, corrected_col]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据
    df_filtered = df[df[corrected_col].notna()].copy()
    
    if len(df_filtered) == 0:
        print(f"警告: 没有找到经过人工修正的{tag_type_name}标签数据")
        return None
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的{tag_type_name}标签数据进行评估")
    
    # 处理空值
    df_filtered.loc[:, pred_col] = df_filtered[pred_col].fillna('')
    df_filtered.loc[:, corrected_col] = df_filtered[corrected_col].fillna('')
    
    # ========== 步骤2：计算整体准确率 ==========
    # 整体准确率 = 正确预测的样本数 / 总样本数
    accuracy = (df_filtered[pred_col] == df_filtered[corrected_col]).mean()
    
    print(f"{tag_type_name}标签准确率: {accuracy:.4f}")
    
    # ========== 步骤3：单级标签详细评估 ==========
    # 获取所有唯一的真实标签
    unique_true_labels = sorted(df_filtered[corrected_col].unique())
    
    # 为每个标签计算指标
    evaluation_results = []
    
    for label in unique_true_labels:  # 例如：label = "已解决"
        label_mask = df_filtered[corrected_col] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
        
        # ===== 【二分类转换】 =====
        # 将多分类问题转换为二分类问题：是否为当前标签
        # 例如：当前label = "已解决"
        # 真实标签 = ["已解决", "未解决", "已解决", "部分解决", ...]
        # 转换后   = [1, 0, 1, 0, ...]  (1表示是"已解决"，0表示不是)
        y_true_binary = (df_filtered[corrected_col] == label).astype(int)
        y_pred_binary = (df_filtered[pred_col] == label).astype(int)
        
        # 使用sklearn计算二分类指标
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        evaluation_results.append({
            '标签类型': tag_type_name,
            '标签': label,
            '样本数量': label_count,
            '准确率': round(recall, 4),  # 准确率 = 召回率
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    results_df = pd.DataFrame(evaluation_results)
    
    # 计算Macro平均指标
    macro_precision = results_df['精确率'].mean() if not results_df.empty else 0
    macro_recall = results_df['召回率'].mean() if not results_df.empty else 0
    macro_f1 = results_df['F1分数'].mean() if not results_df.empty else 0
    
    # 汇总统计（以列表形式返回，每行一个层级）
    summary_rows = [
        {
            '标签层级': tag_type_name,
            '准确率': round(accuracy, 4),  # 使用整体准确率
            '精确率': round(macro_precision, 4),
            '召回率': round(macro_recall, 4),
            'F1分数': round(macro_f1, 4)
        }
    ]
    
    return {
        'results_df': results_df,
        'summary_rows': summary_rows
    }


def compute_confusion_matrices(df, tag_config):
    """
    计算多级标签的混淆矩阵（二级和三级标签）
    
    混淆矩阵说明：
        - 是一个N×N的方阵，N为标签数量
        - 行表示真实标签，列表示预测标签
        - 矩阵[i][j]表示：真实标签为i，预测标签为j的样本数量
        - 对角线元素：预测正确的样本数
        - 非对角线元素：预测错误的样本数
    
    参数:
        df: DataFrame，包含预测和修正标签的数据
        tag_config: 字典，包含标签配置信息
    
    返回:
        dict: 包含混淆矩阵的字典
            - cm_two_level: 二级标签混淆矩阵
            - cm_three_level: 三级标签混淆矩阵
            - labels_two_level: 二级标签列表
            - labels_three_level: 三级标签列表
            - tag_type_name: 标签类型名称
    """
    tag_type_name = tag_config['tag_type_name']
    domain_col = tag_config['domain_col']
    intent_col = tag_config['intent_col']
    third_level_col = tag_config['third_level_col']
    corrected_domain_col = tag_config['corrected_domain_col']
    corrected_intent_col = tag_config['corrected_intent_col']
    corrected_third_level_col = tag_config['corrected_third_level_col']
    
    # ========== 步骤1：数据过滤和预处理 ==========
    # 过滤数据，只保留有人工修正标签的数据
    df_filtered = df[df[corrected_domain_col].notna() & df[corrected_intent_col].notna()].copy()
    
    if len(df_filtered) == 0:
        print(f"警告: 没有找到经过人工修正的{tag_type_name}标签数据")
        return None
    
    # 处理空值，确保字符串拼接不会出错
    for col in [domain_col, intent_col, third_level_col, corrected_domain_col, corrected_intent_col, corrected_third_level_col]:
        df_filtered.loc[:, col] = df_filtered[col].fillna('')
    
    # ========== 步骤2：创建组合标签 ==========
    # 创建二级组合标签（domain-intent）
    # 例如："催收业务-催收违规"
    pred_two_level = (df_filtered[domain_col].astype(str) + '-' + df_filtered[intent_col].astype(str))
    true_two_level = (df_filtered[corrected_domain_col].astype(str) + '-' + df_filtered[corrected_intent_col].astype(str))
    
    # 创建三级组合标签（domain-intent-third_level）
    # 例如："催收业务-催收违规-频次过高"
    pred_three_level = (df_filtered[domain_col].astype(str) + '-' + 
                       df_filtered[intent_col].astype(str) + '-' + 
                       df_filtered[third_level_col].astype(str))
    true_three_level = (df_filtered[corrected_domain_col].astype(str) + '-' + 
                       df_filtered[corrected_intent_col].astype(str) + '-' + 
                       df_filtered[corrected_third_level_col].astype(str))
    
    # ========== 步骤3：获取所有唯一标签 ==========
    # 合并预测标签和真实标签，确保混淆矩阵包含所有可能的标签
    all_labels_two = sorted(set(list(pred_two_level) + list(true_two_level)))
    all_labels_three = sorted(set(list(pred_three_level) + list(true_three_level)))
    
    # ========== 步骤4：计算混淆矩阵 ==========
    # 使用sklearn的confusion_matrix函数
    # 注意：第一个参数是真实标签，第二个参数是预测标签
    cm_two_level = confusion_matrix(true_two_level, pred_two_level, labels=all_labels_two)
    cm_three_level = confusion_matrix(true_three_level, pred_three_level, labels=all_labels_three)
    
    return {
        'cm_two_level': cm_two_level,
        'cm_three_level': cm_three_level,
        'labels_two_level': all_labels_two,
        'labels_three_level': all_labels_three,
        'tag_type_name': tag_type_name
    }


def compute_single_confusion_matrix(df, tag_config):
    """
    计算单级标签的混淆矩阵
    """
    tag_type_name = tag_config['tag_type_name']
    pred_col = tag_config['pred_col']
    corrected_col = tag_config['corrected_col']
    
    # 过滤数据
    df_filtered = df[df[corrected_col].notna()].copy()
    
    if len(df_filtered) == 0:
        print(f"警告: 没有找到经过人工修正的{tag_type_name}标签数据")
        return None
    
    # 处理空值
    df_filtered.loc[:, pred_col] = df_filtered[pred_col].fillna('')
    df_filtered.loc[:, corrected_col] = df_filtered[corrected_col].fillna('')
    
    # 获取所有唯一标签
    all_labels = sorted(set(list(df_filtered[pred_col]) + list(df_filtered[corrected_col])))
    
    # 计算混淆矩阵
    cm = confusion_matrix(df_filtered[corrected_col], df_filtered[pred_col], labels=all_labels)
    
    return {
        'cm': cm,
        'labels': all_labels,
        'tag_type_name': tag_type_name
    }


def plot_confusion_matrix_heatmap(cm_data, save_path=None):
    """
    绘制混淆矩阵热力图并保存为PNG文件
    
    混淆矩阵说明：
        - 行：真实标签
        - 列：预测标签
        - 对角线：预测正确的数量
        - 非对角线：预测错误的数量
        - 总计行：每列预测标签的总数
        - 总计列：每行真实标签的总数
        - 右下角：总样本数
    
    参数：
        cm_data: 混淆矩阵数据字典
        save_path: 保存路径（PNG文件）
    """
    tag_type_name = cm_data['tag_type_name']
    
    # 判断是否为多级标签
    if 'cm_two_level' in cm_data:
        # 多级标签：只显示二级标签混淆矩阵
        cm_two = cm_data['cm_two_level']
        labels_two = cm_data['labels_two_level']
        
        # ===== 添加总计行和列 =====
        # 创建新矩阵，比原矩阵多一行一列
        cm_two_with_total = np.zeros((cm_two.shape[0] + 1, cm_two.shape[1] + 1))
        cm_two_with_total[:-1, :-1] = cm_two  # 原始数据
        cm_two_with_total[:-1, -1] = cm_two.sum(axis=1)  # 每行总计（真实标签的样本数）
        cm_two_with_total[-1, :-1] = cm_two.sum(axis=0)  # 每列总计（预测标签的样本数）
        cm_two_with_total[-1, -1] = cm_two.sum()  # 总样本数
        
        labels_two_with_total = list(labels_two) + ['总计']
        
        # 计算图片尺寸 - 更大的图片
        n_labels = len(labels_two_with_total)
        
        # 动态调整图片大小，最小12x10，根据标签数量增大
        fig_width = max(12, n_labels * 0.8)
        fig_height = max(10, n_labels * 0.7)
        
        fig, ax = plt.subplots(figsize=(fig_width, fig_height))
        
        # 计算字体大小
        font_size = max(10, min(14, 120 / n_labels))
        
        # 绘制二级标签混淆矩阵（带总计）
        sns.heatmap(cm_two_with_total, annot=True, fmt='.0f', cmap='Blues', 
                   xticklabels=labels_two_with_total, yticklabels=labels_two_with_total, ax=ax,
                   annot_kws={'size': font_size}, cbar_kws={'shrink': 0.8})
        
        ax.set_title(f'{tag_type_name} 混淆矩阵', fontsize=18, pad=30, fontweight='bold')
        ax.set_xlabel('预测标签', fontsize=14, fontweight='bold')
        ax.set_ylabel('真实标签', fontsize=14, fontweight='bold')
        
        # 设置刻度样式
        tick_font_size = max(9, min(12, 100 / n_labels))
        if n_labels > 8:
            ax.tick_params(axis='x', rotation=45, labelsize=tick_font_size)
        else:
            ax.tick_params(axis='x', rotation=0, labelsize=tick_font_size)
        ax.tick_params(axis='y', rotation=0, labelsize=tick_font_size)
            
    else:
        # 单级标签
        cm = cm_data['cm']
        labels = cm_data['labels']
        
        # 添加总计行和列
        cm_with_total = np.zeros((cm.shape[0] + 1, cm.shape[1] + 1))
        cm_with_total[:-1, :-1] = cm
        cm_with_total[:-1, -1] = cm.sum(axis=1)  # 每行总计
        cm_with_total[-1, :-1] = cm.sum(axis=0)  # 每列总计
        cm_with_total[-1, -1] = cm.sum()  # 总计
        
        labels_with_total = list(labels) + ['总计']
        n_labels = len(labels_with_total)
        
        # 动态调整图片大小 - 更大的图片
        fig_size = max(10, n_labels * 0.8)
        fig, ax = plt.subplots(figsize=(fig_size, fig_size))
        
        # 计算字体大小
        font_size = max(10, min(14, 120 / n_labels))
        
        # 绘制混淆矩阵（带总计）
        sns.heatmap(cm_with_total, annot=True, fmt='.0f', cmap='Greens', 
                   xticklabels=labels_with_total, yticklabels=labels_with_total, ax=ax,
                   annot_kws={'size': font_size}, cbar_kws={'shrink': 0.8})
        
        ax.set_title(f'{tag_type_name} 混淆矩阵', fontsize=18, pad=30, fontweight='bold')
        ax.set_xlabel('预测标签', fontsize=14, fontweight='bold')
        ax.set_ylabel('真实标签', fontsize=14, fontweight='bold')
        
        # 设置刻度样式
        tick_font_size = max(9, min(12, 100 / n_labels))
        if n_labels > 8:
            ax.tick_params(axis='x', rotation=45, labelsize=tick_font_size)
        else:
            ax.tick_params(axis='x', rotation=0, labelsize=tick_font_size)
        ax.tick_params(axis='y', rotation=0, labelsize=tick_font_size)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"热力图已保存到: {save_path}")
        plt.close()  # 关闭图形，释放内存
    else:
        plt.close()  # 即使没有保存路径也关闭图形


def save_confusion_matrices_to_excel(all_cm_data, output_path):
    """
    将所有混淆矩阵保存到Excel文件
    """
    print(f"正在保存混淆矩阵到: {output_path}")
    
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        for tag_key, cm_data in all_cm_data.items():
            if cm_data is None:
                continue
                
            tag_type_name = cm_data['tag_type_name']
            
            # 判断是否为多级标签
            if 'cm_two_level' in cm_data and 'cm_three_level' in cm_data:
                # 保存二级标签混淆矩阵（带总计）
                cm_two = cm_data['cm_two_level']
                labels_two = cm_data['labels_two_level']
                
                # 添加总计行和列
                cm_two_with_total = np.zeros((cm_two.shape[0] + 1, cm_two.shape[1] + 1))
                cm_two_with_total[:-1, :-1] = cm_two
                cm_two_with_total[:-1, -1] = cm_two.sum(axis=1)
                cm_two_with_total[-1, :-1] = cm_two.sum(axis=0)
                cm_two_with_total[-1, -1] = cm_two.sum()
                
                labels_two_with_total = list(labels_two) + ['总计']
                cm_two_df = pd.DataFrame(
                    cm_two_with_total, 
                    index=labels_two_with_total, 
                    columns=labels_two_with_total
                )
                sheet_name_two = f'{tag_type_name}-二级混淆矩阵'
                cm_two_df.to_excel(writer, sheet_name=sheet_name_two)
                
                # 保存三级标签混淆矩阵（带总计）
                cm_three = cm_data['cm_three_level']
                labels_three = cm_data['labels_three_level']
                
                # 添加总计行和列
                cm_three_with_total = np.zeros((cm_three.shape[0] + 1, cm_three.shape[1] + 1))
                cm_three_with_total[:-1, :-1] = cm_three
                cm_three_with_total[:-1, -1] = cm_three.sum(axis=1)
                cm_three_with_total[-1, :-1] = cm_three.sum(axis=0)
                cm_three_with_total[-1, -1] = cm_three.sum()
                
                labels_three_with_total = list(labels_three) + ['总计']
                cm_three_df = pd.DataFrame(
                    cm_three_with_total, 
                    index=labels_three_with_total, 
                    columns=labels_three_with_total
                )
                sheet_name_three = f'{tag_type_name}-三级混淆矩阵'
                cm_three_df.to_excel(writer, sheet_name=sheet_name_three)
                
            else:
                # 单级标签（带总计）
                cm = cm_data['cm']
                labels = cm_data['labels']
                
                # 添加总计行和列
                cm_with_total = np.zeros((cm.shape[0] + 1, cm.shape[1] + 1))
                cm_with_total[:-1, :-1] = cm
                cm_with_total[:-1, -1] = cm.sum(axis=1)
                cm_with_total[-1, :-1] = cm.sum(axis=0)
                cm_with_total[-1, -1] = cm.sum()
                
                labels_with_total = list(labels) + ['总计']
                cm_df = pd.DataFrame(
                    cm_with_total, 
                    index=labels_with_total, 
                    columns=labels_with_total
                )
                sheet_name = f'{tag_type_name}混淆矩阵'
                cm_df.to_excel(writer, sheet_name=sheet_name)
    
    print(f"混淆矩阵已保存至: {output_path}")


def evaluate_all_tags(file_path):
    """
    主函数：评估所有标签类型的准确性并生成完整报告
    
    处理的标签类型：
        1. 诉点（多级标签）：complaint_domain, complaint_intent, complaint_third_level
        2. 诉求（多级标签）：appeal_domain, appeal_intent, appeal_third_level  
        3. 解决方案（多级标签）：solution_domain, solution_intent, solution_third_level
        4. 解决状态（单级标签）：reconciliation_status
    
    输出文件：
        1. {输入文件名}_all_evaluation.xlsx - 评估指标
        2. {输入文件名}_confusion_matrix.xlsx - 混淆矩阵
        3. 4个PNG热力图文件
    
    参数：
        file_path: 输入Excel文件的绝对路径
    
    返回：
        str: 输出Excel文件的路径
    """
    # ========== 步骤1：读取数据 ==========
    # 只读取一次数据，避免重复I/O操作
    print(f"正在读取数据文件: {file_path}")
    df = pd.read_excel(file_path)
    print(f"数据读取完成，共 {len(df)} 条记录\n")

    # 用于存储所有标签类型的评估结果
    all_results = {}

    # ========== 步骤2：评估各类标签 ==========
    
    # --- 2.1 评估诉点标签（多级标签） ---
    print("=" * 60)
    print("开始评估诉点标签...")
    print("=" * 60)
    try:
        # 配置诉点标签的列名映射
        complaint_config = {
            'tag_type_name': '诉点',
            'domain_col': 'complaint_domain',              # 预测的领域列
            'intent_col': 'complaint_intent',              # 预测的意图列
            'third_level_col': 'complaint_third_level',    # 预测的槽位列
            'corrected_domain_col': 'corrected_complaint_domain',        # 修正的领域列
            'corrected_intent_col': 'corrected_complaint_intent',        # 修正的意图列
            'corrected_third_level_col': 'corrected_complaint_third_level'  # 修正的槽位列
        }
        # 调用多级标签评估函数
        complaint_result = evaluate_multi_level_tags(df, complaint_config)
        if complaint_result:
            all_results['complaint'] = complaint_result  # 保存结果
    except Exception as e:
        print(f"诉点标签评估失败: {str(e)}")
        import traceback
        traceback.print_exc()

    # 评估诉求标签
    print("\n" + "=" * 60)
    print("开始评估诉求标签...")
    print("=" * 60)
    try:
        appeal_config = {
            'tag_type_name': '诉求',
            'domain_col': 'appeal_domain',
            'intent_col': 'appeal_intent',
            'third_level_col': 'appeal_third_level',
            'corrected_domain_col': 'corrected_appeal_domain',
            'corrected_intent_col': 'corrected_appeal_intent',
            'corrected_third_level_col': 'corrected_appeal_third_level'
        }
        appeal_result = evaluate_multi_level_tags(df, appeal_config)
        if appeal_result:
            all_results['appeal'] = appeal_result
    except Exception as e:
        print(f"诉求标签评估失败: {str(e)}")
        import traceback
        traceback.print_exc()

    # 评估解决方案标签
    print("\n" + "=" * 60)
    print("开始评估解决方案标签...")
    print("=" * 60)
    try:
        solution_config = {
            'tag_type_name': '解决方案',
            'domain_col': 'solution_domain',
            'intent_col': 'solution_intent',
            'third_level_col': 'solution_third_level',
            'corrected_domain_col': 'corrected_solution_domain',
            'corrected_intent_col': 'corrected_solution_intent',
            'corrected_third_level_col': 'corrected_solution_third_level'
        }
        solution_result = evaluate_multi_level_tags(df, solution_config)
        if solution_result:
            all_results['solution'] = solution_result
    except Exception as e:
        print(f"解决方案标签评估失败: {str(e)}")
        import traceback
        traceback.print_exc()

    # 评估解决状态标签
    print("\n" + "=" * 60)
    print("开始评估解决状态标签...")
    print("=" * 60)
    try:
        reconciliation_config = {
            'tag_type_name': '解决状态',
            'pred_col': 'reconciliation_status',
            'corrected_col': 'corrected_reconciliation_status'
        }
        reconciliation_result = evaluate_single_level_tags(df, reconciliation_config)
        if reconciliation_result:
            all_results['reconciliation'] = reconciliation_result
    except Exception as e:
        print(f"解决状态标签评估失败: {str(e)}")
        import traceback
        traceback.print_exc()

    # ========== 步骤3：计算混淆矩阵 ==========
    print("\n" + "=" * 60)
    print("开始计算混淆矩阵...")
    print("=" * 60)
    
    # 用于存储所有标签类型的混淆矩阵数据
    all_cm_data = {}
    
    # --- 3.1 计算诉点混淆矩阵 ---
    if 'complaint' in all_results:
        try:
            complaint_cm = compute_confusion_matrices(df, complaint_config)
            if complaint_cm:
                all_cm_data['complaint'] = complaint_cm
        except Exception as e:
            print(f"诉点混淆矩阵计算失败: {str(e)}")
    
    # --- 3.2 计算诉求混淆矩阵 ---
    if 'appeal' in all_results:
        try:
            appeal_cm = compute_confusion_matrices(df, appeal_config)
            if appeal_cm:
                all_cm_data['appeal'] = appeal_cm
        except Exception as e:
            print(f"诉求混淆矩阵计算失败: {str(e)}")
    
    # --- 3.3 计算解决方案混淆矩阵 ---
    if 'solution' in all_results:
        try:
            solution_cm = compute_confusion_matrices(df, solution_config)
            if solution_cm:
                all_cm_data['solution'] = solution_cm
        except Exception as e:
            print(f"解决方案混淆矩阵计算失败: {str(e)}")
    
    # --- 3.4 计算解决状态混淆矩阵（单级标签） ---
    if 'reconciliation' in all_results:
        try:
            reconciliation_cm = compute_single_confusion_matrix(df, reconciliation_config)
            if reconciliation_cm:
                all_cm_data['reconciliation'] = reconciliation_cm
        except Exception as e:
            print(f"解决状态混淆矩阵计算失败: {str(e)}")

    # ========== 步骤4：生成输出文件 ==========
    
    # 检查是否有评估结果
    if not all_results:
        print("\n警告: 没有生成任何评估结果")
        return None

    # --- 4.1 创建输出文件夹 ---
    # 在输入文件所在目录下创建以输入文件名命名的文件夹
    input_dir = os.path.dirname(file_path)  # 输入文件所在目录
    input_filename = os.path.splitext(os.path.basename(file_path))[0]  # 输入文件名（不含扩展名）
    output_folder = os.path.join(input_dir, input_filename)  # 输出文件夹路径
    
    # 如果文件夹不存在则创建
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        print(f"\n已创建输出文件夹: {output_folder}")
    else:
        print(f"\n输出文件夹已存在: {output_folder}")
    
    # --- 4.2 设置输出文件路径 ---
    output_path = os.path.join(output_folder, f'{input_filename}_all_evaluation.xlsx')
    print(f"正在保存所有评估结果到: {output_path}")

    # --- 4.3 保存评估指标Excel文件 ---
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        # 合并所有总体统计数据
        # 每个标签类型的summary_rows会被合并到一个总体统计表中
        all_summary_rows = []
        
        for tag_key, result in all_results.items():
            if 'summary_rows' in result:
                all_summary_rows.extend(result['summary_rows'])
        
        # 保存总体统计Sheet（汇总所有标签层级的指标）
        if all_summary_rows:
            summary_df = pd.DataFrame(all_summary_rows)
            summary_df.to_excel(writer, sheet_name='总体统计', index=False)

        # 按照指定顺序保存详细评估结果Sheet
        
        # Sheet 1: 诉点-领域意图（二级标签详细结果）
        if 'complaint' in all_results and 'results_df_two_level' in all_results['complaint']:
            all_results['complaint']['results_df_two_level'].to_excel(
                writer, sheet_name='诉点-领域意图', index=False)

        # Sheet 2: 诉求-领域意图（二级标签详细结果）
        if 'appeal' in all_results and 'results_df_two_level' in all_results['appeal']:
            all_results['appeal']['results_df_two_level'].to_excel(
                writer, sheet_name='诉求-领域意图', index=False)

        # Sheet 3: 解决方案-领域意图（二级标签详细结果）
        if 'solution' in all_results and 'results_df_two_level' in all_results['solution']:
            all_results['solution']['results_df_two_level'].to_excel(
                writer, sheet_name='解决方案-领域意图', index=False)

        # Sheet 4: 解决状态（单级标签详细结果）
        if 'reconciliation' in all_results and 'results_df' in all_results['reconciliation']:
            all_results['reconciliation']['results_df'].to_excel(
                writer, sheet_name='解决状态', index=False)

        # Sheet 5: 诉点-领域意图槽位（三级标签详细结果）
        if 'complaint' in all_results and 'results_df_three_level' in all_results['complaint']:
            all_results['complaint']['results_df_three_level'].to_excel(
                writer, sheet_name='诉点-领域意图槽位', index=False)

        # Sheet 6: 诉求-领域意图槽位（三级标签详细结果）
        if 'appeal' in all_results and 'results_df_three_level' in all_results['appeal']:
            all_results['appeal']['results_df_three_level'].to_excel(
                writer, sheet_name='诉求-领域意图槽位', index=False)

        # Sheet 7: 解决方案-领域意图槽位（三级标签详细结果）
        if 'solution' in all_results and 'results_df_three_level' in all_results['solution']:
            all_results['solution']['results_df_three_level'].to_excel(
                writer, sheet_name='解决方案-领域意图槽位', index=False)

    print(f"所有评估结果已保存至: {output_path}")

    # --- 4.4 保存混淆矩阵Excel文件 ---
    if all_cm_data:
        cm_output_path = os.path.join(output_folder, f'{input_filename}_confusion_matrix.xlsx')
        save_confusion_matrices_to_excel(all_cm_data, cm_output_path)

        # --- 4.5 保存混淆矩阵热力图PNG文件 ---
        print("\n" + "=" * 60)
        print("开始保存混淆矩阵热力图...")
        print("=" * 60)

        # 遍历所有混淆矩阵数据，生成对应的热力图
        for tag_key, cm_data in all_cm_data.items():
            if cm_data is not None:
                tag_type_name = cm_data['tag_type_name']  # 例如："诉点"
                heatmap_path = os.path.join(output_folder, f'{tag_type_name}_混淆矩阵.png')
                print(f"正在保存 {tag_type_name} 混淆矩阵热力图...")
                # 调用热力图绘制函数，保存为PNG文件
                plot_confusion_matrix_heatmap(cm_data, save_path=heatmap_path)

        print("\n所有热力图已保存完成")

    return output_path  # 返回主要输出文件路径


def main():
    """
    主程序入口函数
    
    功能：
        1. 处理命令行参数（可选的输入文件路径）
        2. 调用evaluate_all_tags函数执行评估
        3. 处理异常和输出结果信息
    
    使用方法：
        python data_analysis_2.0.py                    # 使用默认文件路径
        python data_analysis_2.0.py "your_file.xlsx"   # 使用指定文件路径
    """
    # 默认输入文件路径（可根据实际情况修改）
    file_path = r"C:\Users\T14P\Desktop\benchmark_1800_taggedv1.5_promptv1.3.xlsx"

    # 检查是否提供了命令行参数（输入文件路径）
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        print(f"使用命令行指定的文件路径: {file_path}")
    else:
        print(f"使用默认文件路径: {file_path}")

    try:
        # 调用主评估函数
        result_path = evaluate_all_tags(file_path)
        
        # 输出结果信息
        if result_path:
            print(f"\n{'='*60}")
            print("🎉 评估完成！")
            print(f"📊 主要结果文件: {result_path}")
            print(f"📁 所有输出文件已保存到: {os.path.dirname(result_path)}")
            print(f"{'='*60}")
        else:
            print("❌ 评估失败，请检查输入文件和数据格式")
            
    except FileNotFoundError:
        print(f"❌ 错误：找不到输入文件 {file_path}")
        print("请检查文件路径是否正确")
    except Exception as e:
        print(f"❌ 程序执行出错: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
