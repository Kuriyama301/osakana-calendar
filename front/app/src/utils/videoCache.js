const CACHE_CONFIG = {
  expirationTime: process.env.NODE_ENV === 'development'
    ? 1000 * 60 * 5    // 開発環境: 5分
    : 1000 * 60 * 60   // 本番環境: 1時間
};

class VideoCache {
  constructor() {
    this.cache = new Map();
    this.expirationTime = CACHE_CONFIG.expirationTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('キャッシュ設定:', {
        環境: process.env.NODE_ENV,
        有効期限: `${this.expirationTime / 1000 / 60}分`
      });
    }
  }

  set(key, value) {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.expirationTime;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const videoCache = new VideoCache();