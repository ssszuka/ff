import AOS from 'aos';

export function updateMetaTags(data: any) {
  if (data?.owner?.displayName) {
    document.title = `${data.owner.displayName} - Content Creator & YouTuber`;
  }

  const description = data?.owner?.about || "Passionate content creator and YouTuber";
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    (descriptionMeta as HTMLMetaElement).content = description;
  } else {
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = description;
    document.head.appendChild(meta);
  }
}

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