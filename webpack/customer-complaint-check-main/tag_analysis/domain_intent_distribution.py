import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib
import warnings

warnings.filterwarnings('ignore')

# 中文字体设置
matplotlib.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'FangSong', 'KaiTi', 'Arial Unicode MS']
matplotlib.rcParams['axes.unicode_minus'] = False
matplotlib.rcParams['font.size'] = 10

# 读取数据
file_path = r"C:\Users\T14P\Desktop\benchmark_话务诉点标数据(标注)_275_110151919.xlsx"
df = pd.read_excel(file_path)



def custom_sort(domains):
    """自定义排序函数，将'其他'放在最后"""
    domains_list = list(domains)
    if '其他' in domains_list:
        domains_list.remove('其他')
        domains_list.sort()
        domains_list.append('其他')
    else:
        domains_list.sort()
    return domains_list


print("=" * 80)
print("数据总览")
print("=" * 80)
print(f"总数据量: {len(df)} 条")
print(f"领域数量: {df['raw_domain'].nunique()} 个 ({', '.join(custom_sort(df['raw_domain'].unique()))})")
print(f"意图数量: {df['raw_intent'].nunique()} 个 ({', '.join(sorted(df['raw_intent'].unique()))})")

print("\n" + "=" * 80)
print("领域分布")
print("=" * 80)

sorted_domains = custom_sort(df['raw_domain'].unique())
for domain in sorted_domains:
    count = len(df[df['raw_domain'] == domain])
    percentage = (count / len(df)) * 100
    print(f"{domain}: {count}条 ({percentage:.2f}%)")

print("\n" + "=" * 80)
print("每个领域下的意图详细分布")
print("=" * 80)

for domain in sorted_domains:
    domain_data = df[df['raw_domain'] == domain]
    domain_total = len(domain_data)
    domain_intents = sorted(domain_data['raw_intent'].unique())

    print(f"\n【{domain}】")
    print(f"数据量: {domain_total}条 ({(domain_total / len(df) * 100):.2f}%)")
    print(f"意图数量: {domain_data['raw_intent'].nunique()}个 ({', '.join(domain_intents)})")
    print(f"意图分布:")

    intent_dist = domain_data['raw_intent'].value_counts()
    for intent, count in intent_dist.items():
        percentage = (count / domain_total) * 100
        global_pct = (count / len(df)) * 100
        print(f"  · {intent}: {count}条 (领域内{percentage:.2f}%, 全局{global_pct:.2f}%)")



# 准备有序的领域数据
domain_counts_ordered = pd.Series({domain: len(df[df['raw_domain'] == domain])
                                   for domain in sorted_domains})

# 图1：领域整体分布 - 饼图
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111)

colors_pie = ['#66C2A5', '#FC8D62', '#8DA0CB', '#E78AC3', '#A6D854']

labels = []
for domain, count in domain_counts_ordered.items():
    pct = (count / len(df)) * 100
    labels.append(f'{domain}\n{count}条 ({pct:.1f}%)')

wedges, texts, autotexts = ax.pie(domain_counts_ordered.values,
                                  labels=labels,
                                  autopct='',
                                  startangle=90,
                                  colors=colors_pie[:len(domain_counts_ordered)],
                                  textprops={'fontsize': 12})

for text in texts:
    text.set_fontfamily('Microsoft YaHei')

ax.set_title('领域分布', fontsize=16, fontweight='bold', pad=20, fontfamily='Microsoft YaHei')
plt.axis('equal')
plt.tight_layout()
plt.show()

# 图2：每个领域内部的意图分布 - 分面柱状图
n_domains = len(sorted_domains)
fig, axes = plt.subplots(1, n_domains, figsize=(7 * n_domains, 10))
if n_domains == 1:
    axes = [axes]

colors_intent = ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C']

