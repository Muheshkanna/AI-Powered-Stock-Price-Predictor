import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'prisma/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Guard dotenv import: it's a runtime dependency but may not be installed at
// the exact moment prisma generate runs (e.g. during a cold Vercel build before
// npm install finishes). We try to load .env but silently ignore any failure.
try {
  const { default: dotenv } = await import('dotenv');
  dotenv.config({ path: path.join(__dirname, '.env') });
} catch {
  // dotenv not available yet — env vars may already be set by Vercel
}

// For prisma generate the datasource URL is only needed for migration commands.
// Provide a safe dummy so the generate step never crashes when the real URLs
// are absent at build time (Vercel injects them at runtime, not build time).
const migrationUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/dummy';

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url: migrationUrl,
  },
});
