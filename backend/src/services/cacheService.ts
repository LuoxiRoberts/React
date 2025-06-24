import { Redis } from 'ioredis';
import { MiddlewareHandler } from 'hono';

const redis = new Redis();

class CacheService {
    private static instance: CacheService;

    private constructor() {}

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    public async setCache(key: string, value: any): Promise<void> {
        await redis.set(key, JSON.stringify(value), 'EX', 60);
    }

    public async getCache(key: string): Promise<any | null> {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    public async clearCache(key: string): Promise<void> {
        await redis.del(key);
    }
}

// 缓存中间件，类型为 MiddlewareHandler
export const cacheMiddleware: MiddlewareHandler = async (c, next) => {
  // 这里可以根据实际需求实现缓存逻辑
  // 示例：直接进入下一个中间件
  await next();
};

export default { CacheService };