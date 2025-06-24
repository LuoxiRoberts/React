import * as XLSX from 'xlsx';

export interface ParsedData {
  [key: string]: string | number | boolean | null;
}

export const parseXlsxFile = (filePath: string): ParsedData[] => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const jsonData: ParsedData[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  const headers = jsonData[0] as unknown as string[];
  const data: ParsedData[] = jsonData.slice(1).map(row => {
    const rowData: ParsedData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index] || null;
    });
    return rowData;
  });

  return data;
};