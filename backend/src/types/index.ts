// 该文件定义了项目中使用的类型和接口，以确保类型安全并避免使用 'any'。

export interface DataRecord { // 定义 DataRecord 接口，表示数据记录的结构。
    id: number; // 数据记录的唯一标识符。
    name: string; // 数据记录的名称字段。
    age: number; // 数据记录的年龄字段。
    email: string; // 数据记录的电子邮件字段。
    // Add other fields as necessary based on the xlsx structure
    // 根据 xlsx 结构添加其他必要的字段。
}

export interface QueryParams { // 定义 QueryParams 接口，表示查询参数的结构。
    page: number; // 查询的页码。
    limit: number; // 每页的记录数限制。
    search?: string; // 可选的搜索关键词。
}

export interface ImportResponse { // 定义 ImportResponse 接口，表示导入操作的响应结构。
    success: boolean; // 导入操作是否成功。
    message: string; // 导入操作的消息或描述。
    importedCount?: number; // 可选的导入记录数。
}

export interface CacheData { // 定义 CacheData 接口，表示缓存数据的结构。
    key: string; // 缓存数据的键。
    value: DataRecord[]; // 缓存的数据值，类型为 DataRecord 数组。
    expiration: number; // in seconds
    // 缓存数据的过期时间，以秒为单位。
}