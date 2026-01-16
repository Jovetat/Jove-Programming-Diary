<template>
  <div class="modern-audio-input">
    <div class="input-header">
      <h2 class="header-title">客诉质检ASR</h2>
    </div>

    <div class="input-tabs">
      <button
        class="tab-button"
        :class="{ active: activeTab === 'file' }"
        @click="activeTab = 'file'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>本地文件</span>
      </button>

      <button
        class="tab-button"
        :class="{ active: activeTab === 'url' }"
        @click="activeTab = 'url'"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <span>音频URL</span>
      </button>
    </div>

    <div class="input-content">
      <transition name="slide-fade" mode="out-in">
        <div v-if="activeTab === 'file'" key="file" class="tab-panel">
          <upload-zone
            :disabled="loading"
            @file-selected="handleFileSelected"
            @file-removed="handleFileRemoved"
          />

          <button
            class="submit-button"
            :class="{ disabled: !selectedFile }"
            :disabled="!selectedFile || loading"
            @click="handleFileSubmit"
          >
            <span v-if="!loading" class="button-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              开始分析
            </span>
            <span v-else class="button-content">
              <div class="button-spinner" />
              处理中...
            </span>
          </button>
        </div>

        <div v-else key="url" class="tab-panel">
          <div class="url-input-wrapper">
            <div class="url-input-container">
              <svg class="url-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <input
                v-model="audioUrl"
                type="text"
                class="url-input"
                placeholder="请输入音频文件的URL地址..."
                :disabled="loading"
                @keyup.enter="handleUrlSubmit"
              >
              <button
                v-if="audioUrl"
                class="clear-button"
                @click="audioUrl = ''"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="url-examples">
              <span class="examples-label">示例:</span>
              <button
                v-for="(example, index) in urlExamples"
                :key="index"
                class="example-tag"
                @click="audioUrl = example"
              >
                {{ example }}
              </button>
            </div>
          </div>

          <button
            class="submit-button"
            :class="{ disabled: !audioUrl.trim() }"
            :disabled="!audioUrl.trim() || loading"
            @click="handleUrlSubmit"
          >
            <span v-if="!loading" class="button-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              开始分析
            </span>
            <span v-else class="button-content">
              <div class="button-spinner" />
              处理中...
            </span>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UploadZone from './UploadZone.vue'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'process-url', url: string): void
  (e: 'process-file', file: File): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref<'file' | 'url'>('file')
const audioUrl = ref('')
const selectedFile = ref<File | null>(null)

const urlExamples = [
  'https://kefu.tjzimu.com/report/call/play/video/ims_109/record/LHPJR/2025/09/05/7955813670024575317.mp3',
  'https://kefu.tjzimu.com/report/call/play/video/ims_109/record/LHPJR/2025/09/02/7955809478488707802.mp3',
]

const handleFileSelected = (file: File) => {
  selectedFile.value = file
}

const handleFileRemoved = () => {
  selectedFile.value = null
}

const handleFileSubmit = () => {
  if (selectedFile.value) {
    emit('process-file', selectedFile.value)
  }
}

const handleUrlSubmit = () => {
  if (audioUrl.value.trim()) {
    emit('process-url', audioUrl.value.trim())
  }
}
</script>

<style scoped lang="scss">
.modern-audio-input {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  @include flex-column;
  gap: $spacing-xxl;
  padding: $spacing-xxl $spacing-xl;
}

.input-header {
  @include flex-column-center;
  text-align: center;
  padding-bottom: $spacing-lg;
}

.header-title {
  font-size: 48px;
  font-weight: 300;
  color: #ffffff;
  margin: 0;
  letter-spacing: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.input-tabs {
  @include flex-center;
  gap: 0;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-lg;
  backdrop-filter: blur(20px);
}

.tab-button {
  @include flex-center;
  gap: $spacing-sm;
  flex: 1;
  padding: $spacing-md $spacing-lg;
  border: none;
  border-radius: $radius-md;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
  }

  &:hover:not(.active) {
    color: rgba(255, 255, 255, 0.9);
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.input-content {
  min-height: 400px;
}

.tab-panel {
  @include flex-column;
  gap: $spacing-xl;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all $duration-base $ease-out;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.url-input-wrapper {
  @include flex-column;
  gap: $spacing-md;
}

.url-input-container {
  position: relative;
  @include flex-center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-lg;
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
  }
}

.url-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
  stroke-width: 2;
  flex-shrink: 0;
}

.url-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: $font-size-base;
  color: #ffffff;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.clear-button {
  @include flex-center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all $duration-fast $ease-out;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }

  &:hover {
    color: #ff4d4f;
    transform: rotate(90deg);
  }
}

.url-examples {
  @include flex-start;
  gap: $spacing-sm;
  flex-wrap: wrap;
  padding: 0 $spacing-sm;
}

.examples-label {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.5);
  font-weight: $font-weight-medium;
}

.example-tag {
  padding: $spacing-xs $spacing-sm;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-sm;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.5);
  font-size: $font-size-xs;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.05);
  }
}

.submit-button {
  @include flex-center;
  width: 100%;
  padding: $spacing-lg $spacing-xl;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-lg;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);

  &:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(.disabled) {
    transform: translateY(0);
  }

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.button-content {
  @include flex-center;
  gap: $spacing-sm;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }
}

.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: $radius-round;
  animation: spin 0.8s linear infinite;
}

</style>
