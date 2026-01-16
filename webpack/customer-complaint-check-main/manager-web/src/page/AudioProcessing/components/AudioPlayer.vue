<template>
  <a-card title="音频播放器" :bordered="false">
    <audio
      ref="audioRef"
      controls
      class="audio-player"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
    >
      您的浏览器不支持音频播放。
    </audio>
  </a-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  audioUrl?: string;
}

interface Emits {
  (e: 'time-update', currentTime: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const audioRef = ref<HTMLAudioElement | null>(null);

watch(
  () => props.audioUrl,
  (newUrl) => {
    if (audioRef.value && newUrl) {
      audioRef.value.src = newUrl;
    }
  },
  { immediate: true }
);

const handleTimeUpdate = () => {
  if (audioRef.value) {
    emit('time-update', audioRef.value.currentTime);
  }
};

const handleLoadedMetadata = () => {
  console.log('Audio loaded successfully');
};

const seekTo = (time: number) => {
  if (audioRef.value) {
    audioRef.value.currentTime = time;
  }
};

defineExpose({
  seekTo,
});
</script>

<style scoped lang="scss">
.audio-player {
  width: 100%;
  outline: none;
}

.ant-card {
  margin-bottom: 24px;
}
</style>
