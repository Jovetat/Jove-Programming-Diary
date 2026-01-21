<template>
  <div class="dialogue-display">
    <div ref="containerRef" class="dialogue-container">
      <transition-group name="dialogue-slide">
        <div
          v-for="(segment, index) in visibleSegments"
          :key="`segment-${index}`"
          class="dialogue-item"
          :class="{
            active: index === activeIndex,
            'role-customer': segment.role === 'visitor',
            'role-service': segment.role === 'customer_service',
          }"
          @click="handleSegmentClick(segment)"
        >
          <div
            v-if="segment.overlaps && segment.role === 'customer_service'"
            class="overlap-indicator"
          >
            抢话
          </div>
          <div class="dialogue-bubble">
            <div class="bubble-header">
              <div class="bubble-avatar">
                <img
                  v-if="segment.role === 'visitor'"
                  :src="userAvatar"
                  alt="客户头像"
                />
                <img v-else :src="serviceAvatar" alt="客服头像" />
              </div>
              <span class="bubble-role">{{
                getRoleDisplayName(segment.role)
              }}</span>
              <span
                class="bubble-emotion"
                :class="getEmotionClass(segment.emotion)"
              >
                {{ getEmotionDisplay(segment.emotion) }}
              </span>
              <span class="bubble-time">{{ formatTime(segment.start) }}</span>
            </div>
            <div class="bubble-text">{{ segment.text }}</div>
          </div>
        </div>
      </transition-group>

      <div v-if="visibleSegments.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          />
        </svg>
        <p>暂无对话内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue';
import type { DialogueSegment } from '@/api/audioProcessing.types';
import userAvatar from '@/assets/user.png';
import serviceAvatar from '@/assets/service.png';

interface Props {
  segments: DialogueSegment[];
  activeIndex?: number;
}