for idx, domain in enumerate(sorted_domains):
    domain_data = df[df['raw_domain'] == domain]
    intent_counts = domain_data['raw_intent'].value_counts()

    x_pos = range(len(intent_counts))
    # 根据领域设置不同的宽度
    bar_width = 0.8 if domain == '其他' else 0.8  # 其他用0.4，征信和息费用0.8
    bars = axes[idx].bar(x_pos, intent_counts.values,
                         color=colors_intent[:len(intent_counts)],
                         edgecolor='black', linewidth=1.2, alpha=0.8, width=bar_width)

    axes[idx].set_xticks(x_pos)
    if domain == '其他':
        axes[idx].set_xlim(-1, 1)
    labels = axes[idx].set_xticklabels(intent_counts.index, rotation=45, ha='right', fontsize=11)
    for label in labels:
        label.set_fontfamily('Microsoft YaHei')

    domain_pct = (len(domain_data) / len(df)) * 100
    title = axes[idx].set_title(f'{domain}\n共{len(domain_data)}条 ({domain_pct:.1f}%), {len(intent_counts)}个意图',
                                fontsize=13, fontweight='bold', pad=10)
    title.set_fontfamily('Microsoft YaHei')

    ylabel = axes[idx].set_ylabel('样本数量', fontsize=12)
    ylabel.set_fontfamily('Microsoft YaHei')

    axes[idx].grid(axis='y', alpha=0.3, linestyle='--')

    # 在柱子内部添加数值和百分比
    for i, (intent, count) in enumerate(intent_counts.items()):
        pct = (count / len(domain_data)) * 100
        # 计算合适的位置（柱子高度的中间）
        y_pos = count / 2
        text = axes[idx].text(i, y_pos, f'{count}条\n({pct:.1f}%)',
                              ha='center', va='center', fontsize=10, fontweight='bold',
                              color='white' if count > 20 else 'black')
        text.set_fontfamily('Microsoft YaHei')

suptitle = fig.suptitle('各领域内部的意图分布', fontsize=16, fontweight='bold', y=0.98)
suptitle.set_fontfamily('Microsoft YaHei')

plt.tight_layout()
plt.show()

# 图3：领域-意图 堆叠柱状图
fig = plt.figure(figsize=(14, 9))  # 增加高度
ax = fig.add_subplot(111)

# 使用crosstab创建交叉表
cross_data = pd.crosstab(df['raw_domain'], df['raw_intent'])

# 按照自定义顺序重新排列行
cross_data = cross_data.reindex(sorted_domains)

# 颜色方案
colors_stack = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
                '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#27AE60']

# 绘制堆叠柱状图
bottom_values = [0] * len(cross_data)

for i, intent in enumerate(cross_data.columns):
    values = cross_data[intent].values
    bars = ax.bar(range(len(cross_data)), values, bottom=bottom_values,
                  color=colors_stack[i % len(colors_stack)],
                  edgecolor='white', linewidth=1.5, label=intent, width=0.6)

    # 在每个堆叠块上添加标签
    for j, (domain, value) in enumerate(zip(cross_data.index, values)):
        if value > 0:  # 只显示非零值
            domain_total = cross_data.loc[domain].sum()
            pct = (value / domain_total) * 100
            # 计算y位置（在当前块的中间）
            y_pos = bottom_values[j] + value / 2
            text = ax.text(j, y_pos, f'{int(value)}条\n({pct:.1f}%)',
                           ha='center', va='center', fontsize=9, fontweight='bold',
                           color='white', fontfamily='Microsoft YaHei')

    # 更新bottom值
    bottom_values = [bottom_values[k] + values[k] for k in range(len(values))]

# 设置标题，增加pad值避免重叠
ax.set_title('领域-意图堆叠分布', fontsize=16, fontweight='bold', pad=30, fontfamily='Microsoft YaHei')
ax.set_xlabel('领域', fontsize=13, fontweight='bold', fontfamily='Microsoft YaHei')
ax.set_ylabel('样本数量', fontsize=13, fontweight='bold', fontfamily='Microsoft YaHei')

ax.set_xticks(range(len(cross_data)))
ax.set_xticklabels(cross_data.index, rotation=0, fontsize=12, fontfamily='Microsoft YaHei')

legend = ax.legend(title='意图', bbox_to_anchor=(1.02, 1), loc='upper left', fontsize=10)
legend.get_title().set_fontfamily('Microsoft YaHei')
for text in legend.get_texts():
    text.set_fontfamily('Microsoft YaHei')

ax.grid(axis='y', alpha=0.3)

# 计算最大值用于设置y轴范围
max_height = max(bottom_values)

# 设置y轴上限，给顶部标签留出空间
ax.set_ylim(0, max_height * 1.12)

# 在柱子顶部添加总数
for i, domain in enumerate(cross_data.index):
    total = cross_data.loc[domain].sum()
    pct = (total / len(df)) * 100
    ax.text(i, total + max_height * 0.015, f'{int(total)}条\n({pct:.1f}%)',
            ha='center', va='bottom', fontsize=11, fontweight='bold', fontfamily='Microsoft YaHei')

plt.tight_layout()
plt.show()

