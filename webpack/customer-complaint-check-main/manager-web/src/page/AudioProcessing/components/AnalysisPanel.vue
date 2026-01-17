<template>
  <div class="analysis-panel">
    <div class="panel-header">
      <h3 class="panel-title">AI 分析结果</h3>
    </div>

    <div ref="panelContentRef" class="panel-content">
      <transition-group name="analysis-fade">
        <!-- 诉点分类 -->
        <div v-if="visibleSections >= 1" key="complaint" class="analysis-section">
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
        <div v-if="visibleSections >= 2" key="appeal" class="analysis-section">
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
        <div v-if="visibleSections >= 3" key="solution" class="analysis-section">
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
        <div v-if="visibleSections >= 4" key="reconciliation" class="analysis-section">
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

        <!-- AI 计算中动画 -->
        <div v-if="isCalculating" key="calculating" class="calculating-indicator">
          <div class="calculating-content">
            <span class="calculating-text">对话内容分析中</span>
            <span class="dots">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onUnmounted } from 'vue'
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

const props = defineProps<Props>()

const panelContentRef = ref<HTMLElement | null>(null)
const visibleSections = ref(0)
const maxSections = 4
let timer: ReturnType<typeof setTimeout> | null = null

// 判断是否正在计算（还有更多section要显示）
const isCalculating = computed(() => {
  return visibleSections.value < maxSections && hasData.value
})

// 判断是否有数据
const hasData = computed(() => {
  return !!(props.complaint || props.appeal || props.solution || props.reconciliation)
})

// 清除定时器
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

// 生成8-15秒的随机延迟
const getRandomDelay = () => {
  return Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000
}

// 启动渐进式显示
const startProgressiveDisplay = () => {
  clearTimer()
  visibleSections.value = 0

  const showNextSection = () => {
    if (visibleSections.value < maxSections) {
      visibleSections.value++

      // 滚动到底部
      nextTick(() => {
        if (panelContentRef.value) {
          setTimeout(() => {
            if (panelContentRef.value) {
              panelContentRef.value.scrollTo({
                top: panelContentRef.value.scrollHeight,
                behavior: 'smooth',
              })
            }
          }, 100)
        }
      })

      // 继续显示下一个section（随机8-15秒）
      if (visibleSections.value < maxSections) {
        const delay = getRandomDelay()
        timer = setTimeout(showNextSection, delay)
      }
    }
  }

  // 第一个section也延迟显示（随机8-15秒）
  const delay = getRandomDelay()
  timer = setTimeout(showNextSection, delay)
}

// 监听数据变化，重新启动显示流程
watch(
  () => [props.complaint, props.appeal, props.solution, props.reconciliation],
  (newValues, oldValues) => {
    // 如果从无数据到有数据，或者数据发生变化
    const hasOldData = oldValues?.some(v => v != null)
    const hasNewData = newValues?.some(v => v != null)

    if (hasNewData && (!hasOldData || JSON.stringify(newValues) !== JSON.stringify(oldValues))) {
      startProgressiveDisplay()
    }
  },
  { immediate: true, deep: true }
)

// 组件卸载时清理定时器
onUnmounted(() => {
  clearTimer()
})

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
  overflow-x: hidden;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  position: relative;

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

// 渐进式显示动画
.analysis-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.analysis-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.analysis-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.analysis-fade-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

// AI 计算中指示器
.calculating-indicator {
  padding: $spacing-lg;
  background: rgba(100, 150, 255, 0.08);
  border: 1px dashed rgba(100, 150, 255, 0.3);
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.calculating-content {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-base;
  color: rgba(150, 200, 255, 1);
}

.calculating-text {
  font-weight: $font-weight-medium;
  letter-spacing: 0.5px;
}

.dots {
  display: inline-flex;
  gap: 2px;

  .dot {
    animation: blink 1.4s infinite;
    opacity: 0;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(100, 150, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(100, 150, 255, 0);
  }
}

@keyframes blink {
  0%, 20%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
