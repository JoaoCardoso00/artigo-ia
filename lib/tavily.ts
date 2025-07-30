import { TavilySearchResponse } from '@/types/api'

export class TavilyClient {
  private apiKey: string
  private baseUrl = 'https://api.tavily.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async search(query: string, options?: {
    search_depth?: 'basic' | 'advanced'
    include_answer?: boolean
    include_raw_content?: boolean
    max_results?: number
    include_domains?: string[]
    exclude_domains?: string[]
  }): Promise<TavilySearchResponse> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        query,
        search_depth: options?.search_depth || 'basic',
        include_answer: options?.include_answer !== false,
        include_raw_content: options?.include_raw_content || false,
        max_results: options?.max_results || 5,
        include_domains: options?.include_domains,
        exclude_domains: options?.exclude_domains,
      }),
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as TavilySearchResponse
  }
}

export async function searchWeb(query: string): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY
  
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY environment variable is not set')
  }

  const client = new TavilyClient(apiKey)
  return client.search(query, {
    search_depth: 'advanced',
    include_answer: true,
    max_results: 5,
  })
}