import AOS from 'aos'
import 'aos/dist/aos.css'

export function setupAOS() {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 100,
    delay: 0,
    anchorPlacement: 'top-bottom',
    disable: false,
    startEvent: 'DOMContentLoaded',
    initClassName: 'aos-init',
    animatedClassName: 'aos-animate',
    useClassNames: false,
    disableMutationObserver: false,
    debounceDelay: 50,
    throttleDelay: 99,
  })
}

export function refreshAOS() {
  AOS.refresh()
}

export { AOS }
