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
    // Get the id from the URL path
    // In Vercel, dynamic routes are available via req.query
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' })
    }

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

    // Fetch the SQL concept with all related data
    const rawConcept = await prisma.sqlConcept.findUnique({
      where: { id: id },
      include: {
        sections: true,  // Fetches both CONCEPT and ANALYSIS types
        examples: true,  // Mapped to codeTab
        demo: true,      // Mapped to demoTab
        questions: true, // Mapped to questionsTab
      },
    })

    if (!rawConcept) {
      return res.status(404).json({ error: 'Concept not found' })
    }

    // Transform Flat Prisma Data to Nested API Response
    const responseData = {
      id: rawConcept.id,
      title: rawConcept.title,
      icon: rawConcept.icon,
      
      // Filter 'sections' list into two separate tabs
      conceptsTab: rawConcept.sections
        .filter(s => s.type === 'CONCEPT')
        .map(s => ({
          title: s.title,
          content: s.content,
          icon: s.icon
        })),

      analysisTab: rawConcept.sections
        .filter(s => s.type === 'ANALYSIS')
        .map(s => ({
          title: s.title,
          content: s.content,
          icon: s.icon
        })),

      codeTab: rawConcept.examples.map(e => ({
        title: e.title,
        code: e.code
      })),

      // Single object, or null
      demoTab: rawConcept.demo ? {
        type: rawConcept.demo.type,
        description: rawConcept.demo.description,
        columns: rawConcept.demo.columns,     // Already JSON
        sampleData: rawConcept.demo.sampleData // Already JSON
      } : null,

      questionsTab: rawConcept.questions.map(q => ({
        question: q.question,
        options: q.options,         // Already JSON
        correctIndex: q.correctIndex,
        explanation: q.explanation
      })),
    }

    return res.status(200).json(responseData)

  } catch (error) {
    console.error('Error fetching SQL concept:', error)
    console.error('Error stack:', error.stack)
    console.error('DATABASE_URL set:', !!process.env.DATABASE_URL)
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message,
      type: error.constructor.name
    })
  }
}
