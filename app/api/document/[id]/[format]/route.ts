import { NextRequest, NextResponse } from 'next/server'
import { DocumentGenerator } from '@/lib/document-generator'
import { getDocument } from '@/lib/document-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; format: string }> }
) {
  try {
    const { id, format } = await params
    
    const documentContent = getDocument(id)
    if (!documentContent) {
      return new NextResponse('Document not found', { status: 404 })
    }
    
    const generator = new DocumentGenerator()
    
    if (format === 'html') {
      const htmlContent = generator.generateABNTHTML(documentContent)
      
      return new NextResponse(htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `inline; filename="${documentContent.title}.html"`,
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }
    
    if (format === 'latex') {
      const latexContent = generator.generateLaTeX(documentContent)
      
      return new NextResponse(latexContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${documentContent.title}.tex"`,
          'Cache-Control': 'public, max-age=3600'
        }
      })
    }
    
    return new NextResponse('Invalid format', { status: 400 })
  } catch (error) {
    console.error('Document generation error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

