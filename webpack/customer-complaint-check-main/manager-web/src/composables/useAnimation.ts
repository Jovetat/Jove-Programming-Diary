import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { gsap } from '@/utils/gsap'

interface MotionVariant {
  opacity?: number
  x?: number
  y?: number
  scale?: number
  rotate?: number
  transition?: {
    duration?: number
    ease?: string | number[]
  }
}

interface MotionVariants {
  initial?: MotionVariant
  enter?: MotionVariant
  leave?: MotionVariant
}

export const useGsapAnimation = () => {
  const animations = ref<gsap.core.Tween[]>([])

  const addAnimation = (animation: gsap.core.Tween) => {
    animations.value.push(animation)
  }

  const clearAnimations = () => {
    animations.value.forEach((anim) => anim.kill())
    animations.value = []
  }

  onUnmounted(() => {
    clearAnimations()
  })

  return {
    animations,
    addAnimation,
    clearAnimations,
  }
}

export const useMotionVariants = () => {
  const fadeInVariants: MotionVariants = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 300,
        ease: 'easeOut',
      },
    },
  }

  const slideUpVariants: MotionVariants = {
    initial: {
      opacity: 0,
      y: 30,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 300,
        ease: 'easeOut',
      },
    },
  }

  const slideDownVariants: MotionVariants = {
    initial: {
      opacity: 0,
      y: -30,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 300,
        ease: 'easeOut',
      },
    },
  }

  const slideLeftVariants: MotionVariants = {
    initial: {
      opacity: 0,
      x: -30,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 300,
        ease: 'easeOut',
      },
    },
  }

  const slideRightVariants: MotionVariants = {
    initial: {
      opacity: 0,
      x: 30,
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 300,
        ease: 'easeOut',
      },
    },
  }

  const scaleInVariants: MotionVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 300,
        ease: [0.68, -0.55, 0.265, 1.55],
      },
    },
  }

  const rotateInVariants: MotionVariants = {
    initial: {
      opacity: 0,
      rotate: -180,
      scale: 0.5,
    },
    enter: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 500,
        ease: 'easeOut',
      },
    },
  }

  return {
    fadeInVariants,
    slideUpVariants,
    slideDownVariants,
    slideLeftVariants,
    slideRightVariants,
    scaleInVariants,
    rotateInVariants,
  }
}

export const useScrollAnimation = (elementRef: Ref<HTMLElement | null>) => {
  const isVisible = ref(false)

  const checkVisibility = () => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight

    isVisible.value = rect.top <= windowHeight * 0.8 && rect.bottom >= 0
  }

  onMounted(() => {
    checkVisibility()
    window.addEventListener('scroll', checkVisibility)
    window.addEventListener('resize', checkVisibility)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkVisibility)
    window.removeEventListener('resize', checkVisibility)
  })

  return {
    isVisible,
  }
}

export const useHoverAnimation = (elementRef: Ref<HTMLElement | null>) => {
  const isHovered = ref(false)

  const handleMouseEnter = () => {
    isHovered.value = true
    if (elementRef.value) {
      gsap.to(elementRef.value, {
        y: -4,
        scale: 1.02,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    isHovered.value = false
    if (elementRef.value) {
      gsap.to(elementRef.value, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
    }
  }

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('mouseenter', handleMouseEnter)
      elementRef.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter)
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return {
    isHovered,
  }
}

export const useStaggerAnimation = (
  elementsRef: Ref<HTMLElement[]>,
  delay = 0.1,
  animation = 'fadeInUp'
) => {
  const animate = () => {
    if (!elementsRef.value || elementsRef.value.length === 0) return

    const animationConfig = {
      fadeInUp: { opacity: 0, y: 20 },
      fadeIn: { opacity: 0 },
      scaleIn: { opacity: 0, scale: 0.8 },
      slideInLeft: { opacity: 0, x: -20 },
      slideInRight: { opacity: 0, x: 20 },
    }

    gsap.from(elementsRef.value, {
      ...animationConfig[animation as keyof typeof animationConfig],
      duration: 0.5,
      stagger: delay,
      ease: 'power2.out',
    })
  }

  onMounted(() => {
    animate()
  })

  return {
    animate,
  }
}
