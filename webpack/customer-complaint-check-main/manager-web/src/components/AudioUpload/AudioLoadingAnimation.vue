<template>
  <div class="audio-loading-container">
    <div class="loading-content">
      <!-- 极简旋转圆环 -->
      <div class="loading-spinner">
        <div class="spinner-ring" />
      </div>

      <!-- 文字内容 -->
      <div class="loading-text-wrapper">
        <h3 class="loading-title">{{ title }}</h3>
        <p class="loading-description">{{ description }}</p>

        <!-- 极简加载点 -->
        <div class="loading-dots">
          <span class="dot" />
          <span class="dot" />
          <span class="dot" />
        </div>
      </div>

      <!-- 进度条（可选） -->
      <div v-if="showProgress" class="progress-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  showProgress?: boolean
  progress?: number
}

withDefaults(defineProps<Props>(), {
  title: '正在处理音频',
  description: 'AI正在分析您的音频内容，请稍候...',
  showProgress: false,
  progress: 0,
})
</script>

<style scoped lang="scss">
.audio-loading-container {
  position: fixed;
  inset: 0;
  z-index: $z-index-modal;
  @include flex-center;
  background: rgba(10, 14, 39, 0.7);
  backdrop-filter: blur(20px);
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-content {
  @include flex-column-center;
  gap: $spacing-xxl;
  padding: $spacing-xxl;
  max-width: 400px;
  width: 100%;
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

// 极简旋转圆环
.loading-spinner {
  position: relative;
  width: 64px;
  height: 64px;
  @include flex-center;
}

.spinner-ring {
  position: absolute;
  width: 64px;
  height: 64px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.8);
  border-radius: $radius-round;
  animation: spin 1s linear infinite;
}

// 文字区域
.loading-text-wrapper {
  @include flex-column-center;
  gap: $spacing-md;
  text-align: center;
}

.loading-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-medium;
  color: #ffffff;
  margin: 0;
  letter-spacing: 1px;
}

.loading-description {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: $line-height-normal;
}

// 极简加载点
.loading-dots {
  @include flex-center;
  gap: 8px;
  margin-top: $spacing-xs;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: $radius-round;
  background: rgba(255, 255, 255, 0.4);
  animation: dot-bounce 1.4s ease-in-out infinite;

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

// 进度条
.progress-wrapper {
  @include flex-center;
  gap: $spacing-md;
  width: 100%;
  margin-top: $spacing-sm;
}

.progress-bar {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-sm;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: $radius-sm;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s ease-in-out infinite;
  }
}

.progress-text {
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
  text-align: right;
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
