import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import dataRoutes from './routes/data';
import regionRoutes from './routes/region';
import express from 'express';
import { setupSwagger } from './swagger';

const app = new Hono();

// 如果有缓存中间件需要用可以加上
// import { cacheMiddleware } from './services/cacheService';
// app.use('*', cacheMiddleware);

app.route('/api/data', dataRoutes);
app.route('/api/region', regionRoutes);

// 启动服务
serve({
  fetch: app.fetch,
  port: 3001,
});

console.log('Server running at http://localhost:3001');

const expressApp = express();

// 其他中间件和路由设置

setupSwagger(expressApp);

expressApp.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
  console.log('Swagger docs available at http://localhost:3001/api-docs');
});

export default app;