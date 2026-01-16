import gsap from 'gsap'

export const gsapConfig = {
  ease: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.5)',
    strong: 'power4.out',
  },
  duration: {
    fast: 0.2,
    base: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
}

export const fadeIn = (element: HTMLElement | string, duration = gsapConfig.duration.base) => {
  return gsap.from(element, {
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const fadeOut = (element: HTMLElement | string, duration = gsapConfig.duration.base) => {
  return gsap.to(element, {
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const slideInUp = (
  element: HTMLElement | string,
  distance = 30,
  duration = gsapConfig.duration.base
) => {
  return gsap.from(element, {
    y: distance,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const slideInDown = (
  element: HTMLElement | string,
  distance = 30,
  duration = gsapConfig.duration.base
) => {
  return gsap.from(element, {
    y: -distance,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const slideInLeft = (
  element: HTMLElement | string,
  distance = 30,
  duration = gsapConfig.duration.base
) => {
  return gsap.from(element, {
    x: -distance,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const slideInRight = (
  element: HTMLElement | string,
  distance = 30,
  duration = gsapConfig.duration.base
) => {
  return gsap.from(element, {
    x: distance,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const scaleIn = (element: HTMLElement | string, duration = gsapConfig.duration.base) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.bounce,
  })
}

export const scaleOut = (element: HTMLElement | string, duration = gsapConfig.duration.base) => {
  return gsap.to(element, {
    scale: 0.8,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const rotateIn = (element: HTMLElement | string, duration = gsapConfig.duration.base) => {
  return gsap.from(element, {
    rotation: -180,
    scale: 0.5,
    opacity: 0,
    duration,
    ease: gsapConfig.ease.bounce,
  })
}

export const staggerFadeIn = (
  elements: HTMLElement[] | string,
  stagger = 0.1,
  duration = gsapConfig.duration.base
) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 20,
    duration,
    stagger,
    ease: gsapConfig.ease.smooth,
  })
}

export const hoverLift = (element: HTMLElement) => {
  const onEnter = () => {
    gsap.to(element, {
      y: -4,
      scale: 1.02,
      duration: gsapConfig.duration.fast,
      ease: gsapConfig.ease.smooth,
    })
  }

  const onLeave = () => {
    gsap.to(element, {
      y: 0,
      scale: 1,
      duration: gsapConfig.duration.fast,
      ease: gsapConfig.ease.smooth,
    })
  }

  element.addEventListener('mouseenter', onEnter)
  element.addEventListener('mouseleave', onLeave)

  return () => {
    element.removeEventListener('mouseenter', onEnter)
    element.removeEventListener('mouseleave', onLeave)
  }
}

export const shake = (element: HTMLElement | string, intensity = 10) => {
  return gsap.to(element, {
    x: intensity,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: 'power1.inOut',
  })
}

export const pulse = (element: HTMLElement | string, scale = 1.05) => {
  return gsap.to(element, {
    scale,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  })
}

export const bounce = (element: HTMLElement | string, height = 10) => {
  return gsap.to(element, {
    y: -height,
    duration: 0.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
  })
}

export const spin = (element: HTMLElement | string, duration = 1) => {
  return gsap.to(element, {
    rotation: 360,
    duration,
    repeat: -1,
    ease: 'linear',
  })
}

export const morphShape = (
  element: HTMLElement | string,
  properties: gsap.TweenVars,
  duration = gsapConfig.duration.base
) => {
  return gsap.to(element, {
    ...properties,
    duration,
    ease: gsapConfig.ease.smooth,
  })
}

export const timeline = () => {
  return gsap.timeline()
}

export const createScrollTrigger = (element: HTMLElement | string, animation: gsap.TweenVars) => {
  return gsap.from(element, {
    ...animation,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })
}

export const parallax = (element: HTMLElement | string, speed = 0.5) => {
  return gsap.to(element, {
    y: () => window.scrollY * speed,
    ease: 'none',
  })
}

export { gsap }
