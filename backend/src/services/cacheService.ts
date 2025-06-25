import { Redis } from 'ioredis'; // 导入 ioredis 库中的 Redis 类，用于连接和操作 Redis 数据库。
import { MiddlewareHandler } from 'hono'; 

const redis = new Redis(); // 创建 Redis 实例，连接到默认的 Redis 服务器。

class CacheService { // 定义 CacheService 类，用于管理缓存操作。
    private static instance: CacheService; // 静态属性，用于存储 CacheService 的单例实例。

    private constructor() {} // 私有构造函数，防止直接实例化。

    public static getInstance(): CacheService { // 获取 CacheService 单例实例的方法。
        if (!CacheService.instance) { // 如果实例不存在，则创建一个新的实例。
            CacheService.instance = new CacheService();
        }
        return CacheService.instance; // 返回单例实例。
    }

    public async setCache(key: string, value: any): Promise<void> { // 设置缓存的方法。
        await redis.set(key, JSON.stringify(value), 'EX', 60); // 将值序列化为 JSON 字符串，并设置 60 秒的过期时间。
    }

    public async getCache(key: string): Promise<any | null> { // 获取缓存的方法。
        const data = await redis.get(key); // 从 Redis 获取缓存数据。
        return data ? JSON.parse(data) : null; // 如果数据存在，则解析为对象，否则返回 null。
    }

    public async clearCache(key: string): Promise<void> { // 清除缓存的方法。
        await redis.del(key); // 从 Redis 中删除指定键的缓存。
    }
}

// 缓存中间件，类型为 MiddlewareHandler
const cacheMiddleware: MiddlewareHandler = async (c, next) => {
  const cacheKey = c.req.url; // 使用请求的 URL 作为缓存键
  const cachedResponse = await redis.get(cacheKey); // 尝试从缓存中获取数据

  if (cachedResponse) {
    // 如果缓存中有数据，直接返回缓存数据
    return c.json(JSON.parse(cachedResponse)); // 将缓存数据解析为 JSON 并返回
  }

  // 如果缓存中没有数据，继续处理请求
  await next(); // 调用下一个中间件或路由处理器

  // 在请求处理完成后，将响应数据存入缓存
  const responseData = c.res.body; // 假设响应数据在 c.res.body 中
  if (responseData) {
    await redis.set(cacheKey, JSON.stringify(responseData), 'EX', 60); // 缓存响应数据，60秒过期
  }
};

export { CacheService, cacheMiddleware }; // 导出 CacheService 类和 cacheMiddleware 中间件，以便在其他模块中使用。