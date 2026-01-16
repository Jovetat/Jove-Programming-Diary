<template>
  <div
    ref="dropZoneRef"
    class="upload-zone"
    :class="{ 'is-dragover': isDragover, 'is-disabled': disabled }"
    @click="handleClick"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragleave"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="audio/*"
      style="display: none"
      @change="handleFileChange"
    >

    <div class="upload-icon-wrapper">
      <div class="upload-icon-circle">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
    </div>

    <div class="upload-content">
      <h3 class="upload-title">{{ title }}</h3>
      <p class="upload-description">{{ description }}</p>
      <div v-if="selectedFile" class="selected-file">
        <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
        <span class="file-name">{{ selectedFile.name }}</span>
        <button class="file-remove" @click.stop="handleRemove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from '@/utils/gsap'

interface Props {
  title?: string
  description?: string
  disabled?: boolean
}

interface Emits {
  (e: 'file-selected', file: File): void
  (e: 'file-removed'): void
}

withDefaults(defineProps<Props>(), {
  title: '拖拽音频文件到这里',
  description: '或点击选择文件 · 支持 MP3、WAV、M4A 等格式',
  disabled: false,
})

const emit = defineEmits<Emits>()

const dropZoneRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragover = ref(false)
const selectedFile = ref<File | null>(null)

const handleClick = () => {
  if (!selectedFile.value) {
    fileInputRef.value?.click()
  }
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFileSelected(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragover.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('audio/')) {
    handleFileSelected(file)
  }
}

const handleDragover = () => {
  isDragover.value = true
}

const handleDragleave = () => {
  isDragover.value = false
}

const handleFileSelected = (file: File) => {
  selectedFile.value = file
  emit('file-selected', file)

  if (dropZoneRef.value) {
    gsap.from(dropZoneRef.value.querySelector('.selected-file'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    })
  }
}

const handleRemove = () => {
  selectedFile.value = null
  emit('file-removed')
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}
</script>

<style scoped lang="scss">
.upload-zone {
  position: relative;
  min-height: 300px;
  @include flex-column-center;
  gap: $spacing-xl;
  padding: $spacing-xxl;
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: $radius-lg;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(.is-disabled) {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    .upload-icon-circle {
      transform: scale(1.05);
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &.is-dragover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.08);
    transform: scale(1.01);
  }

  &.is-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.upload-icon-wrapper {
  position: relative;
  @include flex-center;
}

.upload-icon-circle {
  @include flex-center;
  width: 80px;
  height: 80px;
  border-radius: $radius-round;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-icon {
  width: 36px;
  height: 36px;
  color: rgba(255, 255, 255, 0.6);
  stroke-width: 1.5;
}

.upload-content {
  @include flex-column-center;
  gap: $spacing-sm;
  text-align: center;
  position: relative;
  z-index: 1;
}

.upload-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
  color: #ffffff;
  margin: 0;
}

.upload-description {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.selected-file {
  @include flex-center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: $radius-lg;
  margin-top: $spacing-md;
}

.file-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.6);
  stroke-width: 1.5;
  flex-shrink: 0;
}

.file-name {
  font-size: $font-size-sm;
  color: #ffffff;
  font-weight: $font-weight-medium;
  @include text-ellipsis(1);
  max-width: 200px;
}

.file-remove {
  @include flex-center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all $duration-fast $ease-out;
  flex-shrink: 0;

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
</style>
