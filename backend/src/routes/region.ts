import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prisma = new PrismaClient();

app.get('/provinces', async (c) => {
  try {
    const provinces = await prisma.province.findMany({
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
    return c.json(provinces);
  } catch (e) {
    return c.json({ error: '数据库查询失败' }, 500);
  }
});

app.get('/cities', async (c) => {
  try {
    const provinceId = Number(c.req.query('provinceId'));
    if (!provinceId || isNaN(provinceId)) return c.json([]);
    const cities = await prisma.city.findMany({
      where: { provinceId },
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
    return c.json(cities);
  } catch (e) {
    return c.json({ error: '数据库查询失败' }, 500);
  }
});

app.get('/counties', async (c) => {
  try {
    const cityId = Number(c.req.query('cityId'));
    if (!cityId || isNaN(cityId)) return c.json([]);
    const counties = await prisma.county.findMany({
      where: { cityId },
      select: { id: true, name: true },
      orderBy: { id: 'asc' },
    });
    return c.json(counties);
  } catch (e) {
    return c.json({ error: '数据库查询失败' }, 500);
  }
});

export default app;
// 该文件定义了处理省、市、县查询的路由
// - GET /province: 获取所有省份
// - GET /city: 根据省ID获取所有城市
// - GET /county: 根据市ID获取所有县/区
