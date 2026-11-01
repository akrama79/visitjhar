/**
 * VisitJhar Central Image Utilities
 * 
 * Provides robust URL normalization, standard Wikimedia thumbnail sizing,
 * fail-safe fallbacks, category-specific SVG placeholders, and error handling
 * for all tourism images across VisitJhar.
 */

// Standard sizes allowed by Wikimedia Commons Varnish cache:
// 20px, 40px, 60px, 120px, 250px, 330px, 500px, 960px, 1280px, 1920px, 3840px
// Requests for non-standard sizes (such as 800px) receive HTTP 400 Bad Request.
// Unscaled direct hotlinking of multi-megabyte originals receives HTTP 429 Too Many Requests.
export const STANDARD_WIKIMEDIA_SIZES = [20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840];

// High-quality category-specific SVG placeholders designed with rich gradients and iconography
export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  'waterfalls': '/placeholders/placeholder-waterfalls.svg',
  'spirituality': '/placeholders/placeholder-spirituality.svg',
  'heritage': '/placeholders/placeholder-heritage.svg',
  'nature': '/placeholders/placeholder-nature.svg',
  'wildlife': '/placeholders/placeholder-wildlife.svg',
  'hills': '/placeholders/placeholder-hills.svg',
  'lakes': '/placeholders/placeholder-lakes.svg',
  'culture': '/placeholders/placeholder-culture.svg',
  'adventure': '/placeholders/placeholder-adventure.svg',
  'default': '/placeholders/placeholder-default.svg'
};

/**
 * Returns the visually appropriate category placeholder for any given category or pillar.
 */
export function getCategoryPlaceholder(category?: string | null, pillar?: string | null): string {
  const text = `${category || ''} ${pillar || ''}`.toLowerCase();

  if (text.includes('waterfall') || text.includes('falls')) {
    return CATEGORY_PLACEHOLDERS['waterfalls'];
  }
  if (text.includes('spiritual') || text.includes('religious') || text.includes('temple') || text.includes('mandir') || text.includes('dham')) {
    return CATEGORY_PLACEHOLDERS['spirituality'];
  }
  if (text.includes('heritage') || text.includes('archaeology') || text.includes('fort') || text.includes('palace') || text.includes('historical')) {
    return CATEGORY_PLACEHOLDERS['heritage'];
  }
  if (text.includes('lake') || text.includes('dam') || text.includes('reservoir')) {
    return CATEGORY_PLACEHOLDERS['lakes'];
  }
  if (text.includes('wildlife') || text.includes('forest') || text.includes('sanctuary') || text.includes('zoo')) {
    return CATEGORY_PLACEHOLDERS['wildlife'];
  }
  if (text.includes('hill') || text.includes('plateau') || text.includes('peak') || text.includes('viewpoint')) {
    return CATEGORY_PLACEHOLDERS['hills'];
  }
  if (text.includes('tribal') || text.includes('culture') || text.includes('craft') || text.includes('art')) {
    return CATEGORY_PLACEHOLDERS['culture'];
  }
  if (text.includes('adventure') || text.includes('trek')) {
    return CATEGORY_PLACEHOLDERS['adventure'];
  }
  if (text.includes('nature') || text.includes('eco')) {
    return CATEGORY_PLACEHOLDERS['nature'];
  }

  return CATEGORY_PLACEHOLDERS['default'];
}

// Local authentic Jharkhand plateau sunset image (stored in public/hero-poster.jpg)
export const LOCAL_FALLBACK_IMAGE = '/hero-poster.jpg';

// Default primary fallback URL used across the application
export const DEFAULT_FALLBACK_IMAGE = CATEGORY_PLACEHOLDERS['default'];

/**
 * Normalizes any image URL to ensure compatibility with modern browsers,
 * Vite public pathing, and Wikimedia hotlinking requirements.
 * 
 * @param url The input image URL
 * @param targetSize The standard Wikimedia thumbnail size (default: 960 for cards & detail hero)
 * @returns A safe, normalized image URL
 */
export function normalizeImageUrl(
  url?: string | null,
  targetSize: 500 | 960 | 1280 = 960
): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  let clean = url.trim();

  // Strip tracking/query params from image URLs
  if (clean.includes('?')) {
    clean = clean.split('?')[0];
  }

  // 1. Handle Wikimedia Commons URLs
  if (clean.includes('upload.wikimedia.org') || clean.includes('thumb.wikimedia.org')) {
    // If it's already a thumbnail URL
    if (clean.includes('/thumb/')) {
      // Check if size is an invalid/legacy size (e.g. /800px-)
      // Replace with standard compliant size
      return clean.replace(/\/\d+px-/, `/${targetSize}px-`);
    }

    // If it's a raw un-thumbnailed original URL
    // e.g. https://upload.wikimedia.org/wikipedia/commons/4/4b/Hundru_Falls...
    const rawMatch = clean.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([0-9a-f]\/[0-9a-f]{2})\/(.+)$/i);
    if (rawMatch) {
      const hash = rawMatch[1];
      const filename = rawMatch[2];
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash}/${filename}/${targetSize}px-${filename}`;
    }
  }

  // 2. Handle local relative URLs
  if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('data:')) {
    if (!clean.startsWith('/')) {
      clean = '/' + clean;
    }
  }

  return clean;
}

/**
 * Graceful error event handler for <img> elements that prevents infinite loops
 * and smoothly falls back to an appropriate category placeholder or local asset.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  categoryFallback?: string
) {
  const img = event.currentTarget;
  if (!img) return;

  const currentAttempt = parseInt(img.getAttribute('data-error-attempts') || '0', 10);
  const fallback = categoryFallback || CATEGORY_PLACEHOLDERS['default'];

  if (currentAttempt === 0) {
    // First error: switch to category placeholder
    img.setAttribute('data-error-attempts', '1');
    img.src = fallback;
  } else if (currentAttempt === 1 && fallback !== LOCAL_FALLBACK_IMAGE) {
    // Second error: try the local offline fallback
    img.setAttribute('data-error-attempts', '2');
    img.src = LOCAL_FALLBACK_IMAGE;
  } else {
    // Final fail-safe: clean placeholder SVG data URL
    img.setAttribute('data-error-attempts', '3');
    img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20600%20400%22%3E%3Crect%20fill%3D%22%230f172a%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%2394a3b8%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%3EVisitJhar%20Authentic%20Destination%3C%2Ftext%3E%3C%2Fsvg%3E';
  }
}
