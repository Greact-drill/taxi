import { PrismaPg } from '@prisma/adapter-pg';
import { getDatabaseUrl } from './config.js';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';

process.env.DATABASE_URL ??= getDatabaseUrl();
const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
});

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export function isPrismaRecordNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}
