/**
 * Simple in-memory cache with TTL (Time To Live)
 * Stores contest data temporarily to reduce API calls
 */

const cache = new Map();

/**
 * Get cached data by key
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/missing
 */
export function getCache(key) {
  const item = cache.get(key);
  
  if (!item) {
    return null;
  }
  
  // Check if cache has expired
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}

/**
 * Set cache data with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 */
export function setCache(key, data, ttl = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl
  });
}

/**
 * Clear all cache or specific key
 * @param {string} [key] - Optional specific key to clear
 */
export function clearCache(key) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}