interface Emits {
  (e: 'segment-click', segment: DialogueSegment): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const containerRef = ref<HTMLElement | null>(null);

// 追踪已经显示过的最大索引（用于保留已显示的内容）
const maxVisibleIndex = ref(-1);

// 只显示已播放过的对话（基于最大显示索引）
const visibleSegments = computed(() => {
  if (maxVisibleIndex.value < 0) {
    return [];
  }
  return props.segments.slice(0, maxVisibleIndex.value + 1);
});

const getRoleDisplayName = (role: string) => {
  return role === 'customer_service' ? '客服' : '客户';
};

const getEmotionDisplay = (emotion?: string) => {
  if (!emotion || emotion === '正常') {
    return '😊 正常';
  }
  if (emotion === '愤怒') {
    return '😠 愤怒';
  }
  return '😊 正常';
};

const getEmotionClass = (emotion?: string) => {
  if (!emotion || emotion === '正常') {
    return 'emotion-normal';
  }
  if (emotion === '愤怒') {
    return 'emotion-angry';
  }
  return 'emotion-normal';
};

const formatTime = (time: string | number): string => {
  const seconds = typeof time === 'string' ? parseFloat(time) / 1000 : time;
  if (!seconds || isNaN(seconds)) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const handleSegmentClick = (segment: DialogueSegment) => {
  emit('segment-click', segment);
};

// 监听 segments 变化，重置最大显示索引
watch(
  () => props.segments,
  () => {
    maxVisibleIndex.value = -1;
  },
);

// 更新最大显示索引并自动滚动
watch(
  () => props.activeIndex,
  async (newIndex, oldIndex) => {
    if (newIndex === undefined || newIndex < 0 || !containerRef.value) return;

    // 更新最大显示索引（只增不减）
    const isNewContent = newIndex > maxVisibleIndex.value;
    if (isNewContent) {
      maxVisibleIndex.value = newIndex;

      // 只在播放到新内容时才自动滚动到底部
      await nextTick();
      // 等待动画开始后再滚动
      setTimeout(() => {
        if (containerRef.value) {
          // 滚动到容器底部
          containerRef.value.scrollTo({
            top: containerRef.value.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 50);
    } else if (oldIndex !== undefined && newIndex < oldIndex) {
      // 用户点击跳转到前面的内容，滚动到对应位置
      await nextTick();
      const items = containerRef.value.querySelectorAll('.dialogue-item');
      const targetElement = items[newIndex] as HTMLElement;
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  },
  { immediate: false },
);
</script>

<style scoped lang="scss">
.dialogue-display {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: $radius-lg;
  overflow: hidden;
  position: relative;
}

.dialogue-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: $spacing-md $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
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

.dialogue-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.75;

  &:hover {
    opacity: 0.95;
  }

  &.active {
    opacity: 1;

    .dialogue-bubble {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
    }
  }

  .overlap-indicator {
    font-size: 11px;
    font-weight: $font-weight-medium;
    color: rgba(255, 100, 100, 1);
    background: rgba(255, 100, 100, 0.15);
    border: 1px solid rgba(255, 100, 100, 0.4);
    padding: 2px 6px;
    border-radius: $radius-sm;
    white-space: nowrap;
    flex-shrink: 0;
    line-height: 1.2;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover .overlap-indicator {
    background: rgba(255, 100, 100, 0.2);
    border-color: rgba(255, 100, 100, 0.5);
  }

  &.active .overlap-indicator {
    background: rgba(255, 100, 100, 0.25);
    border-color: rgba(255, 100, 100, 0.6);
  }

  // 客服在左侧
  &.role-service {
    justify-content: flex-start;

    .dialogue-bubble {
      background: rgba(150, 255, 150, 0.12);
      border: 1px solid rgba(150, 255, 150, 0.2);
    }

    &:hover .dialogue-bubble {
      background: rgba(150, 255, 150, 0.15);
      border-color: rgba(150, 255, 150, 0.3);
    }

    &.active .dialogue-bubble {
      background: rgba(150, 255, 150, 0.18);
      border-color: rgba(150, 255, 150, 0.5);
    }

    .bubble-role {
      color: rgba(150, 255, 150, 1);
    }
  }

  // 客户在右侧
  &.role-customer {
    justify-content: flex-end;

    .dialogue-bubble {
      background: rgba(100, 200, 255, 0.12);
      border: 1px solid rgba(100, 200, 255, 0.2);
    }

    &:hover .dialogue-bubble {
      background: rgba(100, 200, 255, 0.15);
      border-color: rgba(100, 200, 255, 0.3);
    }

    &.active .dialogue-bubble {
      background: rgba(100, 200, 255, 0.18);
      border-color: rgba(100, 200, 255, 0.5);
    }

    .bubble-role {
      color: rgba(100, 200, 255, 1);
    }
  }
}

// 对话滑入动画
.dialogue-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialogue-slide-enter-from {
  opacity: 0;

  // 客服从左边滑入
  &.role-service {
    transform: translateX(-100px);
  }

  // 客户从右边滑入
  &.role-customer {
    transform: translateX(100px);
  }
}

.dialogue-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

// 移除时的动画（保持在原位，仅淡出）
.dialogue-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

.dialogue-slide-leave-to {
  opacity: 0;
}

.dialogue-slide-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialogue-bubble {
  max-width: 70%;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-lg;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bubble-header {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-bottom: $spacing-xs;
}

.bubble-avatar {
  width: 24px;
  height: 24px;
  border-radius: $radius-round;
  @include flex-center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bubble-role {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  flex-shrink: 0;
}

.bubble-emotion {
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: $radius-sm;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &.emotion-normal {
    background: rgba(100, 255, 150, 0.15);
    color: rgba(150, 255, 180, 1);
    border: 1px solid rgba(100, 255, 150, 0.3);
  }

  &.emotion-angry {
    background: rgba(255, 100, 100, 0.15);
    color: rgba(255, 150, 150, 1);
    border: 1px solid rgba(255, 100, 100, 0.3);
  }
}

.bubble-time {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
  margin-left: auto;
}

.bubble-text {
  font-size: $font-size-sm;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
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
