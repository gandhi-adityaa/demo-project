// Load environment variables at plugin initialization
import 'dotenv/config'

export function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        // Only handle GET requests to /api/users
        if (req.method === 'GET' && req.url === '/users') {
          try {
            // Dynamically import Prisma client to avoid build-time issues
            const { prisma } = await import('./src/db/client.ts')
            
            const users = await prisma.user.findMany({
              select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            })

            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.statusCode = 200
            res.end(JSON.stringify(users))
          } catch (error) {
            console.error('Error fetching users:', error)
            console.error('Error stack:', error.stack)
            console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
            
            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.statusCode = 500
            res.end(JSON.stringify({ 
              error: 'Failed to fetch users', 
              details: error.message,
              stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }))
          }
        } else {
          next()
        }
      })
    },
  }
}
