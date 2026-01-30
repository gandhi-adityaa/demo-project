import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// For Prisma Client generation, we don't need a real connection
// The URL is only used for migrations/introspection
// Use process.env directly to avoid throwing errors if vars don't exist
const getDatabaseUrl = () => {
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL
  }
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  // Fallback for build time when env vars might not be set
  // This won't be used for actual queries, just for schema validation
  return 'postgresql://user:password@localhost:5432/dbname'
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: getDatabaseUrl(),
  },
})
