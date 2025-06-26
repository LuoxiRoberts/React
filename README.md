# React Hono Prisma App

## 项目简介

本项目是一个基于 **React.js + TypeScript** 前端、**Hono.js + TypeScript** 后端、**PostgreSQL + Prisma** 数据库的全栈应用。支持从 XLSX 文件导入 1 万条数据到数据库，Web 页面支持数据查询、搜索、分页，分页数据通过 Redis 缓存 60 秒，界面美观，类型安全。适合现代数据管理与展示场景。

---

## 技术栈

- **前端**：React.js + TypeScript + CSS Modules
- **后端**：Hono.js + TypeScript
- **数据库**：PostgreSQL + Prisma
- **缓存**：Redis
- **部署**：支持 Vercel、Heroku、DigitalOcean 等，推荐绑定域名并配置 SSL

---

## 主要特性

- 支持 XLSX 文件批量导入数据到 PostgreSQL
- 数据查询、搜索、分页展示
- 分页数据 Redis 缓存 60 秒，提升性能
- 前后端全类型安全，拒绝 any
- 响应式美观界面，体验优秀

---

## 项目结构

```
react-hono-prisma-app
├── backend
│   ├── src
│   │   ├── app.ts                # 后端入口
│   │   ├── routes                # 路由
│   │   ├── services              # 数据与缓存服务
│   │   ├── utils                 # 工具函数
│   │   └── types                 # 类型定义
│   ├── prisma
│   │   └── schema.prisma         # Prisma 数据库模型
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   ├── src
│   │   ├── App.tsx               # 前端入口
│   │   ├── components            # 组件
│   │   ├── pages                 # 页面
│   │   ├── styles                # 样式
│   │   └── types                 # 类型定义
│   ├── public
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 快速开始

1. 克隆仓库
   ```bash
   git clone <repository-url>
   ```

2. 安装依赖
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. 配置 PostgreSQL 数据库和 Redis，并修改 `.env` 配置

4. 初始化数据库
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. 启动后端服务
   ```bash
   npm run dev
   ```

6. 启动前端应用
   ```bash
   cd ../frontend
   npm start
   ```

---

## 数据库备份

项目根目录包含一个 `database_backup.sql` 文件，其中包含 PostgreSQL 数据库的表结构和数据。

### 恢复数据库

要恢复数据库，请使用以下命令：

```bash
# 恢复数据库
psql -U myuser -d mydatabase -f "d:\Java\project\react-hono-prisma-app\database_backup.sql"

### 注意事项

- 确保您有权限访问数据库，并且 `pg_dump` 和 `psql` 工具已安装在您的系统中。
- 根据您的实际数据库名称、用户名和路径调整命令。
- 如果数据库包含敏感数据，请谨慎处理导出的 SQL 文件。

通过这些步骤，您可以将 PostgreSQL 数据库的表结构和内容保存到项目的根目录，并在需要时轻松恢复数据库。