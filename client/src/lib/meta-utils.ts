import AOS from 'aos';

export function initializeAnimations() {
  AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: false,
    mirror: true,
    offset: 80,
    delay: 0,
    disable: false,
    startEvent: 'DOMContentLoaded',
    animatedClassName: 'aos-animate',
    initClassName: 'aos-init',
    anchorPlacement: 'bottom-bottom',
    debounceDelay: 50,
    throttleDelay: 99,
  });
}

export function checkReducedMotion(): boolean {
  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}