import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

/**
 * 从全国行政区域.xlsx 文件导入省、市、县/区到数据库
 * 兼容行政区划代码+单位名称格式，自动识别层级
 * @param prisma PrismaClient 实例
 * @param xlsxPath xlsx 文件路径
 */
export async function importAllDivisionsFromXlsx(prisma: PrismaClient, xlsxPath: string) {
  const workbook = XLSX.readFile(xlsxPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  // 兼容你的表头（注意单位名称前有空格）
  const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(worksheet);

  let currentProvince: { id: number; name: string } | null = null;
  let currentCity: { id: number; name: string } | null = null;

  for (const row of rows) {
    const code = (row['行政区划代码'] || '').toString().trim();
    // 自动查找第一个包含“单位名称”字样的表头
    const nameKey = Object.keys(row).find(k => k.replace(/\s/g, '').includes('单位名称'));
    const name = nameKey ? (row[nameKey] || '').toString().trim() : '';
    if (!code || !name) {
      continue;
    }

    // 省级（6位且后4位为0）
    if (/^\d{6}$/.test(code) && code.endsWith('0000')) {
      currentProvince = await prisma.province.upsert({
        where: { name },
        update: {},
        create: { name }
      });
      currentCity = null;
      
    }
    // 市级（6位且后2位为0，非省级）
    else if (/^\d{6}$/.test(code) && code.endsWith('00') && !code.endsWith('0000')) {
      if (!currentProvince) continue;
      currentCity = await prisma.city.upsert({
        where: { name_provinceId: { name, provinceId: currentProvince.id } },
        update: {},
        create: { name, provinceId: currentProvince.id }
      });
      
    }
    // 县/区级（6位且不以00结尾）
    else if (/^\d{6}$/.test(code) && !code.endsWith('00')) {
      if (!currentProvince || !currentCity) continue;
      await prisma.county.upsert({
        where: { name_cityId: { name, cityId: currentCity.id } },
        update: {},
        create: { name, cityId: currentCity.id }
      });
      
    }
  }

  console.log('全国行政区划导入完成');
}

