<template>
  <a-card title="对话分段结果" :bordered="false">
    <div class="segments-container">
      <div
        v-for="(segment, index) in segments"
        :key="index"
        class="segment"
        :class="{ active: index === activeIndex }"
        @click="handleSegmentClick(segment)"
      >
        <div class="segment-header">
          <span class="segment-role" :class="getRoleClass(segment.role)">
            {{ getRoleDisplayName(segment.role) }}
          </span>
          <span class="segment-time">{{ formatTime(segment.start) }}</span>
        </div>
        <div class="segment-text">{{ segment.text }}</div>
      </div>
      <div v-if="segments.length === 0" class="empty-state">
        <a-empty description="暂无对话分段数据" />
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import type { DialogueSegment } from '@/api/audioProcessing.types';
import { formatTime, getRoleDisplayName } from '@/utils/audioUtils';

interface Props {
  segments: DialogueSegment[];
  activeIndex?: number;
}

interface Emits {
  (e: 'segment-click', segment: DialogueSegment): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const getRoleClass = (role: string) => {
  return role === 'customer_service' ? 'role-service' : 'role-customer';
};

const handleSegmentClick = (segment: DialogueSegment) => {
  emit('segment-click', segment);
};
</script>

<style scoped lang="scss">
.segments-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px 0;
}

.segment {
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &.active {
    background-color: #e6f7ff;
    border-left: 4px solid #1890ff;
  }
}

.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.segment-role {
  font-weight: 600;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;

  &.role-service {
    color: #1890ff;
    background-color: #e6f7ff;
  }

  &.role-customer {
    color: #52c41a;
    background-color: #f6ffed;
  }
}

.segment-time {
  color: #8c8c8c;
  font-size: 12px;
}

.segment-text {
  color: #262626;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
