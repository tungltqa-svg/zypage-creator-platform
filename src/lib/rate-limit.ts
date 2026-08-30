interface RateLimitStore {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitStore>();

// Tự động dọn dẹp bộ nhớ mỗi 5 phút
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    ipCache.forEach((data, ip) => {
      if (now > data.resetTime) {
        ipCache.delete(ip);
      }
    });
  }, 5 * 60 * 1000);
}

/**
 * Cơ chế Giới hạn Tần suất (Rate Limiting) chống spam và tấn công DDoS
 * @param ip IP của người gửi request
 * @param limit Số request tối đa trong khoảng thời gian (VD: 30 requests)
 * @param windowMs Khoảng thời gian tính bằng milliseconds (VD: 10000ms = 10s)
 */
export function rateLimiter(ip: string, limit: number = 30, windowMs: number = 10000): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = ipCache.get(ip);

  if (!record || now > record.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}
