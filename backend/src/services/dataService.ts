import { PrismaClient, Data as PrismaData } from '@prisma/client';
import * as XLSX from 'xlsx';
import type { Redis } from 'ioredis';

type Data = PrismaData;

/**
 * 从市政业绩.xlsx 文件批量导入数据到 Data 表，并自动建立省市县外键
 * @param prisma PrismaClient 实例
 * @param xlsxPath xlsx 文件路径
 */
export async function importAllDataFromXlsx(
  prisma: PrismaClient,
  xlsxPath: string
) {
  const workbook = XLSX.readFile(xlsxPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  // 假设表头为：项目名称、省、市、县/区
  const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(worksheet);

  const data = [];
  for (const row of rows) {
    const projectName = (row['项目名称'] || row['projectName'] || '').toString().trim();
    const provinceName = (row['省'] || row['province'] || '').toString().trim();
    const cityName = (row['市'] || row['city'] || '').toString().trim();
    const countyName = (row['县'] || row['区'] || row['county'] || row['district'] || '').toString().trim();

    let provinceId: number | undefined;
    let cityId: number | undefined;
    let countyId: number | undefined;

    if (provinceName) {
      const province = await prisma.province.findUnique({ where: { name: provinceName } });
      provinceId = province?.id;
    }
    if (provinceId && cityName) {
      const city = await prisma.city.findUnique({ where: { name_provinceId: { name: cityName, provinceId } } });
      cityId = city?.id;
    }
    if (cityId && countyName) {
      const county = await prisma.county.findUnique({ where: { name_cityId: { name: countyName, cityId } } });
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
    throw new Error('No valid data to import');
  }
  const BATCH_SIZE = 1000;
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    await prisma.data.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }
  console.log('市政业绩数据导入完成');
}

class DataService {
  private prisma: PrismaClient;
  private redisClient: Redis;

  constructor(prisma: PrismaClient, redisClient: Redis) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  // 新增：清理所有分页缓存
  private async clearAllCache(): Promise<void> {
    try {
      const keys = await this.redisClient.keys('data-page-*');
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } catch (e) {
      // 忽略缓存清理失败
    }
  }

  // 分页获取数据，带缓存，支持搜索
  async getData(page: number, limit: number, searchTerm?: string): Promise<Data[]> {
    const cacheKey = `data-page-${page}-limit-${limit}-search-${searchTerm || ''}`;
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const where = searchTerm
      ? { projectName: { contains: searchTerm, mode: 'insensitive' as const } }
      : undefined;
    const data = await this.prisma.data.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      where,
    });
    await this.cacheData(cacheKey, data);
    return data;
  }

  // 从 Redis 获取缓存
  private async getCachedData(key: string): Promise<Data[] | null> {
    try {
      const result = await this.redisClient.get(key);
      return result ? JSON.parse(result) as Data[] : null;
    } catch (e) {
      // Redis 连接失败时直接跳过缓存
      return null;
    }
  }

  // 设置缓存，60秒过期
  private async cacheData(key: string, data: Data[]): Promise<void> {
    try {
      await this.redisClient.setex(key, 60, JSON.stringify(data));
    } catch (e) {
      // Redis 连接失败时忽略缓存写入
    }
  }
}

export default DataService;

// 定义 ParsedData 类型，根据你的表头字段调整
type ParsedData = {
  [key: string]: any;
};

async function parseXlsxData(filePath: string): Promise<ParsedData[]> {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: ParsedData[] = XLSX.utils.sheet_to_json(worksheet);
  return jsonData;
}

// 注意：此文件中的 importAllDataFromXlsx 只有在你在其他脚本（如 scripts/import-region.ts）中主动调用时才会执行。
// 你执行 npx ts-node scripts/import-region.ts 时，只有 scripts/import-region.ts 里的 main() 及其调用的函数会被执行。
// 如果 scripts/import-region.ts 没有 import 并调用本文件的 importAllDataFromXlsx，则不会自动执行这里的导入逻辑。
