import { PrismaClient } from '@prisma/client'; // 导入 PrismaClient，用于与数据库交互。
import * as XLSX from 'xlsx'; // 导入 XLSX 库，用于读取和解析 Excel 文件。

/**
 * 从全国行政区域.xlsx 文件导入省、市、县/区到数据库
 * 兼容行政区划代码+单位名称格式，自动识别层级
 * @param prisma PrismaClient 实例
 * @param xlsxPath xlsx 文件路径
 */
export async function importAllDivisionsFromXlsx(prisma: PrismaClient, xlsxPath: string) {
  const workbook = XLSX.readFile(xlsxPath); // 读取 Excel 文件。
  const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称。
  const worksheet = workbook.Sheets[sheetName]; // 获取第一个工作表。
  // 兼容你的表头（注意单位名称前有空格）
  const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(worksheet); // 将工作表转换为 JSON 格式的行数组。

  let currentProvince: { id: number; name: string } | null = null; // 当前省份的缓存变量。
  let currentCity: { id: number; name: string } | null = null; // 当前城市的缓存变量。

  for (const row of rows) { // 遍历每一行数据。
    const code = (row['行政区划代码'] || '').toString().trim(); // 获取行政区划代码。
    // 自动查找第一个包含“单位名称”字样的表头
    const nameKey = Object.keys(row).find(k => k.replace(/\s/g, '').includes('单位名称')); // 查找单位名称的键。
    const name = nameKey ? (row[nameKey] || '').toString().trim() : ''; // 获取单位名称。
    if (!code || !name) {
      continue; // 如果代码或名称为空，跳过该行。
    }

    // 省级（6位且后4位为0）
    if (/^\d{6}$/.test(code) && code.endsWith('0000')) {
      currentProvince = await prisma.province.upsert({ // 使用 upsert 方法插入或更新省份。
        where: { name }, // 根据名称查找。
        update: {}, // 如果存在则不更新。
        create: { name } // 如果不存在则创建。
      });
      currentCity = null; // 重置当前城市。
      
    }
    // 市级（6位且后2位为0，非省级）
    else if (/^\d{6}$/.test(code) && code.endsWith('00') && !code.endsWith('0000')) {
      if (!currentProvince) continue; // 如果没有当前省份，跳过。
      currentCity = await prisma.city.upsert({ // 使用 upsert 方法插入或更新城市。
        where: { name_provinceId: { name, provinceId: currentProvince.id } }, // 根据名称和省份 ID 查找。
        update: {}, // 如果存在则不更新。
        create: { name, provinceId: currentProvince.id } // 如果不存在则创建。
      });
      
    }
    // 县/区级（6位且不以00结尾）
    else if (/^\d{6}$/.test(code) && !code.endsWith('00')) {
      if (!currentProvince || !currentCity) continue; // 如果没有当前省份或城市，跳过。
      await prisma.county.upsert({ // 使用 upsert 方法插入或更新县/区。
        where: { name_cityId: { name, cityId: currentCity.id } }, // 根据名称和城市 ID 查找。
        update: {}, // 如果存在则不更新。
        create: { name, cityId: currentCity.id } // 如果不存在则创建。
      });
      
    }
  }

  console.log('全国行政区划导入完成'); // 输出导入完成信息。
}