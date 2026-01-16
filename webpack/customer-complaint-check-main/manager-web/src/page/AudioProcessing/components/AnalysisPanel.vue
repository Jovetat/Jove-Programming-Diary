<template>
  <div class="analysis-panel">
    <div class="panel-header">
      <h3 class="panel-title">AI 分析结果</h3>
    </div>

    <div class="panel-content">
      <!-- 诉点分类 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">📋</span>
          <h4 class="section-title">诉点分类</h4>
        </div>
        <div class="section-content">
          <div class="info-item">
            <span class="info-label">🏢 领域</span>
            <span class="info-value">{{ complaint?.domain || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎯 意图</span>
            <span class="info-value">{{ complaint?.intent || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🔖 槽位</span>
            <span class="info-value">{{ complaint?.third_level || '-' }}</span>
          </div>
          <div v-if="complaint?.intent_reasoning" class="info-item reasoning">
            <span class="info-label">💡 依据</span>
            <span class="info-value">{{ complaint.intent_reasoning }}</span>
          </div>
        </div>
      </div>

      <!-- 诉求分类 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">🎤</span>
          <h4 class="section-title">诉求分类</h4>
        </div>
        <div class="section-content">
          <div class="info-item">
            <span class="info-label">🏢 领域</span>
            <span class="info-value">{{ appeal?.domain || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎯 意图</span>
            <span class="info-value">{{ appeal?.intent || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🔖 槽位</span>
            <span class="info-value">{{ appeal?.third_level || '-' }}</span>
          </div>
          <div v-if="appeal?.reasoning" class="info-item reasoning">
            <span class="info-label">💡 依据</span>
            <span class="info-value">{{ appeal.reasoning }}</span>
          </div>
        </div>
      </div>

      <!-- 解决方案 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">💡</span>
          <h4 class="section-title">解决方案</h4>
        </div>
        <div class="section-content">
          <div class="info-item">
            <span class="info-label">🏢 领域</span>
            <span class="info-value">{{ solution?.domain || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎯 意图</span>
            <span class="info-value">{{ solution?.intent || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🔖 槽位</span>
            <span class="info-value">{{ solution?.third_level || '-' }}</span>
          </div>
          <div v-if="solution?.reasoning" class="info-item reasoning">
            <span class="info-label">💡 依据</span>
            <span class="info-value">{{ solution.reasoning }}</span>
          </div>
        </div>
      </div>

      <!-- 解决状态 -->
      <div class="analysis-section">
        <div class="section-header">
          <span class="section-icon">✅</span>
          <h4 class="section-title">解决状态</h4>
        </div>
        <div class="section-content">
          <div class="info-item">
            <span class="info-label">📊 状态</span>
            <span class="info-value status" :class="getStatusClass(reconciliation?.status)">
              {{ getStatusEmoji(reconciliation?.status) }} {{ reconciliation?.status || '-' }}
            </span>
          </div>
          <div v-if="reconciliation?.reasoning" class="info-item reasoning">
            <span class="info-label">💡 依据</span>
            <span class="info-value">{{ reconciliation.reasoning }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ClassificationResult,
  ReconciliationResult,
} from '@/api/audioProcessing.types'

interface Props {
  complaint?: ClassificationResult | null
  appeal?: ClassificationResult | null
  solution?: ClassificationResult | null
  reconciliation?: ReconciliationResult | null
}

defineProps<Props>()

const getStatusClass = (status?: string) => {
  if (!status) return ''
  if (status.includes('认可') || status.includes('解决')) return 'status-success'
  if (status.includes('未解决') || status.includes('拒绝')) return 'status-error'
  return 'status-warning'
}

const getStatusEmoji = (status?: string) => {
  if (!status) return '❓'
  if (status.includes('认可') || status.includes('解决')) return '✅'
  if (status.includes('未解决') || status.includes('拒绝')) return '❌'
  return '⚠️'
}
</script>

<style scoped lang="scss">
.analysis-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-lg;
  overflow: hidden;
}

.panel-header {
  padding: $spacing-lg $spacing-xl;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.panel-title {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: $radius-sm;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: $radius-sm;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.analysis-section {
  padding: $spacing-lg;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $radius-lg;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-sm;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-icon {
  font-size: 20px;
  line-height: 1;
}

.section-title {
  margin: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: rgba(255, 255, 255, 0.9);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;

  &.reasoning {
    flex-direction: column;
    gap: $spacing-xs;
    padding: $spacing-sm;
    background: rgba(255, 255, 255, 0.02);
    border-radius: $radius-md;
    border-left: 2px solid rgba(255, 255, 255, 0.2);
  }
}

.info-label {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-value {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.9);
  line-height: $line-height-normal;
  word-break: break-word;

  &.status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: $radius-sm;
    font-weight: $font-weight-medium;

    &.status-success {
      background: rgba(100, 255, 150, 0.15);
      color: rgba(150, 255, 180, 1);
      border: 1px solid rgba(100, 255, 150, 0.3);
    }

    &.status-error {
      background: rgba(255, 100, 100, 0.15);
      color: rgba(255, 150, 150, 1);
      border: 1px solid rgba(255, 100, 100, 0.3);
    }

    &.status-warning {
      background: rgba(255, 200, 100, 0.15);
      color: rgba(255, 220, 150, 1);
      border: 1px solid rgba(255, 200, 100, 0.3);
    }
  }
}

.reasoning {
  .info-label {
    min-width: auto;
  }

  .info-value {
    color: rgba(255, 255, 255, 0.7);
    font-size: $font-size-xs;
    line-height: $line-height-relaxed;
  }
}
</style>
