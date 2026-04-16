import { defineConfig } from 'prisma/config';

const defaultDatabaseUrl = 'postgresql://postgres:postgres@localhost:5432/taxi';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? defaultDatabaseUrl,
  },
});
