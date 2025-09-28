// Meta utilities for updating page meta tags and initializing animations

// Safe meta tag update function that won't override with empty values
export function updateOGTagSafe(property: string, content: string, fallback?: string) {
  // Don't update if content is empty and we have a fallback or existing content
  if (!content && fallback) {
    content = fallback;
  }
  
  // Don't update if content is still empty
  if (!content) {
    return;
  }
  
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    (tag as HTMLMetaElement).setAttribute('property', property);
    document.head.appendChild(tag);
  }
  (tag as HTMLMetaElement).content = content;
}

// Safe Twitter Card tag update function
export function updateTwitterTagSafe(name: string, content: string, fallback?: string) {
  // Don't update if content is empty and we have a fallback or existing content
  if (!content && fallback) {
    content = fallback;
  }
  
  // Don't update if content is still empty
  if (!content) {
    return;
  }
  
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    (tag as HTMLMetaElement).setAttribute('name', name);
    document.head.appendChild(tag);
  }
  (tag as HTMLMetaElement).content = content;
}

// Safe meta tag update function for regular meta tags
export function updateMetaTagSafe(name: string, content: string, fallback?: string) {
  // Don't update if content is empty and we have a fallback or existing content
  if (!content && fallback) {
    content = fallback;
  }
  
  // Don't update if content is still empty
  if (!content) {
    return;
  }
  
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    (tag as HTMLMetaElement).setAttribute('name', name);
    document.head.appendChild(tag);
  }
  (tag as HTMLMetaElement).content = content;
}

export function updateMetaTags(data: any) {
  // Update page title
  if (data?.owner?.displayName) {
    document.title = `${data.owner.displayName} - Content Creator & YouTuber`;
  }

  // Update meta description
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
  // Initialize AOS animations if available
  if (typeof window !== 'undefined' && 'AOS' in window) {
    (window as any).AOS.init({
      duration: 600, // Faster animation duration for better mobile/PC experience
      easing: 'ease-out', // Smoother easing for mobile
      once: false, // Allow animations to trigger on scroll up and down
      mirror: true, // Animate elements out while scrolling up
      offset: 80, // Keep normal offset for scroll down animations
      delay: 0,
      disable: false, // Enable on all devices
      startEvent: 'DOMContentLoaded', // Initialize on page load
      animatedClassName: 'aos-animate',
      initClassName: 'aos-init',
      anchorPlacement: 'bottom-bottom', // Better control for out animations
      debounceDelay: 50, // Reduce debounce for more responsive animations
      throttleDelay: 99, // Optimize scroll performance
      mirrorOffset: 260, // Specific offset for mirror (out) animations - triggers much earlier
    });
  }

  // Initialize GSAP animations if available
  if (typeof window !== 'undefined' && 'gsap' in window) {
    // GSAP is available, animations will be handled by individual components
  }
}

export function checkReducedMotion(): boolean {
  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}