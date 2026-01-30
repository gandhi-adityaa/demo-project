export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Dynamically import to ensure Prisma Client is available
    const { prisma } = await import('../../src/db/client.js')
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set')
      return res.status(500).json({ 
        error: 'Database configuration error',
        details: 'DATABASE_URL environment variable is not set'
      })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password for security
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    console.error('Error stack:', error.stack)
    console.error('DATABASE_URL set:', !!process.env.DATABASE_URL)
    
    return res.status(500).json({ 
      error: 'Failed to fetch users', 
      details: error.message,
      type: error.constructor.name
    })
  }
}
