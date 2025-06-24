# React Hono Prisma App

This project is a web application developed using React.js, TypeScript, Hono.js, and Prisma. It allows users to import data from an XLSX document into a PostgreSQL database, with features for querying, searching, and pagination. The application also utilizes Redis for caching query results for 60 seconds.

## Project Structure

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

## Features

- **Data Import**: Import up to 10,000 records from an XLSX file into a PostgreSQL database.
- **Query and Search**: Users can query and search for specific records.
- **Pagination**: Results are paginated for better usability.
- **Caching**: Query results are cached in Redis for 60 seconds to improve performance.
- **Type Safety**: The application is developed using TypeScript, ensuring type safety throughout the codebase.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd react-hono-prisma-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

### Deployment

To deploy the application online, ensure you have a domain and SSL certificate set up. You can use services like Vercel, Heroku, or DigitalOcean for hosting.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.