# React Hono Prisma 应用 - 前端

这是 React Hono Prisma 应用的前端部分，一个使用 React.js 和 TypeScript 开发的 Web 应用。前端提供了用于数据导入、查询、搜索和分页的用户界面。

## 功能

- **数据展示**: 查看从 XLSX 文件导入的数据。
- **搜索功能**: 使用搜索栏查找特定记录。
- **分页**: 使用分页控件浏览数据。
- **响应式设计**: 应用设计为响应式，用户体验友好。

## 项目结构

```
frontend
├── src
│   ├── App.tsx
│   │   // 应用的根组件，包含页面的主要结构和样式。
│   ├── index.tsx
│   │   // 应用的入口文件，负责渲染根组件到 DOM。
│   ├── components
│   │   ├── DataTable.tsx
│   │   │   // 数据表组件，用于显示数据列表。
│   │   ├── SearchBar.tsx
│   │   │   // 搜索栏组件，允许用户输入搜索关键词。
│   │   └── Pagination.tsx
│   │       // 分页组件，提供分页导航功能。
│   ├── pages
│   │   └── Home.tsx
│   │       // 主页组件，包含数据展示和交互功能。
│   ├── styles
│   │   └── App.module.css
│   │       // 应用的全局样式文件，使用 CSS 模块。
│   └── types
│       └── index.ts
│           // 类型定义文件，定义应用中使用的 TypeScript 接口。
├── public
│   └── index.html
│       // HTML 模板文件，应用的基本结构。
├── package.json
│   // 项目的依赖和脚本配置文件。
├── tsconfig.json
│   // TypeScript 配置文件，定义编译选项。
└── README.md
    // 项目的说明文档。
```

## 使用说明
1. **安装依赖**: 在 `frontend` 目录下运行 `npm install`。
2. **启动开发服务器**: 在 `frontend` 目录下运行 `npm start`，默认在 `http://localhost:3000` 访问。
3. **构建应用**: 运行 `npm run build` 生成生产环境的静态文件。 

