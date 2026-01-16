<template>
  <a-card title="ASR文本结果" :bordered="false">
    <pre class="asr-text">{{ asrText || '暂无ASR文本数据' }}</pre>
  </a-card>
</template>

<script setup lang="ts">
interface Props {
  asrText?: string;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.asr-text {
  background-color: #fafafa;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  color: #262626;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
