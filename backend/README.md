# React Hono Prisma App - 后端

## 项目概述

该项目的后端部分使用 Hono.js 和 TypeScript 开发，旨在将 1 万条数据从 xlsx 文档导入到 PostgreSQL 数据库，并支持数据的查询、搜索和分页。每页数据在 Redis 中缓存 60 秒，以提高性能。

## 技术栈

- **框架**: Hono.js
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **缓存**: Redis
- **文件解析**: xlsx

## 文件结构

```
backend
├── src
│   ├── app.ts                # 应用的入口文件，负责启动服务器
│   ├── routes                # 路由定义
│   │   ├── data.ts           # 数据相关的路由
│   │   └── region.ts         # 区域相关的路由
│   ├── services              # 服务层，包含业务逻辑
│   │   ├── dataService.ts    # 数据服务，处理数据的导入和查询
│   │   └── cacheService.ts   # 缓存服务，管理 Redis 缓存
│   ├── utils
│   │   └── xlsxParser.ts     # 工具函数，用于解析 xlsx 文件
│   └── types
│       └── index.ts          # 类型定义，确保类型安全
├── prisma
│   └── schema.prisma         # Prisma 数据库模式定义
├── package.json              # 项目依赖和脚本
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 后端说明文档
```

## 使用说明

1. **安装依赖**: 在 `backend` 目录下运行 `npm install`。
2. **配置数据库**: 确保 PostgreSQL 数据库已正确配置，并在 `.env` 文件中设置数据库连接字符串。
3. **数据库迁移**: 使用 Prisma 进行数据库迁移，运行 `npx prisma migrate dev`。
4. **启动服务**: 在 `backend` 目录下运行 `npm run dev` 启动开发服务器。

