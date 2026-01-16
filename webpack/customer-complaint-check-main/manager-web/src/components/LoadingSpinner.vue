<template>
  <div class="loading-container" :class="{ fullscreen }">
    <div class="spinner" :class="size">
      <div class="spinner-circle" />
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  text?: string
  fullscreen?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  text: '',
  fullscreen: false,
})
</script>

<style scoped lang="scss">
.loading-container {
  @include flex-column-center;
  gap: $spacing-md;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: $z-index-modal;
  }
}

.spinner {
  position: relative;

  &.small {
    width: 24px;
    height: 24px;
  }

  &.medium {
    width: 40px;
    height: 40px;
  }

  &.large {
    width: 60px;
    height: 60px;
  }
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid $border-light;
  border-top-color: $primary-color;
  border-radius: $radius-round;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: 0;
}
</style>
