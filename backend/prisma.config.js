import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// Safe fallback so build-time client generation succeeds even if unpooled database URL is not provided at build
const migrationUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dummy';

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url: migrationUrl,
  },
});
