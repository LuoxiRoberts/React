
import { PrismaClient } from '@prisma/client'; // 导入 PrismaClient，用于与数据库交互。
import { importAllDivisionsFromXlsx } from '../src/services/regionService'; // 导入自定义服务函数，用于从 XLSX 文件导入行政区划。
import { importAllDataFromXlsx } from '../src/services/dataService'; // Import the function directly
import DataService from '../src/services/dataService'; // 导入 DataService 类，用于处理数据导入。
import * as XLSX from 'xlsx'; // 导入 XLSX 库，用于读取和解析 Excel 文件。
import Redis from 'ioredis';

const prisma = new PrismaClient(); // 创建 PrismaClient 实例，用于数据库操作。
const redisClient = new Redis(); // 创建 Redis 客户端实例
const dataService = new DataService(prisma, redisClient); // 创建 DataService 实例

async function main() {
  const regionXlsxPath = 'd:/Java/project/react-hono-prisma-app/全国行政区域.xlsx'; // 定义行政区划 Excel 文件路径。
  await importAllDivisionsFromXlsx(prisma, regionXlsxPath); // 调用函数导入行政区划数据。

  const dataXlsxPath = 'd:/Java/project/react-hono-prisma-app/市政项目地理位置.xlsx'; // 定义市政项目 Excel 文件路径。
  await importAllDataFromXlsx(prisma, dataXlsxPath); // Call the function directly

  await prisma.$disconnect(); // 断开与数据库的连接。
  await redisClient.quit(); // 断开与 Redis 的连接
}

main().catch(e => {
  console.error(e); // 捕获并输出错误。
  process.exit(1); // 以错误状态退出进程。
});

// 1. 确保 .env 数据库配置正确，且已执行 npx prisma migrate dev
// 2. 确保全国行政区域.xlsx 和市政业绩.xlsx 路径正确，内容无误
// 3. 在 backend 目录下运行：
//    npx ts-node scripts/import-region.ts
//
// 运行后，控制台会输出“市政业绩数据导入完成”，数据即写入数据库
//
// 可用数据库工具（如 DBeaver、pgAdmin）查看 province/city/county/data 表内容
