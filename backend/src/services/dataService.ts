import { PrismaClient, Data as PrismaData } from '@prisma/client'; // 导入 PrismaClient 和 Data 类型，用于与数据库交互。
import * as XLSX from 'xlsx'; // 导入 XLSX 库，用于读取和解析 Excel 文件。
import type { Redis } from 'ioredis'; 
import { CacheService, cacheMiddleware } from './cacheService'; // 导入 CacheService 和缓存中间件。

type Data = PrismaData; // 定义 Data 类型为 PrismaData。

/**
 * 从市政业绩.xlsx 文件批量导入数据到 Data 表，并自动建立省市县外键
 * @param prisma PrismaClient 实例
 * @param xlsxPath xlsx 文件路径
 */
export async function importAllDataFromXlsx(
  prisma: PrismaClient,
  xlsxPath: string
) {
  const workbook = XLSX.readFile(xlsxPath); // 读取 Excel 文件。
  const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称。
  const worksheet = workbook.Sheets[sheetName]; // 获取第一个工作表。
  // 假设表头为：项目名称、省、市、县/区
  const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(worksheet); // 将工作表转换为 JSON 格式的行数组。

  const data = [];
  for (const row of rows) {
    const projectName = (row['项目名称'] || row['projectName'] || '').toString().trim(); // 获取项目名称。
    const provinceName = (row['省'] || row['province'] || '').toString().trim(); // 获取省名称。
    const cityName = (row['市'] || row['city'] || '').toString().trim(); // 获取市名称。
    const countyName = (row['县'] || row['区'] || row['county'] || row['district'] || '').toString().trim(); // 获取县/区名称。

    let provinceId: number | undefined;
    let cityId: number | undefined;
    let countyId: number | undefined;

    if (provinceName) {
      const province = await prisma.province.findUnique({ where: { name: provinceName } }); // 查找省份 ID。
      provinceId = province?.id;
    }
    if (provinceId && cityName) {
      const city = await prisma.city.findUnique({ where: { name_provinceId: { name: cityName, provinceId } } }); // 查找城市 ID。
      cityId = city?.id;
    }
    if (cityId && countyName) {
      const county = await prisma.county.findUnique({ where: { name_cityId: { name: countyName, cityId } } }); // 查找县/区 ID。
      countyId = county?.id;
    }

    if (projectName && provinceId && cityId && countyId) {
      data.push({
        projectName,
        provinceId,
        cityId,
        countyId,
      });
    }
  }

  if (data.length === 0) {
    throw new Error('No valid data to import'); // 如果没有有效数据，抛出错误。
  }
  const BATCH_SIZE = 1000; // 定义批量插入的大小。
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE); // 分批处理数据。
    await prisma.data.createMany({
      data: batch,
      skipDuplicates: true, // 跳过重复数据。
    });
  }
  console.log('市政业绩数据导入完成'); // 输出导入完成信息。
}

class DataService { // 定义 DataService 类，用于数据操作。
  private prisma: PrismaClient;
  private cacheService: CacheService;

  constructor(prisma: PrismaClient, redisClient: Redis) {
    this.prisma = prisma;
    this.cacheService = CacheService.getInstance(); // 使用 CacheService 实例。
  }

  // 分页获取数据，带缓存，支持搜索
  async getData(page: number, limit: number, searchTerm?: string): Promise<Data[]> {
    const cacheKey = `data-page-${page}-limit-${limit}-search-${searchTerm || ''}`; // 定义缓存键。
    const cachedData = await this.cacheService.getCache(cacheKey); // 使用 CacheService 获取缓存。
    if (cachedData) {
      return cachedData; // 如果缓存中有数据，直接返回。
    }
    const where = searchTerm
      ? { projectName: { contains: searchTerm, mode: 'insensitive' as const } } // 如果有搜索词，添加模糊查询条件。
      : undefined;
    const data = await this.prisma.data.findMany({
      skip: (page - 1) * limit, // 跳过前面的数据，用于分页。
      take: limit, // 限制返回的数据条数。
      orderBy: { id: 'asc' }, // 按照 ID 升序排序。
      where,
    });
    await this.cacheService.setCache(cacheKey, data); // 使用 CacheService 设置缓存。
    return data;
  }
}

export default DataService; // 导出 DataService 类。

// 定义 ParsedData 类型，根据你的表头字段调整
type ParsedData = {
  [key: string]: any;
};

async function parseXlsxData(filePath: string): Promise<ParsedData[]> {
  const workbook = XLSX.readFile(filePath); // 读取 Excel 文件。
  const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称。
  const worksheet = workbook.Sheets[sheetName]; // 获取第一个工作表。
  const jsonData: ParsedData[] = XLSX.utils.sheet_to_json(worksheet); // 将工作表转换为 JSON 格式的行数组。
  return jsonData;
}

// 注意：此文件中的 importAllDataFromXlsx 只有在你在其他脚本（如 scripts/import-region.ts）中主动调用时才会执行。
// 你执行 npx ts-node scripts/import-region.ts 时，只有 scripts/import-region.ts 里的 main() 及其调用的函数会被执行。
// 如果 scripts/import-region.ts 没有 import 并调用本文件的 importAllDataFromXlsx，则不会自动执行这里的导入逻辑。