<template>
  <div class="audio-processing-page">
    <transition name="fade" mode="out-in">
      <div v-if="!hasResults && !store.loading" key="input" class="input-stage">
        <modern-audio-input
          :loading="store.loading"
          @process-url="handleProcessUrl"
          @process-file="handleProcessFile"
        />
      </div>

      <div v-else-if="store.loading" key="loading" class="loading-stage">
        <audio-loading-animation
          title="正在处理音频"
          description="AI正在分析您的音频内容,请稍候..."
        />
      </div>

      <div v-else-if="hasResults" key="results" class="results-stage">
        <div class="results-header">
          <h2 class="results-title">分析结果</h2>
          <button class="reset-button" @click="handleReset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span>重新分析</span>
          </button>
        </div>

        <div v-if="store.error" class="error-container">
          <div class="error-card">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div class="error-content">
              <h3>处理失败</h3>
              <p>{{ store.error }}</p>
            </div>
            <button class="error-close" @click="store.setError('')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div class="results-container">
          <!-- 左侧:对话内容展示 -->
          <div class="dialogue-section">
            <DialogueDisplay
              :segments="store.dialogueSegments"
              :active-index="store.activeSegmentIndex"
              @segment-click="handleSegmentClick"
            />
          </div>

          <!-- 右侧:AI分析结果 -->
          <div class="analysis-section">
            <AnalysisPanel
              :complaint="store.complaintResult"
              :appeal="store.appealResult"
              :solution="store.solutionResult"
              :reconciliation="store.reconciliationResult"
            />
          </div>
        </div>

        <!-- 固定在底部的播放器 -->
        <AudioPlayer
          v-if="store.audioUrl"
          ref="audioPlayerRef"
          :audio-url="store.audioUrl"
          @time-update="handleTimeUpdate"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudioProcessingStore } from '@/stores/audioProcessing'
import { audioProcessingApi } from '@/api/audioProcessing'
import { findActiveSegment } from '@/utils/audioUtils'
import type { DialogueSegment } from '@/api/audioProcessing.types'
import { useMessage } from '@/plugins/naive'
import ModernAudioInput from '@/components/AudioUpload/ModernAudioInput.vue'
import AudioLoadingAnimation from '@/components/AudioUpload/AudioLoadingAnimation.vue'
import DialogueDisplay from './components/DialogueDisplay.vue'
import AnalysisPanel from './components/AnalysisPanel.vue'
import AudioPlayer from './components/AudioPlayer.vue'

const store = useAudioProcessingStore()
const message = useMessage()
const audioPlayerRef = ref<InstanceType<typeof AudioPlayer> | null>(null)

const hasResults = computed(() => {
  return store.dialogueSegments.length > 0 || store.asrText
})

const handleReset = () => {
  store.clearResults()
  store.setError('')
}

const handleProcessUrl = async (url: string) => {
  try {
    store.setLoading(true)
    store.setError('')
    store.clearResults()

    const response = await audioProcessingApi.processAudioUrl(url)

    if (response.success) {
      store.setAudioUrl(url)
      store.setProcessingResults({
        asr_text: response.asr_text,
        dialogue_segments: response.dialogue_segments,
        complaint: response.complaint,
        appeal: response.appeal,
        solution: response.solution,
        reconciliation: response.reconciliation,
      })
      message.success('音频处理完成')
    } else {
      store.setError(response.error || '处理音频时发生错误')
      message.error(response.error || '处理音频时发生错误')
    }
  } catch (error: any) {
    const errorMsg = error?.message || '网络错误，请稍后重试'
    store.setError(errorMsg)
    message.error(errorMsg)
  } finally {
    store.setLoading(false)
  }
}

