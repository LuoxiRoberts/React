import { PrismaClient } from '@prisma/client';
import { importAllDivisionsFromXlsx } from '../src/services/regionService';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

/**
 * 导入市政业绩数据到 data 表，允许部分字段为空（只要有项目名称就导入）
 */
async function importAllDataFromXlsxNoDuplicate(prisma: PrismaClient, xlsxPath: string) {
  const workbook = XLSX.readFile(xlsxPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(worksheet);

  const data: { projectName: string; provinceId?: number; cityId?: number; countyId?: number }[] = [];
  for (const row of rows) {
    // 自动查找表头，兼容空格和不同写法
    const projectName =
      (row['项目名称'] || row['projectName'] || row['project'] || '').toString().trim();
    const provinceName =
      (row['省'] || row['province'] || '').toString().trim();
    const cityName =
      (row['市'] || row['city'] || '').toString().trim();
    // 兼容 district/县/区
    const countyName =
      (row['县'] || row['区'] || row['county'] || row['district'] || '').toString().trim();

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

    if (projectName) {
      // 检查是否已存在完全相同的数据
      const exists = await prisma.data.findFirst({
        where: {
          projectName,
          provinceId: provinceId ?? undefined,
          cityId: cityId ?? undefined,
          countyId: countyId ?? undefined,
        },
      });
      if (!exists) {
        data.push({
          projectName,
          provinceId,
          cityId,
          countyId,
        });
      }
    }
  }

  if (data.length === 0) {
    console.log('无新数据需要导入');
    return;
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

async function main() {
  // 导入全国行政区划
  const regionXlsxPath = 'd:/Java/project/react-hono-prisma-app/全国行政区域.xlsx';
  await importAllDivisionsFromXlsx(prisma, regionXlsxPath);

  // 导入市政业绩，允许部分字段为空
  const dataXlsxPath = 'd:/Java/project/react-hono-prisma-app/市政项目地理位置.xlsx';
  await importAllDataFromXlsxNoDuplicate(prisma, dataXlsxPath);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

// 1. 确保 .env 数据库配置正确，且已执行 npx prisma migrate dev
// 2. 确保全国行政区域.xlsx 和市政业绩.xlsx 路径正确，内容无误
// 3. 在 backend 目录下运行：
//    npx ts-node scripts/import-region.ts
//
// 运行后，控制台会输出“市政业绩数据导入完成”，数据即写入数据库
//
// 可用数据库工具（如 DBeaver、pgAdmin）查看 province/city/county/data 表内容
