<template>
    <div>
        <h2>Vue2 完结散花 *★,°*:.☆(￣▽￣)/$:*.°★* 。</h2>
        <button>原始的按钮</button>
        <input type="text"><hr>
        <el-button type="primary" plain>Element UI</el-button>
        <div class="block">
            <span class="demonstration">日期选择</span>
            <el-date-picker
                v-model="value1"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
        </div>
    </div>
</template>

<script>
    /* 
        Element UI 使用
            详细请看 59_Vue_UI组件库.md 文件
    */

    export default {
        name: 'App',
        // 复制日期相关的代码
        data() {
            return {
                pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
                },
                value1: '',
                value2: '',
            }
        },
    }

</script>