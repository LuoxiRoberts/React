import { Hono } from 'hono'; 
import dataRoutes from './data'; // 导入 data 路由模块，用于处理与数据相关的请求。

const app = new Hono(); 

app.route('/data', dataRoutes); // 将 '/data' 路径的请求委托给 dataRoutes 处理。

export default app; 