import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  DialogueSegment,
  ClassificationResult,
  ReconciliationResult,
  TagOptions,
} from '@/api/audioProcessing.types';

export const useAudioProcessingStore = defineStore('audioProcessing', () => {
  const audioUrl = ref<string>('');
  const asrText = ref<string>('');
  const dialogueSegments = ref<DialogueSegment[]>([]);
  const complaintResult = ref<ClassificationResult | null>(null);
  const appealResult = ref<ClassificationResult | null>(null);
  const solutionResult = ref<ClassificationResult | null>(null);
  const reconciliationResult = ref<ReconciliationResult | null>(null);
  const tagOptions = ref<TagOptions | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string>('');
  const activeSegmentIndex = ref<number>(-1);

  function setAudioUrl(url: string) {
    audioUrl.value = url;
  }

  function setProcessingResults(data: {
    asr_text: string;
    dialogue_segments: DialogueSegment[];
    complaint: ClassificationResult;
    appeal: ClassificationResult;
    solution: ClassificationResult;
    reconciliation: ReconciliationResult;
  }) {
    asrText.value = data.asr_text;
    dialogueSegments.value = data.dialogue_segments;
    complaintResult.value = data.complaint;
    appealResult.value = data.appeal;
    solutionResult.value = data.solution;
    reconciliationResult.value = data.reconciliation;
  }

  function setTagOptions(options: TagOptions) {
    tagOptions.value = options;
  }

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setError(message: string) {
    error.value = message;
  }

  function setActiveSegmentIndex(index: number) {
    activeSegmentIndex.value = index;
  }

  function clearResults() {
    audioUrl.value = '';
    asrText.value = '';
    dialogueSegments.value = [];
    complaintResult.value = null;
    appealResult.value = null;
    solutionResult.value = null;
    reconciliationResult.value = null;
    error.value = '';
    activeSegmentIndex.value = -1;
  }

  return {
    audioUrl,
    asrText,
    dialogueSegments,
    complaintResult,
    appealResult,
    solutionResult,
    reconciliationResult,
    tagOptions,
    loading,
    error,
    activeSegmentIndex,
    setAudioUrl,
    setProcessingResults,
    setTagOptions,
    setLoading,
    setError,
    setActiveSegmentIndex,
    clearResults,
  };
});
