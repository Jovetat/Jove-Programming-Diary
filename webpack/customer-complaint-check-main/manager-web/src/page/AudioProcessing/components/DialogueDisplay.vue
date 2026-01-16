<template>
  <div class="dialogue-display">
    <div ref="containerRef" class="dialogue-container">
      <div
        v-for="(segment, index) in segments"
        :key="index"
        class="dialogue-item"
        :class="{
          active: index === activeIndex,
          'role-customer': segment.role === 'visitor',
          'role-service': segment.role === 'customer_service',
        }"
        @click="handleSegmentClick(segment)"
      >
        <div class="dialogue-avatar">
          <div class="avatar-icon">
            <svg v-if="segment.role === 'visitor'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </div>

        <div class="dialogue-content">
          <div class="dialogue-header">
            <span class="dialogue-role">{{ getRoleDisplayName(segment.role) }}</span>
            <span class="dialogue-time">{{ formatTime(segment.start) }}</span>
          </div>
          <div class="dialogue-text">{{ segment.text }}</div>
        </div>
      </div>

      <div v-if="segments.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>暂无对话内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { DialogueSegment } from '@/api/audioProcessing.types'

interface Props {
  segments: DialogueSegment[]
  activeIndex?: number
}

interface Emits {
  (e: 'segment-click', segment: DialogueSegment): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const containerRef = ref<HTMLElement | null>(null)

const getRoleDisplayName = (role: string) => {
  return role === 'customer_service' ? '客服' : '客户'
}

const formatTime = (time: string | number): string => {
  const seconds = typeof time === 'string' ? parseFloat(time) / 1000 : time
  if (!seconds || isNaN(seconds)) return '00:00'

  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleSegmentClick = (segment: DialogueSegment) => {
  emit('segment-click', segment)
}

// 自动滚动到激活的对话
watch(
  () => props.activeIndex,
  async (newIndex) => {
    if (newIndex !== undefined && newIndex >= 0 && containerRef.value) {
      await nextTick()
      const items = containerRef.value.querySelectorAll('.dialogue-item')
      const activeElement = items[newIndex] as HTMLElement
      if (activeElement) {
        const container = containerRef.value
        const containerRect = container.getBoundingClientRect()
        const elementRect = activeElement.getBoundingClientRect()

        // 计算元素相对于容器的位置
        const elementTop = elementRect.top - containerRect.top + container.scrollTop
        const elementHeight = elementRect.height
        const containerHeight = containerRect.height

        // 计算目标滚动位置,使元素尽量居中
        // 如果元素在顶部或底部附近,则不强制居中
        const idealScrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2)

        // 平滑滚动到目标位置
        container.scrollTo({
          top: idealScrollTop,
          behavior: 'smooth',
        })
      }
    }
  },
  { immediate: false }
)
</script>

<style scoped lang="scss">
.dialogue-display {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-lg;
  overflow: hidden;
}

.dialogue-container {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

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

.dialogue-item {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.7;

  &:hover {
    opacity: 0.95;
  }

  &.active {
    opacity: 1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  // 客户样式 - 蓝色主题
  &.role-customer {
    background: rgba(100, 200, 255, 0.08);
    border-left-color: rgba(100, 200, 255, 0.3);

    &:hover {
      background: rgba(100, 200, 255, 0.12);
    }

    &.active {
      background: rgba(100, 200, 255, 0.15);
      border-left-color: rgba(100, 200, 255, 0.8);
    }

    .avatar-icon {
      background: rgba(100, 200, 255, 0.2);

      svg {
        color: rgba(100, 200, 255, 1);
      }
    }

    .dialogue-role {
      color: rgba(100, 200, 255, 1);
    }
  }

  // 客服样式 - 绿色主题
  &.role-service {
    background: rgba(150, 255, 150, 0.08);
    border-left-color: rgba(150, 255, 150, 0.3);

    &:hover {
      background: rgba(150, 255, 150, 0.12);
    }

    &.active {
      background: rgba(150, 255, 150, 0.15);
      border-left-color: rgba(150, 255, 150, 0.8);
    }

    .avatar-icon {
      background: rgba(150, 255, 150, 0.2);

      svg {
        color: rgba(150, 255, 150, 1);
      }
    }

    .dialogue-role {
      color: rgba(150, 255, 150, 1);
    }
  }
}

.dialogue-avatar {
  flex-shrink: 0;
}

.avatar-icon {
  width: 32px;
  height: 32px;
  border-radius: $radius-round;
  @include flex-center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
}

.dialogue-content {
  flex: 1;
  min-width: 0;
}

.dialogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: $spacing-sm;
}

.dialogue-role {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  flex-shrink: 0;
}

.dialogue-time {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.dialogue-text {
  font-size: $font-size-sm;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.empty-state {
  @include flex-column-center;
  gap: $spacing-md;
  padding: $spacing-xxl;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;

  svg {
    width: 64px;
    height: 64px;
    stroke-width: 1.5;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: $font-size-base;
  }
}
</style>
