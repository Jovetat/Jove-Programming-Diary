#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
大模型API压力测试脚本

功能：
1. 生成不同类型长度的测试数据（短文本、长文本）
2. 多线程并发调用大模型API
3. 统计测试结果和性能指标
4. 输出测试报告

使用方法：
python scripts/load_test_llm.py --threads 10 --requests 100
"""

import argparse
import time
import random
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import json
import os
import sys
from datetime import datetime

# 添加上级目录到路径中
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.env import MODEL_API_URL, MODEL_NAME


# 测试数据模板
SHORT_TEXT_TEMPLATES = [
    "你好，我想了解一下产品的价格和功能。",
    "请问你们的营业时间是什么时候？",
    "我在使用过程中遇到了一个问题，希望能得到帮助。",
    "能否介绍一下你们的服务特色？",
    "我对这个产品很感兴趣，想了解更多细节。",
    "请告诉我如何注册账户？",
    "我想取消订单，应该怎么办？",
    "你们支持哪些付款方式？",
    "如何联系客服人员？",
    "有没有相关的使用教程？"
]

LONG_TEXT_TEMPLATES = [
    "尊敬的客服您好，我最近在贵公司购买了一款产品，在使用过程中发现了一些问题。首先，产品的包装有些破损，虽然不影响使用，但感觉品质管控方面还有提升空间。其次，产品说明书的内容不够详细，对于一些功能的介绍比较简略，导致我在初次使用时花费了不少时间去摸索。另外，我还想了解一下产品的保修政策和售后服务流程，希望能在未来的使用中更加安心。期待您的回复，谢谢！",
    "各位工作人员好，我写这封邮件是想表达对贵公司服务的一些看法和建议。作为一个长期客户，我对大部分服务都比较满意，但也注意到了一些可以改进的地方。比如在高峰期时，电话等待时间较长，希望能够增加客服人员或者优化排队系统。此外，网站的用户体验也有待提升，部分页面加载速度较慢，而且在移动设备上的显示效果不够理想。我相信通过不断的优化和完善，贵公司的服务水平会更上一层楼。",
    "亲爱的团队，我想分享一下最近一次购物体验。整体来说这次购物还算顺利，但在某些环节还是有一些小问题。首先是物流方面，虽然承诺三天内送达，但实际上用了五天，这对于急需使用的我来说有些不便。其次是产品的质量，大部分都很好，但有一个小部件似乎存在缺陷，我已经按照说明进行了操作，但效果不如预期。最后是关于退换货政策，虽然网站上有详细介绍，但实际操作起来还是比较复杂的，希望能够简化流程。以上只是一些个人感受，希望能对公司的发展有所帮助。",
    "管理员您好，我在使用贵公司软件的过程中遇到了一些技术难题，希望能够得到专业的指导和帮助。问题主要出现在数据导入功能上，当我尝试上传一个较大的CSV文件时，系统总是提示格式错误，但我已经严格按照要求进行了整理。我也查阅了帮助文档，但没有找到相关的解决方案。此外，软件的界面在某些分辨率下会出现布局错乱的情况，这给操作带来了不小的困扰。如果能提供远程协助或者详细的故障排除指南，将会非常有帮助。",
    "大家好，我是你们平台的老用户了，一直以来都非常信赖你们的产品和服务。不过最近我发现了一些变化，有些让人不太适应。首先是界面风格的调整，虽然看起来更加现代化了，但原有的操作习惯被打乱了，需要重新学习。其次是某些常用功能的位置发生了改变，这在一定程度上降低了工作效率。另外，新推出的会员制度虽然提供了更多权益，但门槛设置得相对较高，希望能够适当放宽条件让更多用户受益。希望我的反馈能对产品优化有所帮助。" * 2,  # 超过800字的长文本
    "致相关部门负责人，我代表我们公司向贵方提出一些合作方面的疑问和建议。首先，关于合同条款的解释，我们认为某些表述存在歧义，可能会在执行过程中产生分歧，建议进行进一步澄清。其次，交付时间表的安排似乎过于紧凑，考虑到目前的市场环境和资源分配情况，我们担心难以按时完成所有任务。此外，付款方式的选择也比较有限，希望能够提供更多灵活的选项以适应不同客户的需求。我们非常重视与贵公司的合作关系，相信通过坦诚沟通能够找到双方都满意的解决方案。期待尽快收到回复，谢谢！" * 2,  # 超过800字的长文本
]


def generate_test_data(count=100):
    """
    生成测试数据
    
    Args:
        count: 生成的数据条数
        
    Returns:
        list: 测试数据列表
    """
    test_data = []
    
    for i in range(count):
        # 随机选择短文本或长文本
        if random.random() < 0.5:
            # 短文本
            text = random.choice(SHORT_TEXT_TEMPLATES)
            data_type = "short"
        else:
            # 长文本
            text = random.choice(LONG_TEXT_TEMPLATES)
            data_type = "long"
            
        test_data.append({
            "id": i + 1,
            "text": text,
            "type": data_type
        })
    
    return test_data


def call_llm_api(prompt, request_id):
    """
    调用大模型API
    
    Args:
        prompt: 发送给大模型的提示词
        request_id: 请求ID
        
    Returns:
        dict: 调用结果
    """
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "max_tokens": 100
    }
    
    start_time = time.time()
    
    try:
        response = requests.post(MODEL_API_URL, headers=headers, data=json.dumps(data), timeout=30)
        end_time = time.time()
        
        elapsed_time = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            output = result["choices"][0]["message"]["content"].strip()
            return {
                "request_id": request_id,
                "success": True,
                "response_time": elapsed_time,
                "output_length": len(output),
                "output": output,
                "status_code": response.status_code
            }
        else:
            return {
                "request_id": request_id,
                "success": False,
                "response_time": elapsed_time,
                "error": f"HTTP {response.status_code}",
                "status_code": response.status_code
            }
    except Exception as e:
        end_time = time.time()
        elapsed_time = end_time - start_time
        return {
            "request_id": request_id,
            "success": False,
            "response_time": elapsed_time,
            "error": str(e),
            "status_code": -1
        }


def worker(test_item, results_list, lock):
    """
    工作线程函数
    
    Args:
        test_item: 测试数据项
        results_list: 结果列表（线程安全）
        lock: 线程锁
    """
    print(f"[线程-{threading.current_thread().ident}] 开始处理请求 #{test_item['id']}")
    
    result = call_llm_api(test_item["text"], test_item["id"])
    
    with lock:
        results_list.append(result)
        
    if result["success"]:
        print(f"[线程-{threading.current_thread().ident}] 完成处理请求 #{test_item['id']} "
              f"耗时: {result['response_time']:.2f}秒")
        print(f"[线程-{threading.current_thread().ident}] 请求 #{test_item['id']} 的输出结果: {result['output']}")
    else:
        print(f"[线程-{threading.current_thread().ident}] 处理请求 #{test_item['id']} 失败 "
              f"耗时: {result['response_time']:.2f}秒, 错误: {result['error']}")
    
    return result


def run_load_test(thread_count, request_count):
    """
    运行压力测试
    
    Args:
        thread_count: 线程数
        request_count: 请求总数
    """
    print(f"开始压力测试:")
    print(f"- 线程数: {thread_count}")
    print(f"- 请求总数: {request_count}")
    print(f"- 开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    # 生成测试数据
    test_data = generate_test_data(request_count)
    
    # 存储结果的线程安全列表
    results = []
    lock = threading.Lock()
    
    start_time = time.time()
    
    # 使用线程池执行测试
    with ThreadPoolExecutor(max_workers=thread_count) as executor:
        # 提交所有任务
        future_to_data = {
            executor.submit(worker, test_item, results, lock): test_item 
            for test_item in test_data
        }
        
        # 等待所有任务完成
        for future in as_completed(future_to_data):
            try:
                future.result()
            except Exception as e:
                print(f"任务执行出错: {e}")
    
    end_time = time.time()
    total_time = end_time - start_time
    
    # 生成测试报告
    generate_report(results, total_time, thread_count, request_count)


def generate_report(results, total_time, thread_count, request_count):
    """
    生成测试报告
    
    Args:
        results: 测试结果列表
        total_time: 总耗时
        thread_count: 线程数
        request_count: 请求总数
    """
    print("\n" + "=" * 50)
    print("压力测试报告")
    print("=" * 50)
    print(f"测试时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"线程数: {thread_count}")
    print(f"请求总数: {request_count}")
    print(f"总耗时: {total_time:.2f} 秒")
    
    # 统计成功和失败的请求数
    successful_requests = [r for r in results if r["success"]]
    failed_requests = [r for r in results if not r["success"]]
    
    print(f"成功请求数: {len(successful_requests)}")
    print(f"失败请求数: {len(failed_requests)}")
    print(f"成功率: {len(successful_requests)/len(results)*100:.2f}%")
    
    if successful_requests:
        # 计算响应时间统计
        response_times = [r["response_time"] for r in successful_requests]
        avg_response_time = sum(response_times) / len(response_times)
        min_response_time = min(response_times)
        max_response_time = max(response_times)
        
        print(f"平均响应时间: {avg_response_time:.2f} 秒")
        print(f"最短响应时间: {min_response_time:.2f} 秒")
        print(f"最长响应时间: {max_response_time:.2f} 秒")
        
        # 计算每秒处理请求数
        qps = len(successful_requests) / total_time
        print(f"平均QPS: {qps:.2f}")
    
    # 显示失败详情
    if failed_requests:
        print("\n失败详情:")
        for failed in failed_requests:
            print(f"  请求 #{failed['request_id']}: {failed['error']}")
    
    print("=" * 50)


def main():
    parser = argparse.ArgumentParser(description='大模型API压力测试工具')
    parser.add_argument('--threads', type=int, default=5, help='线程数 (默认: 5)')
    parser.add_argument('--requests', type=int, default=100, help='请求数 (默认: 100)')
    
    args = parser.parse_args()
    
    if args.requests <= 0 or args.threads <= 0:
        print("错误: 线程数和请求数必须大于0")
        return
    
    run_load_test(args.threads, args.requests)


if __name__ == "__main__":
    main()