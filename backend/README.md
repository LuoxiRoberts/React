# React Hono Prisma App

## 项目概述

该项目是一个使用 React.js 和 TypeScript 开发的 Web 应用程序，旨在将 1 万条数据从 xlsx 文档导入到 PostgreSQL 数据库，并支持在页面上查询、搜索和翻页。每页数据在 Redis 中缓存 60 秒，后端使用 Hono.js 和 TypeScript，前端使用 React.js。

## 技术栈

- **前端**: React.js, TypeScript
- **后端**: Hono.js, TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **缓存**: Redis
- **文件解析**: xlsx

## 文件结构

```
react-hono-prisma-app
├── backend
│   ├── src
│   │   ├── app.ts
│   │   ├── routes
│   │   │   ├── data.ts
│   │   │   └── index.ts
│   │   ├── services
│   │   │   ├── dataService.ts
│   │   │   └── cacheService.ts
│   │   ├── utils
│   │   │   └── xlsxParser.ts
│   │   └── types
│   │       └── index.ts
│   ├── prisma
│   │   └── schema.prisma
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── components
│   │   │   ├── DataTable.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── Pagination.tsx
│   │   ├── pages
│   │   │   └── Home.tsx
│   │   ├── styles
│   │   │   └── App.module.css
│   │   └── types
│   │       └── index.ts
│   ├── public
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── README.md
```

## 使用说明

1. **安装依赖**: 在 `backend` 和 `frontend` 目录下分别运行 `npm install`。
2. **数据库迁移**: 使用 Prisma 进行数据库迁移，确保 PostgreSQL 数据库已正确配置。
3. **启动服务**: 在 `backend` 目录下运行 `npm run start` 启动后端服务，在 `frontend` 目录下运行 `npm run start` 启动前端服务。
4. **访问应用**: 打开浏览器，访问指定的域名以查看应用。

## 部署

该项目可以部署到云服务提供商，确保配置域名和 SSL 证书以支持 HTTPS。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求以帮助改进该项目。