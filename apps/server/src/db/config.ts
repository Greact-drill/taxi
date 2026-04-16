const DEFAULT_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/taxi';
const DEFAULT_PORT = 3001;

export function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL?.trim();
  return value && value.length > 0 ? value : DEFAULT_DATABASE_URL;
}

export function getServerPort(): number {
  const raw = process.env.PORT?.trim();
  if (!raw) return DEFAULT_PORT;

  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`PORT must be a positive integer, got: ${raw}`);
  }

  return port;
}
