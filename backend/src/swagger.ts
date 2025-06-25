import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'React Hono Prisma App API',
      version: '1.0.0',
      description: 'API documentation for the React Hono Prisma App',
    },
  },
  apis: ['./src/routes/*.ts'], // 指定包含 API 注释的文件
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};