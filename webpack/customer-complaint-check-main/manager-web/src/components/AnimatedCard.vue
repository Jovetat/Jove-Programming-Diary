<template>
  <div
    ref="cardRef"
    v-motion
    :initial="motionVariants.initial"
    :enter="motionVariants.enter"
    class="animated-card"
    :data-aos="aos"
    :data-aos-delay="delay"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMotionVariants, useHoverAnimation } from '@/composables/useAnimation'

interface Props {
  aos?: string
  delay?: number
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  aos: 'fade-up',
  delay: 0,
  animation: 'fadeIn',
  hover: true,
})

const cardRef = ref<HTMLElement | null>(null)

const variants = useMotionVariants()

const motionVariants = computed(() => {
  const variantMap = {
    fadeIn: variants.fadeInVariants,
    slideUp: variants.slideUpVariants,
    slideDown: variants.slideDownVariants,
    slideLeft: variants.slideLeftVariants,
    slideRight: variants.slideRightVariants,
    scaleIn: variants.scaleInVariants,
    rotateIn: variants.rotateInVariants,
  }
  return variantMap[props.animation]
})

if (props.hover) {
  useHoverAnimation(cardRef)
}
</script>

<style scoped lang="scss">
.animated-card {
  @include card-hover;
  cursor: pointer;
}
</style>