const handleProcessFile = async (file: File) => {
  try {
    store.setLoading(true)
    store.setError('')
    store.clearResults()

    const response = await audioProcessingApi.processAudioFile(file)

    if (response.success) {
      const fileUrl = URL.createObjectURL(file)
      store.setAudioUrl(fileUrl)
      store.setProcessingResults({
        asr_text: response.asr_text,
        dialogue_segments: response.dialogue_segments,
        complaint: response.complaint,
        appeal: response.appeal,
        solution: response.solution,
        reconciliation: response.reconciliation,
      })
      message.success('音频处理完成')
    } else {
      store.setError(response.error || '处理音频时发生错误')
      message.error(response.error || '处理音频时发生错误')
    }
  } catch (error: any) {
    const errorMsg = error?.message || '网络错误，请稍后重试'
    store.setError(errorMsg)
    message.error(errorMsg)
  } finally {
    store.setLoading(false)
  }
}

const handleSegmentClick = (segment: DialogueSegment) => {
  // 接口返回的时间是毫秒,需要转换为秒
  const startTimeMs = parseFloat(segment.start)
  const startTimeSec = startTimeMs / 1000

  if (!audioPlayerRef.value) {
    console.warn('Audio player not available')
    return
  }

  if (isNaN(startTimeSec) || startTimeSec < 0) {
    console.warn('Invalid start time:', segment.start)
    return
  }

  // 跳转到指定时间并自动播放
  audioPlayerRef.value.seekTo(startTimeSec)
  audioPlayerRef.value.play()
}

const handleTimeUpdate = (currentTime: number) => {
  const activeIndex = findActiveSegment(currentTime, store.dialogueSegments)
  store.setActiveSegmentIndex(activeIndex)
}
</script>

<style scoped lang="scss">
.audio-processing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
  position: relative;
}

.input-stage,
.loading-stage,
.results-stage {
  position: relative;
  z-index: 1;
}

.input-stage {
  @include flex-center;
  min-height: 100vh;
  padding: $spacing-xxl $spacing-lg;
}

.loading-stage {
  position: relative;
  min-height: 100vh;
}

.results-stage {
  position: relative;
  min-height: 100vh;
  padding-bottom: 120px; // 为底部播放器留出空间
}

.results-header {
  @include flex-between;
  align-items: center;
padding: 13px 32px;
  max-width: 1600px;
margin: 0 auto 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-lg;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.results-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-medium;
  color: #ffffff;
  margin: 0;
  letter-spacing: 1px;
}

.reset-button {
  @include flex-center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: $radius-md;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.error-container {
  margin-bottom: $spacing-xl;
  animation: slideInDown $duration-base $ease-out;
}

.error-card {
  @include flex-start;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba($error-color, 0.05) 0%, rgba($error-color, 0.02) 100%);
  border: 1px solid rgba($error-color, 0.2);
  border-radius: $radius-lg;
  @include shadow-sm;
}

.error-icon {
  width: 24px;
  height: 24px;
  color: $error-color;
  stroke-width: 2;
  flex-shrink: 0;
}

.error-content {
  flex: 1;

  h3 {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $error-color;
    margin: 0 0 $spacing-xs 0;
  }

  p {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin: 0;
  }
}

.error-close {
  @include flex-center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: $text-tertiary;
  cursor: pointer;
  transition: all $duration-fast $ease-out;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }

  &:hover {
    color: $error-color;
    transform: rotate(90deg);
  }
}

.results-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: $spacing-xl;
  padding: $spacing-xl $spacing-lg;
  max-width: 1600px;
  margin: 0 auto;
  height: calc(100vh - 200px);
  animation: fadeIn $duration-slow $ease-out;
}

.dialogue-section {
  min-height: 0;
  overflow: hidden;
}

.analysis-section {
  min-height: 0;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: all $duration-slow $ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@media (max-width: $breakpoint-lg) {
  .results-container {
    grid-template-columns: 1fr;
    height: auto;
  }

  .analysis-section {
    order: -1;
  }
}

@media (max-width: $breakpoint-md) {
  .results-header {
    @include flex-column;
    align-items: flex-start;
    gap: $spacing-md;
  }

  .input-stage {
    padding: $spacing-lg;
  }

  .results-container {
    padding: $spacing-md;
  }
}
</style>
