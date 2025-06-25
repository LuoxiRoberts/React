export interface DataItem { 
  // 导出 DataItem 接口，用于定义数据项的结构。
  id: number; 
  // 定义 id 属性，类型为 number，表示数据项的唯一标识符。
  projectName: string; 
  // 定义 projectName 属性，类型为 string，表示项目的名称。
  createdAt: string | Date; 
  // 定义 createdAt 属性，类型为 string 或 Date，表示数据项的创建时间。
  updatedAt: string | Date; 
  // 定义 updatedAt 属性，类型为 string 或 Date，表示数据项的更新时间。
}