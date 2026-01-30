import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

// Use the pooled connection string for runtime (connection pooling with Supavisor)
// This uses the DATABASE_URL from .env which should have ?pgbouncer=true for connection pooling
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env file or Vercel environment variables.')
}

let adapter
try {
  adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
} catch (error) {
  console.error('Error creating Prisma adapter:', error)
  throw error
}

// Export PrismaClient with the adapter for connection pooling
export const prisma = new PrismaClient({ adapter })
