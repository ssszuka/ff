import type { HomepageData } from "@/lib/types";

export function updateMetaTags(data: HomepageData) {
  const { meta, owner } = data;
  
  // Update title
  document.title = meta.title || `${owner.displayName} - Content Creator`;
  
  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    (descriptionMeta as HTMLMetaElement).content = meta.description || owner.description || '';
  }
  
  // Update OpenGraph tags
  updateOGTag('og:title', meta.title);
  updateOGTag('og:description', meta.description);
  updateOGTag('og:image', owner.avatarUrl || '');
  updateOGTag('og:url', window.location.href);
  
  // Update Twitter cards
  updateOGTag('twitter:title', meta.title);
  updateOGTag('twitter:description', meta.description);
  updateOGTag('twitter:image', owner.avatarUrl || '');
}

function updateOGTag(property: string, content: string) {
  if (!content) return;
  
  const tag = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
  if (tag) {
    (tag as HTMLMetaElement).content = content;
  }
}

export function initializeAnimations() {
  // Initialize AOS if available
  if (typeof window !== 'undefined' && 'AOS' in window) {
    const isMobile = window.innerWidth < 768;
    (window as any).AOS.init({
      duration: isMobile ? 600 : 800, // Faster on mobile
      easing: 'ease-out-cubic',
      once: true,
      offset: isMobile ? 50 : 100, // Less offset on mobile
      disable: false, // Enable on mobile with optimized settings
      startEvent: 'DOMContentLoaded',
      throttleDelay: 99,
      debounceDelay: 50,
    });
  }
}

export function checkReducedMotion(): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}
