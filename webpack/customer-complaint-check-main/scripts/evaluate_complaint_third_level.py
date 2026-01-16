import pandas as pd
import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score
import os
import sys

# 添加项目根目录到路径中
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def evaluate_complaint_tags(file_path):
    """
    评估投诉标签的准确性，生成详细的评估报告
    包括以下指标：
    1. 准确率 (Accuracy)
    2. 精确率 (Precision)
    3. 召回率 (Recall)
    4. F1分数 (F1-Score)
    """
    # 读取标记数据
    df = pd.read_excel(file_path)
    
    # 检查必要的列是否存在
    required_columns = [
        'complaint_domain', 'complaint_intent',
        'corrected_complaint_domain', 'corrected_complaint_intent'
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据（即没有被人工检查过的数据）
    # 一二级分类基本不为空，三级标签有可能为空
    df_filtered = df[df['corrected_complaint_domain'].notna() & 
                     df['corrected_complaint_intent'].notna()].copy()
    
    if len(df_filtered) == 0:
        print("警告: 没有找到经过人工修正的投诉标签数据")
        return
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的投诉标签数据进行评估")
    
    # 处理空值，将其替换为空字符串以避免错误
    df_filtered.loc[:, 'complaint_domain'] = df_filtered['complaint_domain'].fillna('')
    df_filtered.loc[:, 'complaint_intent'] = df_filtered['complaint_intent'].fillna('')
    
    df_filtered.loc[:, 'corrected_complaint_domain'] = df_filtered['corrected_complaint_domain'].fillna('')
    df_filtered.loc[:, 'corrected_complaint_intent'] = df_filtered['corrected_complaint_intent'].fillna('')
    
    # 创建组合标签（domain-intent）
    df_filtered.loc[:, 'complaint_full_tag_pred'] = (
        df_filtered['complaint_domain'].astype(str) + '-' +
        df_filtered['complaint_intent'].astype(str)
    )
    
    df_filtered.loc[:, 'complaint_full_tag_true'] = (
        df_filtered['corrected_complaint_domain'].astype(str) + '-' +
        df_filtered['corrected_complaint_intent'].astype(str)
    )
    
    # 计算整体准确率
    overall_accuracy = (df_filtered['complaint_full_tag_pred'] == df_filtered['complaint_full_tag_true']).mean()
    
    # 计算 domain 准确率
    domain_accuracy = (df_filtered['complaint_domain'] == df_filtered['corrected_complaint_domain']).mean()
    
    # 计算 intent 准确率
    intent_accuracy = (df_filtered['complaint_intent'] == df_filtered['corrected_complaint_intent']).mean()
    
    print(f"投诉标签整体准确率 (domain-intent): {overall_accuracy:.4f}")
    print(f"投诉一级标签准确率 (domain): {domain_accuracy:.4f}")
    print(f"投诉二级标签准确率 (intent): {intent_accuracy:.4f}")
    
    # 获取所有唯一的真实标签
    unique_true_labels = sorted(df_filtered['complaint_full_tag_true'].unique())
    
    # 为每个标签计算指标
    evaluation_results = []
    
    for label in unique_true_labels:
        # 筛选当前标签的数据
        label_mask = df_filtered['complaint_full_tag_true'] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
            
        # 计算当前标签的准确预测数
        correct_predictions = (df_filtered[label_mask]['complaint_full_tag_pred'] == 
                              df_filtered[label_mask]['complaint_full_tag_true']).sum()
        
        # 计算准确率（对于单个类别，准确率就是召回率）
        label_accuracy = correct_predictions / label_count if label_count > 0 else 0
        
        # 使用sklearn计算精确率、召回率和F1分数
        # 创建二元分类标签
        y_true_binary = (df_filtered['complaint_full_tag_true'] == label).astype(int)
        y_pred_binary = (df_filtered['complaint_full_tag_pred'] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        # 提取标签组成部分
        parts = label.split('-')
        domain_part = parts[0] if len(parts) > 0 else ''
        intent_part = parts[1] if len(parts) > 1 else ''
        
        evaluation_results.append({
            '标签类型': '投诉',
            '完整标签': label,
            '一级标签': domain_part,
            '二级标签': intent_part,
            '样本数量': label_count,
            '准确率': round(label_accuracy, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    # 转换为DataFrame
    results_df = pd.DataFrame(evaluation_results)
    
    # 保存到Excel文件
    output_path = file_path.replace('.xlsx', '_complaint_evaluation.xlsx')
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        results_df.to_excel(writer, sheet_name='详细评估结果', index=False)
        
        # 创建汇总统计表
        summary_data = {
            '指标': ['投诉标签整体准确率', '投诉一级标签准确率', '投诉二级标签准确率'],
            '数值': [round(overall_accuracy, 4), round(domain_accuracy, 4), round(intent_accuracy, 4)]
        }
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='总体统计', index=False)
    
    print(f"投诉标签评估报告已保存至: {output_path}")
    return output_path

def evaluate_appeal_tags(file_path):
    """
    评估诉求标签的准确性，生成详细的评估报告
    """
    # 读取标记数据
    df = pd.read_excel(file_path)
    
    # 检查必要的列是否存在
    required_columns = [
        'appeal_domain', 'appeal_intent',
        'corrected_appeal_domain', 'corrected_appeal_intent'
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据
    df_filtered = df[df['corrected_appeal_domain'].notna() & 
                     df['corrected_appeal_intent'].notna()].copy()
    
    if len(df_filtered) == 0:
        print("警告: 没有找到经过人工修正的诉求标签数据")
        return
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的诉求标签数据进行评估")
    
    # 处理空值，将其替换为空字符串以避免错误
    df_filtered.loc[:, 'appeal_domain'] = df_filtered['appeal_domain'].fillna('')
    df_filtered.loc[:, 'appeal_intent'] = df_filtered['appeal_intent'].fillna('')
    
    df_filtered.loc[:, 'corrected_appeal_domain'] = df_filtered['corrected_appeal_domain'].fillna('')
    df_filtered.loc[:, 'corrected_appeal_intent'] = df_filtered['corrected_appeal_intent'].fillna('')
    
    # 创建组合标签（domain-intent）
    df_filtered.loc[:, 'appeal_full_tag_pred'] = (
        df_filtered['appeal_domain'].astype(str) + '-' +
        df_filtered['appeal_intent'].astype(str)
    )
    
    df_filtered.loc[:, 'appeal_full_tag_true'] = (
        df_filtered['corrected_appeal_domain'].astype(str) + '-' +
        df_filtered['corrected_appeal_intent'].astype(str)
    )
    
    # 计算整体准确率
    overall_accuracy = (df_filtered['appeal_full_tag_pred'] == df_filtered['appeal_full_tag_true']).mean()
    
    # 计算 domain 准确率
    domain_accuracy = (df_filtered['appeal_domain'] == df_filtered['corrected_appeal_domain']).mean()
    
    # 计算 intent 准确率
    intent_accuracy = (df_filtered['appeal_intent'] == df_filtered['corrected_appeal_intent']).mean()
    
    print(f"诉求标签整体准确率 (domain-intent): {overall_accuracy:.4f}")
    print(f"诉求一级标签准确率 (domain): {domain_accuracy:.4f}")
    print(f"诉求二级标签准确率 (intent): {intent_accuracy:.4f}")
    
    # 获取所有唯一的真实标签
    unique_true_labels = sorted(df_filtered['appeal_full_tag_true'].unique())
    
    # 为每个标签计算指标
    evaluation_results = []
    
    for label in unique_true_labels:
        # 筛选当前标签的数据
        label_mask = df_filtered['appeal_full_tag_true'] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
            
        # 计算当前标签的准确预测数
        correct_predictions = (df_filtered[label_mask]['appeal_full_tag_pred'] == 
                              df_filtered[label_mask]['appeal_full_tag_true']).sum()
        
        # 计算准确率（对于单个类别，准确率就是召回率）
        label_accuracy = correct_predictions / label_count if label_count > 0 else 0
        
        # 使用sklearn计算精确率、召回率和F1分数
        # 创建二元分类标签
        y_true_binary = (df_filtered['appeal_full_tag_true'] == label).astype(int)
        y_pred_binary = (df_filtered['appeal_full_tag_pred'] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        # 提取标签组成部分
        parts = label.split('-')
        domain_part = parts[0] if len(parts) > 0 else ''
        intent_part = parts[1] if len(parts) > 1 else ''
        
        evaluation_results.append({
            '标签类型': '诉求',
            '完整标签': label,
            '一级标签': domain_part,
            '二级标签': intent_part,
            '样本数量': label_count,
            '准确率': round(label_accuracy, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    # 转换为DataFrame
    results_df = pd.DataFrame(evaluation_results)
    
    # 保存到Excel文件
    output_path = file_path.replace('.xlsx', '_appeal_evaluation.xlsx')
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        results_df.to_excel(writer, sheet_name='详细评估结果', index=False)
        
        # 创建汇总统计表
        summary_data = {
            '指标': ['诉求标签整体准确率', '诉求一级标签准确率', '诉求二级标签准确率'],
            '数值': [round(overall_accuracy, 4), round(domain_accuracy, 4), round(intent_accuracy, 4)]
        }
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='总体统计', index=False)
    
    print(f"诉求标签评估报告已保存至: {output_path}")
    return output_path

def evaluate_solution_tags(file_path):
    """
    评估解决方案标签的准确性，生成详细的评估报告
    """
    # 读取标记数据
    df = pd.read_excel(file_path)
    
    # 检查必要的列是否存在
    required_columns = [
        'solution_domain', 'solution_intent',
        'corrected_solution_domain', 'corrected_solution_intent'
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据
    df_filtered = df[df['corrected_solution_domain'].notna() & 
                     df['corrected_solution_intent'].notna()].copy()
    
    if len(df_filtered) == 0:
        print("警告: 没有找到经过人工修正的解决方案标签数据")
        return
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的解决方案标签数据进行评估")
    
    # 处理空值，将其替换为空字符串以避免错误
    df_filtered.loc[:, 'solution_domain'] = df_filtered['solution_domain'].fillna('')
    df_filtered.loc[:, 'solution_intent'] = df_filtered['solution_intent'].fillna('')
    
    df_filtered.loc[:, 'corrected_solution_domain'] = df_filtered['corrected_solution_domain'].fillna('')
    df_filtered.loc[:, 'corrected_solution_intent'] = df_filtered['corrected_solution_intent'].fillna('')
    
    # 创建组合标签（domain-intent）
    df_filtered.loc[:, 'solution_full_tag_pred'] = (
        df_filtered['solution_domain'].astype(str) + '-' +
        df_filtered['solution_intent'].astype(str)
    )
    
    df_filtered.loc[:, 'solution_full_tag_true'] = (
        df_filtered['corrected_solution_domain'].astype(str) + '-' +
        df_filtered['corrected_solution_intent'].astype(str)
    )
    
    # 计算整体准确率
    overall_accuracy = (df_filtered['solution_full_tag_pred'] == df_filtered['solution_full_tag_true']).mean()
    
    # 计算 domain 准确率
    domain_accuracy = (df_filtered['solution_domain'] == df_filtered['corrected_solution_domain']).mean()
    
    # 计算 intent 准确率
    intent_accuracy = (df_filtered['solution_intent'] == df_filtered['corrected_solution_intent']).mean()
    
    print(f"解决方案标签整体准确率 (domain-intent): {overall_accuracy:.4f}")
    print(f"解决方案一级标签准确率 (domain): {domain_accuracy:.4f}")
    print(f"解决方案二级标签准确率 (intent): {intent_accuracy:.4f}")
    
    # 获取所有唯一的真实标签
    unique_true_labels = sorted(df_filtered['solution_full_tag_true'].unique())
    
    # 为每个标签计算指标
    evaluation_results = []
    
    for label in unique_true_labels:
        # 筛选当前标签的数据
        label_mask = df_filtered['solution_full_tag_true'] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
            
        # 计算当前标签的准确预测数
        correct_predictions = (df_filtered[label_mask]['solution_full_tag_pred'] == 
                              df_filtered[label_mask]['solution_full_tag_true']).sum()
        
        # 计算准确率（对于单个类别，准确率就是召回率）
        label_accuracy = correct_predictions / label_count if label_count > 0 else 0
        
        # 使用sklearn计算精确率、召回率和F1分数
        # 创建二元分类标签
        y_true_binary = (df_filtered['solution_full_tag_true'] == label).astype(int)
        y_pred_binary = (df_filtered['solution_full_tag_pred'] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        # 提取标签组成部分
        parts = label.split('-')
        domain_part = parts[0] if len(parts) > 0 else ''
        intent_part = parts[1] if len(parts) > 1 else ''
        
        evaluation_results.append({
            '标签类型': '解决方案',
            '完整标签': label,
            '一级标签': domain_part,
            '二级标签': intent_part,
            '样本数量': label_count,
            '准确率': round(label_accuracy, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    # 转换为DataFrame
    results_df = pd.DataFrame(evaluation_results)
    
    # 保存到Excel文件
    output_path = file_path.replace('.xlsx', '_solution_evaluation.xlsx')
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        results_df.to_excel(writer, sheet_name='详细评估结果', index=False)
        
        # 创建汇总统计表
        summary_data = {
            '指标': ['解决方案标签整体准确率', '解决方案一级标签准确率', '解决方案二级标签准确率'],
            '数值': [round(overall_accuracy, 4), round(domain_accuracy, 4), round(intent_accuracy, 4)]
        }
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='总体统计', index=False)
    
    print(f"解决方案标签评估报告已保存至: {output_path}")
    return output_path

def evaluate_reconciliation_tags(file_path):
    """
    评估解决状态标签的准确性，生成详细的评估报告
    """
    # 读取标记数据
    df = pd.read_excel(file_path)
    
    # 检查必要的列是否存在
    required_columns = [
        'reconciliation_status',
        'corrected_reconciliation_status'
    ]
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"缺少必要列: {col}")
    
    # 过滤掉没有人工修正标签的数据
    df_filtered = df[df['corrected_reconciliation_status'].notna()].copy()
    
    if len(df_filtered) == 0:
        print("警告: 没有找到经过人工修正的解决状态标签数据")
        return
    
    print(f"使用 {len(df_filtered)} 条经过人工修正的解决状态标签数据进行评估")
    
    # 处理空值，将其替换为空字符串以避免错误
    df_filtered.loc[:, 'reconciliation_status'] = df_filtered['reconciliation_status'].fillna('')
    df_filtered.loc[:, 'corrected_reconciliation_status'] = df_filtered['corrected_reconciliation_status'].fillna('')
    
    # 计算准确率
    accuracy = (df_filtered['reconciliation_status'] == df_filtered['corrected_reconciliation_status']).mean()
    
    print(f"解决状态标签准确率: {accuracy:.4f}")
    
    # 获取所有唯一的真实标签
    unique_true_labels = sorted(df_filtered['corrected_reconciliation_status'].unique())
    
    # 为每个标签计算指标
    evaluation_results = []
    
    for label in unique_true_labels:
        # 筛选当前标签的数据
        label_mask = df_filtered['corrected_reconciliation_status'] == label
        label_count = label_mask.sum()
        
        if label_count == 0:
            continue
            
        # 计算当前标签的准确预测数
        correct_predictions = (df_filtered[label_mask]['reconciliation_status'] == 
                              df_filtered[label_mask]['corrected_reconciliation_status']).sum()
        
        # 计算准确率（对于单个类别，准确率就是召回率）
        label_accuracy = correct_predictions / label_count if label_count > 0 else 0
        
        # 使用sklearn计算精确率、召回率和F1分数
        # 创建二元分类标签
        y_true_binary = (df_filtered['corrected_reconciliation_status'] == label).astype(int)
        y_pred_binary = (df_filtered['reconciliation_status'] == label).astype(int)
        
        precision = precision_score(y_true_binary, y_pred_binary, zero_division=0)
        recall = recall_score(y_true_binary, y_pred_binary, zero_division=0)
        f1 = f1_score(y_true_binary, y_pred_binary, zero_division=0)
        
        evaluation_results.append({
            '标签类型': '解决状态',
            '标签': label,
            '样本数量': label_count,
            '准确率': round(label_accuracy, 4),
            '精确率': round(precision, 4),
            '召回率': round(recall, 4),
            'F1分数': round(f1, 4)
        })
    
    # 转换为DataFrame
    results_df = pd.DataFrame(evaluation_results)
    
    # 保存到Excel文件
    output_path = file_path.replace('.xlsx', '_reconciliation_evaluation.xlsx')
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        results_df.to_excel(writer, sheet_name='详细评估结果', index=False)
        
        # 创建汇总统计表
        summary_data = {
            '指标': ['解决状态标签准确率'],
            '数值': [round(accuracy, 4)]
        }
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='总体统计', index=False)
    
    print(f"解决状态标签评估报告已保存至: {output_path}")
    return output_path

def evaluate_all_tags(file_path):
    """
    评估所有标签（投诉、诉求、解决方案和解决状态）的准确性
    """
    print("开始评估投诉标签...")
    evaluate_complaint_tags(file_path)
    
    print("\n开始评估诉求标签...")
    evaluate_appeal_tags(file_path)
    
    print("\n开始评估解决方案标签...")
    evaluate_solution_tags(file_path)
    
    print("\n开始评估解决状态标签...")
    evaluate_reconciliation_tags(file_path)

def main():
    # 默认文件路径
    file_path = "/Users/mac/Documents/loan/tags/kesu/claim/tag111102/corrected_1_dxr_tagged.xlsx"
    
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    
    try:
        evaluate_all_tags(file_path)
    except Exception as e:
        print(f"评估过程中出错: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    main()