import { Hono } from 'hono'; // 导入 Hono 框架，用于创建 Web 服务器和路由。
import { PrismaClient } from '@prisma/client'; // 导入 PrismaClient，用于与数据库交互。

const app = new Hono(); // 创建 Hono 应用实例。
const prisma = new PrismaClient(); // 创建 PrismaClient 实例，用于数据库操作。

app.get('/provinces', async (c) => { // 定义处理 GET 请求 '/provinces' 的路由处理器。
  try {
    const provinces = await prisma.province.findMany({ // 查询所有省份。
      select: { id: true, name: true }, // 选择返回的字段：id 和 name。
      orderBy: { id: 'asc' }, // 按照 id 升序排序。
    });
    return c.json(provinces); // 返回省份列表的 JSON 响应。
  } catch (e) {
    return c.json({ error: '数据库查询失败' }, 500); // 如果查询失败，返回错误信息和 500 状态码。
  }
});

app.get('/cities', async (c) => { // 定义处理 GET 请求 '/cities' 的路由处理器。
  try {
    const provinceId = Number(c.req.query('provinceId')); // 获取查询参数 'provinceId' 并转换为数字。
    if (!provinceId || isNaN(provinceId)) return c.json([]); // 如果省ID无效，返回空数组。
    const cities = await prisma.city.findMany({ // 查询指定省份的所有城市。
      where: { provinceId }, // 根据省ID过滤城市。
      select: { id: true, name: true }, // 选择返回的字段：id 和 name。
      orderBy: { id: 'asc' }, // 按照 id 升序排序。
    });
    return c.json(cities); // 返回城市列表的 JSON 响应。
  } catch (e) {
    return c.json({ error: '数据库查询失败' }, 500); // 如果查询失败，返回错误信息和 500 状态码。
  }
});

app.get('/counties', async (c) => { // 定义处理 GET 请求 '/counties' 的路由处理器。
  try {
    const cityId = Number(c.req.query('cityId')); // 获取查询参数 'cityId' 并转换为数字。
    if (!cityId || isNaN(cityId)) return c.json([]); // 如果市ID无效，返回空数组。
    const counties = await prisma.county.findMany({ // 查询指定城市的所有县/区。
      where: { cityId }, // 根据市ID过滤县/区。
      select: { id: true, name: true }, // 选择返回的字段：id 和 name。
      orderBy: { id: 'asc' }, // 按照 id 升序排序。
    });
    return c.json(counties); // 返回县/区列表的 JSON 响应。
  } catch (e) {
    return c.json({ error: '数据库查询失败' }, 500); // 如果查询失败，返回错误信息和 500 状态码。
  }
});

export default app; // 导出 Hono 应用实例，以便在其他地方使用。
// 该文件定义了处理省、市、县查询的路由
// - GET /province: 获取所有省份
// - GET /city: 根据省ID获取所有城市
// - GET /county: 根据市ID获取所有县/区