/**
 * URL Validation Utilities
 * Prevents protocol confusion, open redirects, and XSS via malicious URLs
 */

/**
 * Check if URL is a valid HTTP/HTTPS URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid HTTP/HTTPS URL
 */
export const isValidHttpUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};

/**
 * Check if URL is a valid image URL from trusted domains
 * @param {string} url - Image URL to validate
 * @returns {boolean} - True if valid and from trusted domain
 */
export const isValidImageUrl = (url) => {
  if (!isValidHttpUrl(url)) return false;
  
  // Trusted domains for images
  const trustedDomains = [
    'localhost',
    'academeet.com',
    'api.academeet.com',
    'cdn.academeet.com'
  ];
  
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    
    return trustedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Sanitize file path to prevent path traversal
 * @param {string} filepath - File path to sanitize
 * @returns {string|null} - Sanitized path or null if invalid
 */
export const sanitizeFilePath = (filepath) => {
  if (!filepath || typeof filepath !== 'string') return null;
  
  // Remove path traversal sequences
  const sanitized = filepath.replace(/\.\./g, '').replace(/\/\//g, '/');
  
  // Ensure it starts with /uploads/
  if (!sanitized.startsWith('/uploads/')) {
    return `/uploads/${sanitized}`;
  }
  
  return sanitized;
};

/**
 * Build safe download URL for file
 * @param {string} filepath - Relative file path
 * @param {string} apiBaseUrl - API base URL
 * @returns {string} - Safe download URL or '#' if invalid
 */
export const buildSafeDownloadUrl = (filepath, apiBaseUrl) => {
  const safePath = sanitizeFilePath(filepath);
  if (!safePath) return '#';
  
  return `${apiBaseUrl}${safePath}`;
};

/**
 * Validate and sanitize profile/cover image URL
 * @param {string} imageUrl - Image URL to validate
 * @param {string} fallbackUrl - Fallback URL if validation fails
 * @returns {string} - Safe image URL
 */
export const getSafeImageUrl = (imageUrl, fallbackUrl = '/default-avatar.png') => {
  if (!imageUrl) return fallbackUrl;
  
  // If it's a relative path (starts with /), it's from our server - safe
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // If it's an absolute URL, validate it
  if (isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Invalid URL, return fallback
  return fallbackUrl;
};
