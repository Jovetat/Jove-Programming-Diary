<template>
  <div class="audio-player-container">
    <audio
      ref="audioRef"
      :src="audioUrl"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
      @play="isPlaying = true"
      @pause="isPlaying = false"
    />

    <div class="player-content">
      <!-- 左侧：播放控制 -->
      <div class="player-controls">
        <button class="control-button play-button" @click="togglePlay">
          <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </button>

        <div class="time-info">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="time-separator">/</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 中间：进度条 -->
      <div class="progress-section">
        <div
          ref="progressBarRef"
          class="progress-bar"
          @click="handleProgressClick"
          @mousedown="isDragging = true"
        >
          <div class="progress-bg" />
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }">
            <div class="progress-handle" />
          </div>
        </div>
      </div>

      <!-- 右侧：倍速和音量控制 -->
      <div class="volume-controls">
        <!-- 倍速控制 -->
        <div class="speed-control">
          <button class="control-button speed-button" @click="toggleSpeedMenu">
            <span class="speed-text">{{ playbackRate }}x</span>
          </button>
          <transition name="speed-menu">
            <div v-if="showSpeedMenu" class="speed-menu">
              <button
                v-for="speed in speedOptions"
                :key="speed"
                class="speed-option"
                :class="{ active: playbackRate === speed }"
                @click="setPlaybackRate(speed)"
              >
                {{ speed }}x
              </button>
            </div>
          </transition>
        </div>

        <button class="control-button volume-button" @click="toggleMute">
          <svg v-if="!isMuted && volume > 0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <svg v-else-if="!isMuted && volume > 0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        </button>

        <div class="volume-slider-wrapper">
          <input
            v-model.number="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="volume-slider"
            @input="handleVolumeChange"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  audioUrl?: string
}

interface Emits {
  (e: 'time-update', currentTime: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const audioRef = ref<HTMLAudioElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isDragging = ref(false)
const playbackRate = ref(1.25)
const showSpeedMenu = ref(false)

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const handleTimeUpdate = () => {
  if (audioRef.value && !isDragging.value) {
    currentTime.value = audioRef.value.currentTime
    emit('time-update', audioRef.value.currentTime)
  }
}

const handleLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration || 0
    audioRef.value.playbackRate = playbackRate.value
  }
}

const handleEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const togglePlay = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

const handleProgressClick = (event: MouseEvent) => {
  if (!audioRef.value || !progressBarRef.value) return

  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const newTime = percent * duration.value

  audioRef.value.currentTime = newTime
  currentTime.value = newTime
}

const handleVolumeChange = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
    isMuted.value = volume.value === 0
  }
}

const toggleMute = () => {
  if (!audioRef.value) return

  if (isMuted.value) {
    volume.value = 1
    audioRef.value.volume = 1
    isMuted.value = false
  } else {
    audioRef.value.volume = 0
    isMuted.value = true
  }
}

const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

const toggleSpeedMenu = () => {
  showSpeedMenu.value = !showSpeedMenu.value
}

const setPlaybackRate = (rate: number) => {
  playbackRate.value = rate
  if (audioRef.value) {
    audioRef.value.playbackRate = rate
  }
  showSpeedMenu.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.speed-control')) {
    showSpeedMenu.value = false
  }
}

const formatTime = (time: number): string => {
  if (!time || isNaN(time)) return '00:00'

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging.value && audioRef.value && progressBarRef.value) {
    const rect = progressBarRef.value.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const newTime = percent * duration.value

    audioRef.value.currentTime = newTime
    currentTime.value = newTime
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => props.audioUrl,
  (newUrl) => {
    if (audioRef.value && newUrl) {
      audioRef.value.src = newUrl
      audioRef.value.load()
      currentTime.value = 0
      isPlaying.value = false
    }
  },
  { immediate: true }
)

const seekTo = (time: number) => {
  if (audioRef.value) {
    audioRef.value.currentTime = time
    currentTime.value = time
  }
}

const play = () => {
  if (audioRef.value) {
    audioRef.value.play()
  }
}

defineExpose({
  seekTo,
  play,
})
</script>

<style scoped lang="scss">
.audio-player-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: $z-index-fixed;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: $spacing-lg $spacing-xl;
}

.player-content {
  display: flex;
  align-items: center;
  gap: $spacing-xl;
  max-width: 1400px;
  margin: 0 auto;
}

// 左侧播放控制
.player-controls {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-shrink: 0;
}

.control-button {
  @include flex-center;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-round;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &.play-button {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.1);

    svg {
      width: 28px;
      height: 28px;
    }
  }
}

.time-info {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.7);
  font-variant-numeric: tabular-nums;
  min-width: 100px;
}

.current-time {
  color: #ffffff;
  font-weight: $font-weight-medium;
}

.time-separator {
  color: rgba(255, 255, 255, 0.4);
}

.total-time {
  color: rgba(255, 255, 255, 0.6);
}

// 中间进度条
.progress-section {
  flex: 1;
  min-width: 0;
}

.progress-bar {
  position: relative;
  height: 6px;
  cursor: pointer;
  border-radius: $radius-sm;
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-sm;
}

.progress-fill {
  position: relative;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: $radius-sm;
  transition: width 0.1s linear;
}

.progress-handle {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: $radius-round;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

// 右侧倍速和音量控制
.volume-controls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  flex-shrink: 0;
}

// 倍速控制
.speed-control {
  position: relative;
}

.speed-button {
  width: 60px;
  height: 40px;
  padding: 0;

  .speed-text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: rgba(255, 255, 255, 0.9);
  }
}

.speed-menu {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: $radius-md;
  padding: $spacing-xs;
  min-width: 80px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.speed-option {
  display: block;
  width: 100%;
  padding: $spacing-xs $spacing-sm;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: $font-size-sm;
  text-align: center;
  cursor: pointer;
  border-radius: $radius-sm;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    font-weight: $font-weight-semibold;
  }
}

.speed-menu-enter-active,
.speed-menu-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.speed-menu-enter-from,
.speed-menu-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}

.volume-button {
  width: 40px;
  height: 40px;

  svg {
    width: 20px;
    height: 20px;
  }
}

.volume-slider-wrapper {
  width: 80px;
}

.volume-slider {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $radius-sm;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: $radius-round;
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::-webkit-slider-thumb:hover {
    background: #ffffff;
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: $radius-round;
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    border: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::-moz-range-thumb:hover {
    background: #ffffff;
    transform: scale(1.2);
  }
}

audio {
  display: none;
}

@media (max-width: $breakpoint-md) {
  .player-content {
    gap: $spacing-md;
    padding: 0 $spacing-sm;
  }

  .volume-controls {
    gap: $spacing-xs;
  }

  .volume-slider-wrapper {
    display: none;
  }

  .speed-button {
    width: 50px;
  }

  .time-info {
    min-width: 80px;
    font-size: $font-size-xs;
  }

  .control-button {
    width: 44px;
    height: 44px;

    &.play-button {
      width: 52px;
      height: 52px;
    }
  }
}
</style>
