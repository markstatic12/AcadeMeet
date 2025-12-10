
export const isValidHttpUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};

export const isValidImageUrl = (url) => {
  if (!isValidHttpUrl(url)) return false;
  
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

export const sanitizeFilePath = (filepath) => {
  if (!filepath || typeof filepath !== 'string') return null;
  
  const sanitized = filepath.replace(/\.\./g, '').replace(/\/\//g, '/');
  
  if (!sanitized.startsWith('/uploads/')) {
    return `/uploads/${sanitized}`;
  }
  
  return sanitized;
};

export const buildSafeDownloadUrl = (filepath, apiBaseUrl) => {
  const safePath = sanitizeFilePath(filepath);
  if (!safePath) return '#';
  
  return `${apiBaseUrl}${safePath}`;
};

export const getSafeImageUrl = (imageUrl, fallbackUrl = '/default-avatar.png') => {
  if (!imageUrl) return fallbackUrl;
  
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  if (isValidImageUrl(imageUrl)) {
    return imageUrl;
  }
  
  return fallbackUrl;
};
