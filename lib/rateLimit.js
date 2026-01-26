// Simple in-memory rate limiter with sliding window
// For production, consider Redis-based solutions

class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute default
    this.maxRequests = options.maxRequests || 100; // 100 requests per window
    this.requests = new Map(); // Map of IP -> array of timestamps
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [ip, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
      if (validTimestamps.length === 0) {
        this.requests.delete(ip);
      } else {
        this.requests.set(ip, validTimestamps);
      }
    }
  }

  // Check if request is allowed
  checkLimit(identifier) {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    
    // Remove timestamps outside the window
    const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
    
    // Check if limit exceeded
    if (validTimestamps.length >= this.maxRequests) {
      const oldestTimestamp = Math.min(...validTimestamps);
      const resetTime = oldestTimestamp + this.windowMs;
      const retryAfter = Math.ceil((resetTime - now) / 1000); // seconds
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter
      };
    }
    
    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(identifier, validTimestamps);
    
    return {
      allowed: true,
      remaining: this.maxRequests - validTimestamps.length,
      resetTime: now + this.windowMs,
      retryAfter: 0
    };
  }

  // Get current status without incrementing
  getStatus(identifier) {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    const validTimestamps = timestamps.filter(t => now - t < this.windowMs);
    
    return {
      requests: validTimestamps.length,
      remaining: this.maxRequests - validTimestamps.length,
      limit: this.maxRequests,
      windowMs: this.windowMs
    };
  }
}

// Create singleton instance
const limiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100  // 100 requests per minute per IP
});

// Cleanup old entries every 5 minutes
setInterval(() => limiter.cleanup(), 5 * 60 * 1000);

// Helper to get client IP from request
export function getClientIP(request) {
  // Check common headers for real IP (useful behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection info (may not be available in all environments)
  return request.headers.get('x-vercel-forwarded-for') || 'unknown';
}

// Middleware-style function to check rate limit
export function checkRateLimit(request) {
  const ip = getClientIP(request);
  return limiter.checkLimit(ip);
}

// Export the limiter instance for testing/monitoring
export { limiter };
