<template>
  <div class="classification-results">
    <a-card title="诉点分类结果" :bordered="false" class="result-card">
      <div class="result-item">
        <span class="result-label">领域：</span>
        <span class="result-value">{{ complaint?.domain || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">意图：</span>
        <span class="result-value">{{ complaint?.intent || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">槽位：</span>
        <span class="result-value">{{ complaint?.third_level || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">诉点依据：</span>
        <span class="result-value">{{
          complaint?.intent_reasoning || 'N/A'
        }}</span>
      </div>
    </a-card>

    <a-card title="诉求分类结果" :bordered="false" class="result-card">
      <div class="result-item">
        <span class="result-label">领域：</span>
        <span class="result-value">{{ appeal?.domain || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">意图：</span>
        <span class="result-value">{{ appeal?.intent || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">槽位：</span>
        <span class="result-value">{{ appeal?.third_level || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">诉求依据：</span>
        <span class="result-value">{{ appeal?.reasoning || 'N/A' }}</span>
      </div>
    </a-card>

    <a-card title="解决方案分类结果" :bordered="false" class="result-card">
      <div class="result-item">
        <span class="result-label">领域：</span>
        <span class="result-value">{{ solution?.domain || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">意图：</span>
        <span class="result-value">{{ solution?.intent || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">槽位：</span>
        <span class="result-value">{{ solution?.third_level || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">解决方案依据：</span>
        <span class="result-value">{{ solution?.reasoning || 'N/A' }}</span>
      </div>
    </a-card>

    <a-card title="解决状态结果" :bordered="false" class="result-card">
      <div class="result-item">
        <span class="result-label">解决状态：</span>
        <span class="result-value">{{ reconciliation?.status || 'N/A' }}</span>
      </div>
      <div class="result-item">
        <span class="result-label">解决状态依据：</span>
        <span class="result-value">{{
          reconciliation?.reasoning || 'N/A'
        }}</span>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import type {
  ClassificationResult,
  ReconciliationResult,
} from '@/api/audioProcessing.types';

interface Props {
  complaint?: ClassificationResult | null;
  appeal?: ClassificationResult | null;
  solution?: ClassificationResult | null;
  reconciliation?: ReconciliationResult | null;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.classification-results {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-card {
  margin-bottom: 0;
}

.result-item {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
}

.result-label {
  font-weight: 600;
  color: #262626;
  min-width: 120px;
  flex-shrink: 0;
}

.result-value {
  color: #595959;
  word-break: break-word;
  flex: 1;
}
</style>
