import { Hono } from 'hono'; // 导入 Hono 框架，用于创建 Web 服务器和路由。
import { PrismaClient } from '@prisma/client'; // 导入 PrismaClient，用于与数据库交互。

const app = new Hono(); // 创建 Hono 应用实例。
const prisma = new PrismaClient(); // 创建 PrismaClient 实例，用于数据库操作。

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Retrieve a list of data
 *     responses:
 *       200:
 *         description: A list of data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/', async (c) => { // 定义 GET 请求的路由处理器。
  const page = Number(c.req.query('page') ?? 1); // 获取查询参数 'page'，默认为 1。
  const limit = Number(c.req.query('limit') ?? 10); // 获取查询参数 'limit'，默认为 10。
  const search = c.req.query('search') ?? ''; // 获取查询参数 'search'，默认为空字符串。
  const provinceId = c.req.query('provinceId'); // 获取查询参数 'provinceId'。
  const cityId = c.req.query('cityId'); // 获取查询参数 'cityId'。
  const countyId = c.req.query('countyId'); // 获取查询参数 'countyId'。
  try {
    const where: any = {}; // 初始化查询条件对象。
    if (search) {
      where.projectName = { contains: search, mode: 'insensitive' as const }; // 如果有搜索词，添加模糊查询条件。
    }
    if (provinceId && !isNaN(Number(provinceId))) where.provinceId = Number(provinceId); // 如果有 provinceId，添加查询条件。
    if (cityId && !isNaN(Number(cityId))) where.cityId = Number(cityId); // 如果有 cityId，添加查询条件。
    if (countyId && !isNaN(Number(countyId))) where.countyId = Number(countyId); // 如果有 countyId，添加查询条件。

    const data = await prisma.data.findMany({ // 查询符合条件的数据。
      skip: (page - 1) * limit, // 跳过前面的数据，用于分页。
      take: limit, // 限制返回的数据条数。
      orderBy: { id: 'asc' }, // 按照 ID 升序排序。
      where: Object.keys(where).length ? where : undefined, // 如果有查询条件则使用，否则为 undefined。
      include: { // 包含关联的省、市、县信息。
        province: { select: { name: true } },
        city: { select: { name: true } },
        county: { select: { name: true } },
      },
    });
    const total = await prisma.data.count({ // 计算符合条件的数据总数。
      where: Object.keys(where).length ? where : undefined,
    });

    return c.json({ data, total }); // 返回数据和总数的 JSON 响应。
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[data.ts] 数据查询异常:', error); // 输出错误信息。
    return c.text('Error fetching data', 500); // 返回错误信息和 500 状态码。
  }
});

export default app; // 导出 Hono 应用实例。