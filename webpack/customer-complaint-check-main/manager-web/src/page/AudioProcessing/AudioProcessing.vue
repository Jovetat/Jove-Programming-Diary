<template>
  <div class="audio-processing-page">
    <h1 class="page-title">音频处理</h1>

    <AudioInput
      :loading="store.loading"
      @process-url="handleProcessUrl"
      @process-file="handleProcessFile"
    />

    <a-spin :spinning="store.loading" tip="正在处理音频，请稍候...">
      <div v-if="store.error" class="error-container">
        <a-alert :message="store.error" type="error" show-icon closable />
      </div>

      <div v-if="hasResults" class="results-container">
        <DialogueSegments
          :segments="store.dialogueSegments"
          :active-index="store.activeSegmentIndex"
          @segment-click="handleSegmentClick"
        />

        <AudioPlayer
          ref="audioPlayerRef"
          :audio-url="store.audioUrl"
          @time-update="handleTimeUpdate"
        />

        <AsrText :asr-text="store.asrText" />

        <ClassificationResults
          :complaint="store.complaintResult"
          :appeal="store.appealResult"
          :solution="store.solutionResult"
          :reconciliation="store.reconciliationResult"
        />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useAudioProcessingStore } from '@/stores/audioProcessing';
import { audioProcessingApi } from '@/api/audioProcessing';
import { findActiveSegment } from '@/utils/audioUtils';
import type { DialogueSegment } from '@/api/audioProcessing.types';
import AudioInput from './components/AudioInput.vue';
import DialogueSegments from './components/DialogueSegments.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import AsrText from './components/AsrText.vue';
import ClassificationResults from './components/ClassificationResults.vue';

const store = useAudioProcessingStore();
const audioPlayerRef = ref<InstanceType<typeof AudioPlayer> | null>(null);

const hasResults = computed(() => {
  return store.dialogueSegments.length > 0 || store.asrText;
});

onMounted(async () => {
  try {
    const response = await audioProcessingApi.getTagOptions();
    if (response.success && response.options) {
      store.setTagOptions(response.options);
    }
  } catch (error) {
    console.error('Failed to load tag options:', error);
  }
});

const handleProcessUrl = async (url: string) => {
  try {
    store.setLoading(true);
    store.setError('');
    store.clearResults();

    const response = await audioProcessingApi.processAudioUrl(url);

    if (response.success) {
      store.setAudioUrl(url);
      store.setProcessingResults({
        asr_text: response.asr_text,
        dialogue_segments: response.dialogue_segments,
        complaint: response.complaint,
        appeal: response.appeal,
        solution: response.solution,
        reconciliation: response.reconciliation,
      });
      message.success('音频处理完成');
    } else {
      store.setError(response.error || '处理音频时发生错误');
      message.error(response.error || '处理音频时发生错误');
    }
  } catch (error: any) {
    const errorMsg = error?.message || '网络错误，请稍后重试';
    store.setError(errorMsg);
    message.error(errorMsg);
  } finally {
    store.setLoading(false);
  }
};

const handleProcessFile = async (file: File) => {
  try {
    store.setLoading(true);
    store.setError('');
    store.clearResults();

    const response = await audioProcessingApi.processAudioFile(file);

    if (response.success) {
      const fileUrl = URL.createObjectURL(file);
      store.setAudioUrl(fileUrl);
      store.setProcessingResults({
        asr_text: response.asr_text,
        dialogue_segments: response.dialogue_segments,
        complaint: response.complaint,
        appeal: response.appeal,
        solution: response.solution,
        reconciliation: response.reconciliation,
      });
      message.success('音频处理完成');
    } else {
      store.setError(response.error || '处理音频时发生错误');
      message.error(response.error || '处理音频时发生错误');
    }
  } catch (error: any) {
    const errorMsg = error?.message || '网络错误，请稍后重试';
    store.setError(errorMsg);
    message.error(errorMsg);
  } finally {
    store.setLoading(false);
  }
};

const handleSegmentClick = (segment: DialogueSegment) => {
  const startTime = parseFloat(segment.start);
  if (audioPlayerRef.value && !isNaN(startTime)) {
    audioPlayerRef.value.seekTo(startTime);
  }
};

const handleTimeUpdate = (currentTime: number) => {
  const activeIndex = findActiveSegment(currentTime, store.dialogueSegments);
  store.setActiveSegmentIndex(activeIndex);
};
</script>

<style scoped lang="scss">
.audio-processing-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 24px;
}

.error-container {
  margin-bottom: 24px;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
