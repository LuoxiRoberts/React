import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const app = new Hono();
const prisma = new PrismaClient();

app.get('/', async (c) => {
  const page = Number(c.req.query('page') ?? 1);
  const limit = Number(c.req.query('limit') ?? 10);
  const search = c.req.query('search') ?? '';
  const provinceId = c.req.query('provinceId');
  const cityId = c.req.query('cityId');
  const countyId = c.req.query('countyId');
  try {
    // 明确用 console.log 输出到标准输出
    // eslint-disable-next-line no-console
    console.log('[data.ts] 查询参数:', { page, limit, search, provinceId, cityId, countyId });

    // 检查数据库连接和表内容
    const test = await prisma.data.findFirst();
    if (!test) {
      console.log('[data.ts] data表无数据，请确认已导入数据');
    }

    const where: any = {};
    if (search) {
      where.projectName = { contains: search, mode: 'insensitive' as const };
    }
    if (provinceId && !isNaN(Number(provinceId))) where.provinceId = Number(provinceId);
    if (cityId && !isNaN(Number(cityId))) where.cityId = Number(cityId);
    if (countyId && !isNaN(Number(countyId))) where.countyId = Number(countyId);

    // eslint-disable-next-line no-console
    console.log('[data.ts] 最终where:', JSON.stringify(where));

    const data = await prisma.data.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      where: Object.keys(where).length ? where : undefined,
      include: {
        province: { select: { name: true } },
        city: { select: { name: true } },
        county: { select: { name: true } },
      },
    });
    const total = await prisma.data.count({
      where: Object.keys(where).length ? where : undefined,
    });

    // eslint-disable-next-line no-console
    console.log('[data.ts] 返回数据条数:', data.length, '总数:', total);

    return c.json({ data, total });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[data.ts] 数据查询异常:', error);
    return c.text('Error fetching data', 500);
  }
});

export default app;