import { NextResponse } from 'next/server'

// SIMPLE TEST VERSION - No database required
// Use this first to verify the API route works

export async function POST(request: Request) {
  try {
    console.log('🔵 API route hit!')
    
    const body = await request.json()
    console.log('📦 Received data:', body)
    
    const {
      businessName,
      industry,
      description,
      targetAudience,
      brandVibe,
      colors
    } = body

    // Validate required fields
    if (!businessName || !industry || !description || !brandVibe) {
      console.log('❌ Validation failed - missing fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique preview ID
    const previewId = `preview_${Date.now()}_${Math.random().toString(36).substring(7)}`

    console.log('✅ Preview ID generated:', previewId)

    // Return success (without database for now)
    return NextResponse.json({
      success: true,
      previewId: previewId,
      message: 'Preview request created successfully (test mode)',
      data: {
        businessName,
        industry,
        description,
        targetAudience,
        brandVibe,
        colors
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })

  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
