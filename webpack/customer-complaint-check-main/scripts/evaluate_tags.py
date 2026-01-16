"""
标签评估脚本（前端服务版）
基于 data_analysis_2.0.py 的完整评估逻辑
====================================

功能：
- 评估诉点、诉求、解决方案（多级标签）
- 评估和解状态（单级标签）
- 生成详细的评估报告（*_all_evaluation.xlsx）

输出格式与 data_analysis_2.0.py 保持一致
适配前端服务调用
"""

import pandas as pd
import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score
import os
import sys


def evaluate_multi_level_tags(df, tag_config):
    """
    通用函数：评估多级标签（domain-intent-third_level）
    
    参数:
        df: DataFrame，包含预测和修正标签的数据
        tag_config: 字典，包含标签配置信息
    
    返回:
        dict: 包含评估结果的字典
    """
    tag_type_name = tag_config['tag_type_name']
    domain_col = tag_config['domain_col']
    intent_col = tag_config['intent_col']
    third_level_col = tag_config['third_level_col']
    corrected_domain_col = tag_config['corrected_domain_col']
    corrected_intent_col = tag_config['corrected_intent_col']
    corrected_third_level_col = tag_config['corrected_third_level_col']
    
    # 检查必要的列是否存在
    required_columns = [
        domain_col, intent_col, third_level_col,
        corrected_domain_col, corrected_intent_col, corrected_third_level_col
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据
    df_filtered = df[df[corrected_domain_col].notna() & df[corrected_intent_col].notna()].copy()
    
    if len(df_filtered) == 0:
        print(f"警告: 没有找到经过人工修正的{tag_type_name}标签数据")
        return None
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的{tag_type_name}标签数据进行评估")
    
    # 处理空值
    df_filtered.loc[:, domain_col] = df_filtered[domain_col].fillna('')
    df_filtered.loc[:, intent_col] = df_filtered[intent_col].fillna('')
    df_filtered.loc[:, third_level_col] = df_filtered[third_level_col].fillna('')
    df_filtered.loc[:, corrected_domain_col] = df_filtered[corrected_domain_col].fillna('')
    df_filtered.loc[:, corrected_intent_col] = df_filtered[corrected_intent_col].fillna('')
    df_filtered.loc[:, corrected_third_level_col] = df_filtered[corrected_third_level_col].fillna('')
    
    # 创建二级组合标签（domain-intent）
    full_tag_pred_col = f'{tag_type_name}_full_tag_pred'
    full_tag_true_col = f'{tag_type_name}_full_tag_true'
    df_filtered.loc[:, full_tag_pred_col] = (
        df_filtered[domain_col].astype(str) + '-' + df_filtered[intent_col].astype(str)
    )
    df_filtered.loc[:, full_tag_true_col] = (
        df_filtered[corrected_domain_col].astype(str) + '-' + df_filtered[corrected_intent_col].astype(str)
    )

    # 创建三级组合标签（domain-intent-third_level）
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
    
    # 计算整体准确率
    overall_accuracy = (df_filtered[full_tag_pred_col] == df_filtered[full_tag_true_col]).mean()
    overall_three_level_accuracy = (df_filtered[full_tag_third_pred_col] == df_filtered[full_tag_third_true_col]).mean()
    domain_accuracy = (df_filtered[domain_col] == df_filtered[corrected_domain_col]).mean()
    intent_accuracy = (df_filtered[intent_col] == df_filtered[corrected_intent_col]).mean()
    third_level_accuracy = (df_filtered[third_level_col] == df_filtered[corrected_third_level_col]).mean()
    
    print(f"{tag_type_name}标签整体准确率 (domain-intent-third): {overall_three_level_accuracy:.4f}")
    print(f"{tag_type_name}标签整体准确率 (domain-intent): {overall_accuracy:.4f}")
    print(f"{tag_type_name}一级标签准确率 (domain): {domain_accuracy:.4f}")
    print(f"{tag_type_name}二级标签准确率 (intent): {intent_accuracy:.4f}")
    print(f"{tag_type_name}三级标签准确率 (third_level): {third_level_accuracy:.4f}")
    
    # 二级标签详细评估
    unique_true_labels = sorted(df_filtered[full_tag_true_col].unique())
    evaluation_results = []
    
    for label in unique_true_labels:
        label_mask = df_filtered[full_tag_true_col] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
        
        y_true_binary = (df_filtered[full_tag_true_col] == label).astype(int)
        y_pred_binary = (df_filtered[full_tag_pred_col] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        parts = label.split('-')
        domain_part = parts[0] if len(parts) > 0 else ''
        intent_part = parts[1] if len(parts) > 1 else ''
        
        evaluation_results.append({
            '标签类型': tag_type_name,
            '完整标签': label,
            '一级标签': domain_part,
            '二级标签': intent_part,
            '样本数量': label_count,
            '准确率': round(recall, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    results_df_two_level = pd.DataFrame(evaluation_results)
    
    # 三级标签详细评估
    unique_true_labels_third = sorted(df_filtered[full_tag_third_true_col].unique())
    evaluation_results_third = []
    
    for label in unique_true_labels_third:
        label_mask = df_filtered[full_tag_third_true_col] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
        
        y_true_binary = (df_filtered[full_tag_third_true_col] == label).astype(int)
        y_pred_binary = (df_filtered[full_tag_third_pred_col] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
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
            '准确率': round(recall, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    results_df_three_level = pd.DataFrame(evaluation_results_third)
    
    # 计算各层级的Macro平均指标
    two_level_macro_precision = results_df_two_level['精确率'].mean() if not results_df_two_level.empty else 0
    two_level_macro_recall = results_df_two_level['召回率'].mean() if not results_df_two_level.empty else 0
    two_level_macro_f1 = results_df_two_level['F1分数'].mean() if not results_df_two_level.empty else 0
    
    three_level_macro_precision = results_df_three_level['精确率'].mean() if not results_df_three_level.empty else 0
    three_level_macro_recall = results_df_three_level['召回率'].mean() if not results_df_three_level.empty else 0
    three_level_macro_f1 = results_df_three_level['F1分数'].mean() if not results_df_three_level.empty else 0
    
    # 一级标签（领域）的Macro平均
    unique_domain_labels = sorted(df_filtered[corrected_domain_col].unique())
    domain_metrics = []
    
    for domain_label in unique_domain_labels:
        y_true_binary = (df_filtered[corrected_domain_col] == domain_label).astype(int)
        y_pred_binary = (df_filtered[domain_col] == domain_label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        domain_metrics.append({'precision': precision, 'recall': recall, 'f1': f1})
    
    domain_macro_precision = np.mean([m['precision'] for m in domain_metrics]) if domain_metrics else 0
    domain_macro_recall = np.mean([m['recall'] for m in domain_metrics]) if domain_metrics else 0
    domain_macro_f1 = np.mean([m['f1'] for m in domain_metrics]) if domain_metrics else 0
    
    # 二级标签（意图）的Macro平均
    unique_intent_labels = sorted(df_filtered[corrected_intent_col].unique())
    intent_metrics = []
    
    for intent_label in unique_intent_labels:
        y_true_binary = (df_filtered[corrected_intent_col] == intent_label).astype(int)
        y_pred_binary = (df_filtered[intent_col] == intent_label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        intent_metrics.append({'precision': precision, 'recall': recall, 'f1': f1})
    
    intent_macro_precision = np.mean([m['precision'] for m in intent_metrics]) if intent_metrics else 0
    intent_macro_recall = np.mean([m['recall'] for m in intent_metrics]) if intent_metrics else 0
    intent_macro_f1 = np.mean([m['f1'] for m in intent_metrics]) if intent_metrics else 0
    
    # 三级标签（槽位）的Macro平均
    unique_third_labels = sorted(df_filtered[corrected_third_level_col].unique())
    third_metrics = []
    
    for third_label in unique_third_labels:
        y_true_binary = (df_filtered[corrected_third_level_col] == third_label).astype(int)
        y_pred_binary = (df_filtered[third_level_col] == third_label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        third_metrics.append({'precision': precision, 'recall': recall, 'f1': f1})
    
    third_macro_precision = np.mean([m['precision'] for m in third_metrics]) if third_metrics else 0
    third_macro_recall = np.mean([m['recall'] for m in third_metrics]) if third_metrics else 0
    third_macro_f1 = np.mean([m['f1'] for m in third_metrics]) if third_metrics else 0
    
    # 构建总体统计表数据
    summary_rows = [
        {
            '标签层级': f'{tag_type_name}领域意图',
            '准确率': round(overall_accuracy, 4),
            '精确率': round(two_level_macro_precision, 4),
            '召回率': round(two_level_macro_recall, 4),
            'F1分数': round(two_level_macro_f1, 4)
        },
        {
            '标签层级': f'{tag_type_name}领域意图槽位',
            '准确率': round(overall_three_level_accuracy, 4),
            '精确率': round(three_level_macro_precision, 4),
            '召回率': round(three_level_macro_recall, 4),
            'F1分数': round(three_level_macro_f1, 4)
        },
        {
            '标签层级': f'{tag_type_name}一级',
            '准确率': round(domain_accuracy, 4),
            '精确率': round(domain_macro_precision, 4),
            '召回率': round(domain_macro_recall, 4),
            'F1分数': round(domain_macro_f1, 4)
        },
        {
            '标签层级': f'{tag_type_name}二级',
            '准确率': round(intent_accuracy, 4),
            '精确率': round(intent_macro_precision, 4),
            '召回率': round(intent_macro_recall, 4),
            'F1分数': round(intent_macro_f1, 4)
        },
        {
            '标签层级': f'{tag_type_name}三级',
            '准确率': round(third_level_accuracy, 4),
            '精确率': round(third_macro_precision, 4),
            '召回率': round(third_macro_recall, 4),
            'F1分数': round(third_macro_f1, 4)
        }
    ]
    
    return {
        'results_df_two_level': results_df_two_level,
        'results_df_three_level': results_df_three_level,
        'summary_rows': summary_rows
    }


def evaluate_single_level_tags(df, tag_config):
    """
    通用函数：评估单级标签（如和解状态）
    
    参数:
        df: DataFrame，包含预测和修正标签的数据
        tag_config: 字典，包含标签配置信息
    
    返回:
        dict: 包含评估结果的字典
    """
    tag_type_name = tag_config['tag_type_name']
    pred_col = tag_config['pred_col']
    corrected_col = tag_config['corrected_col']
    
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
    
    # 计算整体准确率
    accuracy = (df_filtered[pred_col] == df_filtered[corrected_col]).mean()
    
    print(f"{tag_type_name}标签整体准确率: {accuracy:.4f}")
    
    # 详细评估
    unique_true_labels = sorted(df_filtered[corrected_col].unique())
    evaluation_results = []
    
    for label in unique_true_labels:
        label_mask = df_filtered[corrected_col] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
        
        y_true_binary = (df_filtered[corrected_col] == label).astype(int)
        y_pred_binary = (df_filtered[pred_col] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        evaluation_results.append({
            '标签类型': tag_type_name,
            '标签': label,
            '样本数量': label_count,
            '准确率': round(recall, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    results_df = pd.DataFrame(evaluation_results)
    
    # 计算Macro平均
    macro_precision = results_df['精确率'].mean() if not results_df.empty else 0
    macro_recall = results_df['召回率'].mean() if not results_df.empty else 0
    macro_f1 = results_df['F1分数'].mean() if not results_df.empty else 0
    
    # 构建总体统计表数据
    summary_rows = [
        {
            '标签层级': tag_type_name,
            '准确率': round(accuracy, 4),
            '精确率': round(macro_precision, 4),
            '召回率': round(macro_recall, 4),
            'F1分数': round(macro_f1, 4)
        }
    ]
    
    return {
        'results_df': results_df,
        'summary_rows': summary_rows
    }


def evaluate_tagged_data(file_path, output_dir=None):
    """
    主函数：评估所有标签类型并生成完整报告
    
    功能:
    - 评估诉点、诉求、解决方案（多级标签）
    - 评估和解状态（单级标签）
    - 生成 *_all_evaluation.xlsx 报告
    
    参数:
        file_path: 输入Excel文件的绝对路径
        output_dir: 可选，指定输出目录。如果不指定，则保存在输入文件同目录
    
    返回:
        str: 输出Excel文件的路径
    """
    print(f"正在读取数据文件: {file_path}")
    df = pd.read_excel(file_path)
    print(f"数据读取完成，共 {len(df)} 条记录\n")

    # 检测是否为前端调用
    is_frontend_call = 'Temp' in file_path and 'uploaded_tagged_' in file_path

    # 用于存储所有标签类型的评估结果
    all_results = {}

    # 评估诉点标签
    print("=" * 60)
    print("开始评估诉点标签...")
    print("=" * 60)
    try:
        complaint_config = {
            'tag_type_name': '诉点',
            'domain_col': 'complaint_domain',
            'intent_col': 'complaint_intent',
            'third_level_col': 'complaint_third_level',
            'corrected_domain_col': 'corrected_complaint_domain',
            'corrected_intent_col': 'corrected_complaint_intent',
            'corrected_third_level_col': 'corrected_complaint_third_level'
        }
        complaint_result = evaluate_multi_level_tags(df, complaint_config)
        if complaint_result:
            all_results['complaint'] = complaint_result
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

    # 评估和解状态标签
    print("\n" + "=" * 60)
    print("开始评估和解状态标签...")
    print("=" * 60)
    try:
        reconciliation_config = {
            'tag_type_name': '和解状态',
            'pred_col': 'reconciliation_status',
            'corrected_col': 'corrected_reconciliation_status'
        }
        reconciliation_result = evaluate_single_level_tags(df, reconciliation_config)
        if reconciliation_result:
            all_results['reconciliation'] = reconciliation_result
    except Exception as e:
        print(f"和解状态标签评估失败: {str(e)}")
        import traceback
        traceback.print_exc()

    # 生成输出文件路径
    input_filename = os.path.splitext(os.path.basename(file_path))[0]
    
    if is_frontend_call:
        # 前端调用：直接保存到 evaluation_reports 目录
        current_dir = os.path.dirname(os.path.abspath(__file__))  # scripts 目录
        project_root = os.path.dirname(current_dir)  # 项目根目录
        eval_reports_dir = os.path.join(project_root, 'evaluation_reports')
        os.makedirs(eval_reports_dir, exist_ok=True)
        
        # 生成前端期望的文件名格式
        import uuid
        report_filename = f"evaluation_{uuid.uuid4().hex}.xlsx"
        output_path = os.path.join(eval_reports_dir, report_filename)
        print(f"检测到前端调用，直接保存到: {eval_reports_dir}")
    elif output_dir:
        # 指定了输出目录
        output_folder = output_dir
        os.makedirs(output_folder, exist_ok=True)
        output_path = os.path.join(output_folder, f'{input_filename}_all_evaluation.xlsx')
    else:
        # 默认：保存在输入文件同目录
        output_folder = os.path.dirname(file_path)
        output_path = os.path.join(output_folder, f'{input_filename}_all_evaluation.xlsx')
    
    print(f"\n正在保存评估结果到: {output_path}")

    # 保存评估指标Excel文件
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        # 合并所有总体统计数据
        all_summary_rows = []
        
        for tag_key, result in all_results.items():
            if 'summary_rows' in result:
                all_summary_rows.extend(result['summary_rows'])
        
        # 保存总体统计Sheet
        if all_summary_rows:
            summary_df = pd.DataFrame(all_summary_rows)
            summary_df.to_excel(writer, sheet_name='总体统计', index=False)

        # 保存详细评估结果Sheet
        if 'complaint' in all_results and 'results_df_two_level' in all_results['complaint']:
            all_results['complaint']['results_df_two_level'].to_excel(
                writer, sheet_name='诉点-领域意图', index=False)

        if 'appeal' in all_results and 'results_df_two_level' in all_results['appeal']:
            all_results['appeal']['results_df_two_level'].to_excel(
                writer, sheet_name='诉求-领域意图', index=False)

        if 'solution' in all_results and 'results_df_two_level' in all_results['solution']:
            all_results['solution']['results_df_two_level'].to_excel(
                writer, sheet_name='解决方案-领域意图', index=False)

        if 'reconciliation' in all_results and 'results_df' in all_results['reconciliation']:
            all_results['reconciliation']['results_df'].to_excel(
                writer, sheet_name='和解状态', index=False)

        if 'complaint' in all_results and 'results_df_three_level' in all_results['complaint']:
            all_results['complaint']['results_df_three_level'].to_excel(
                writer, sheet_name='诉点-领域意图槽位', index=False)

        if 'appeal' in all_results and 'results_df_three_level' in all_results['appeal']:
            all_results['appeal']['results_df_three_level'].to_excel(
                writer, sheet_name='诉求-领域意图槽位', index=False)

        if 'solution' in all_results and 'results_df_three_level' in all_results['solution']:
            all_results['solution']['results_df_three_level'].to_excel(
                writer, sheet_name='解决方案-领域意图槽位', index=False)

    print(f"评估结果已保存至: {output_path}")
    print("\n" + "=" * 60)
    print("🎉 评估完成！")
    print("=" * 60)
    
    return output_path


def main():
    """
    主程序入口函数
    """
    # 默认文件路径
    file_path = r"C:\Users\T14P\Desktop\benchmark_1800_taggedv1.5_promptv1.3.xlsx"

    # 检查命令行参数
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        print(f"使用命令行指定的文件路径: {file_path}")
    else:
        print(f"使用默认文件路径: {file_path}")

    try:
        result_path = evaluate_tagged_data(file_path)
        
        if result_path:
            print(f"\n📊 主要结果文件: {result_path}")
            print(f"📁 所有输出文件已保存到: {os.path.dirname(result_path)}")
        else:
            print("❌ 评估失败，请检查输入文件和数据格式")
            
    except FileNotFoundError:
        print(f"❌ 错误：找不到输入文件 {file_path}")
        return 1
    except Exception as e:
        print(f"❌ 评估过程中出现错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())