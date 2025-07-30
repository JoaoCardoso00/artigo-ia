export interface TavilySearchResult {
  title: string
  url: string
  content: string
  raw_content?: string
  score: number
  published_date?: string
}

export interface TavilySearchResponse {
  query: string
  follow_up_questions?: string[]
  answer: string
  images: string[]
  results: TavilySearchResult[]
  response_time: number
}

export interface SemanticScholarPaper {
  paperId: string
  title: string
  abstract?: string
  venue?: string
  year?: number
  authors: Array<{
    authorId: string
    name: string
  }>
  citationCount: number
  referenceCount: number
  influentialCitationCount: number
  fieldsOfStudy?: string[]
  publicationTypes?: string[]
  publicationDate?: string
  journal?: {
    name: string
    volume?: string
    pages?: string
  }
  url?: string
  openAccessPdf?: {
    url: string
    status: string
  }
}

export interface SemanticScholarSearchResponse {
  total: number
  offset: number
  next?: number
  data: SemanticScholarPaper[]
}

export interface GeminiToolCall {
  name: string
  parameters: Record<string, any>
}

export interface GeminiToolResult {
  name: string
  content: string
  success: boolean
  error?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    result?: any
    state: 'call' | 'result'
  }>
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model?: string
  stream?: boolean
  tools?: Array<{
    type: 'function'
    function: {
      name: string
      description: string
      parameters: Record<string, any>
    }
  }>
}