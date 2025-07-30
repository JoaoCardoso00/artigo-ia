import { SemanticScholarSearchResponse, SemanticScholarPaper } from '@/types/api'

export class SemanticScholarClient {
  private baseUrl = 'https://api.semanticscholar.org/graph/v1'
  private apiKey?: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey
    }
    
    return headers
  }

  async searchPapers(query: string, options?: {
    limit?: number
    offset?: number
    fields?: string[]
    year?: string
    venue?: string[]
    fieldsOfStudy?: string[]
  }): Promise<SemanticScholarSearchResponse> {
    const params = new URLSearchParams({
      query,
      limit: (options?.limit || 10).toString(),
      offset: (options?.offset || 0).toString(),
    })

    if (options?.fields) {
      params.append('fields', options.fields.join(','))
    } else {
      // Default fields for comprehensive paper information
      params.append('fields', [
        'paperId',
        'title',
        'abstract',
        'venue',
        'year',
        'authors',
        'citationCount',
        'referenceCount',
        'influentialCitationCount',
        'fieldsOfStudy',
        'publicationTypes',
        'publicationDate',
        'journal',
        'url',
        'openAccessPdf'
      ].join(','))
    }

    if (options?.year) {
      params.append('year', options.year)
    }

    if (options?.venue) {
      params.append('venue', options.venue.join(','))
    }

    if (options?.fieldsOfStudy) {
      params.append('fieldsOfStudy', options.fieldsOfStudy.join(','))
    }

    const response = await fetch(`${this.baseUrl}/paper/search?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as SemanticScholarSearchResponse
  }

  async getPaper(paperId: string, fields?: string[]): Promise<SemanticScholarPaper> {
    const params = new URLSearchParams()
    
    if (fields) {
      params.append('fields', fields.join(','))
    } else {
      params.append('fields', [
        'paperId',
        'title',
        'abstract',
        'venue',
        'year',
        'authors',
        'citationCount',
        'referenceCount',
        'influentialCitationCount',
        'fieldsOfStudy',
        'publicationTypes',
        'publicationDate',
        'journal',
        'url',
        'openAccessPdf'
      ].join(','))
    }

    const response = await fetch(`${this.baseUrl}/paper/${paperId}?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as SemanticScholarPaper
  }
}

export async function searchAcademicPapers(query: string, options?: {
  limit?: number
  year?: string
  fieldsOfStudy?: string[]
}): Promise<SemanticScholarSearchResponse> {
  const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY
  const client = new SemanticScholarClient(apiKey)
  
  return client.searchPapers(query, {
    limit: options?.limit || 10,
    year: options?.year,
    fieldsOfStudy: options?.fieldsOfStudy,
  })
}