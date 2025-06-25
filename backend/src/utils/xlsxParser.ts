import * as XLSX from 'xlsx'; // 导入 XLSX 库，用于读取和解析 Excel 文件。

export interface ParsedData { // 定义 ParsedData 接口，表示解析后的数据结构。
  [key: string]: string | number | boolean | null; // 每个键对应的值可以是字符串、数字、布尔值或 null。
}

export const parseXlsxFile = (filePath: string): ParsedData[] => { // 定义 parseXlsxFile 函数，用于解析 Excel 文件。
  const workbook = XLSX.readFile(filePath); // 读取 Excel 文件，返回工作簿对象。
  const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称。
  const worksheet = workbook.Sheets[sheetName]; // 获取第一个工作表。

  const jsonData: ParsedData[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); 
  // 将工作表转换为 JSON 格式的数组，header: 1 表示第一行为表头。

  const headers = jsonData[0] as unknown as string[]; // 将第一行数据作为表头。
  const data: ParsedData[] = jsonData.slice(1).map(row => { // 从第二行开始遍历数据行。
    const rowData: ParsedData = {}; // 初始化一个空对象用于存储行数据。
    headers.forEach((header, index) => { // 遍历表头，将每个单元格数据与表头对应。
      rowData[header] = row[index] || null; // 如果单元格为空，则设置为 null。
    });
    return rowData; // 返回解析后的行数据。
  });

  return data; // 返回解析后的数据数组。
};