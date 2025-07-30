import { google } from '@ai-sdk/google'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { searchWeb } from '@/lib/tavily'
import { searchAcademicPapers } from '@/lib/semantic-scholar'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, model = 'gemini-1.5-pro' } = await req.json()

    const result = streamText({
      model: google(model),
      system: `Você é o Artigo IA, um assistente especializado em pesquisa acadêmica e científica. Seu objetivo é ajudar estudantes, pesquisadores e acadêmicos com:

🎓 **Pesquisa Acadêmica:**
- Encontrar artigos científicos relevantes
- Sugerir metodologias de pesquisa
- Ajudar na estruturação de trabalhos acadêmicos (TCC, dissertações, teses)
- Orientar sobre citações e referências bibliográficas

🔍 **Busca de Informações:**
- Realizar buscas web para informações atuais e contextuais
- Pesquisar papers acadêmicos em bases científicas
- Fornecer fontes confiáveis e atualizadas

📝 **Suporte à Escrita Acadêmica:**
- Ajudar na elaboração de revisões bibliográficas
- Sugerir estruturas para trabalhos científicos
- Orientar sobre normas acadêmicas (ABNT, APA, etc.)
- Gerar documentos LaTeX formatados para trabalhos acadêmicos

📄 **Geração de Documentos LaTeX:**
- Criar templates LaTeX para TCCs, dissertações e teses
- Formatar citações e referências em LaTeX/BibTeX
- Gerar seções estruturadas (introdução, metodologia, conclusão)
- Configurar layouts acadêmicos padrão (ABNT, IEEE, ACM)
- Integrar gráficos, tabelas e figuras em LaTeX

**Instruções importantes:**
- Sempre cite suas fontes quando usar informações de buscas
- Priorize fontes acadêmicas confiáveis
- Seja preciso e rigoroso nas informações científicas
- Quando buscar artigos, explique brevemente por que são relevantes
- Use linguagem acadêmica apropriada, mas acessível
- Para temas atuais, use busca web; para pesquisa científrica, use busca acadêmica
- Para LaTeX, forneça código bem estruturado e comentado
- Mencione que funcionalidades LaTeX avançadas serão implementadas em futuras atualizações

Responda sempre em português brasileiro e seja útil, preciso e acadêmico em suas respostas.`,
      messages,
      tools: {
        searchWeb: tool({
          description: 'Search the web for current information, news, and general knowledge. Use this when the user asks about recent events, current information, or general topics that might benefit from up-to-date web sources.',
          parameters: z.object({
            query: z.string().describe('The search query to find relevant web information'),
          }),
          execute: async ({ query }) => {
            try {
              const searchResults = await searchWeb(query)

              return {
                success: true,
                query: searchResults.query,
                answer: searchResults.answer,
                results: searchResults.results.map(result => ({
                  title: result.title,
                  url: result.url,
                  content: result.content.substring(0, 500) + (result.content.length > 500 ? '...' : ''),
                  score: result.score,
                  published_date: result.published_date,
                })),
                response_time: searchResults.response_time,
              }
            } catch (error) {
              console.error('Web search error:', error)
              return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to search the web',
              }
            }
          },
        }),

        searchAcademic: tool({
          description: 'Search for academic papers and research publications from Semantic Scholar. Use this when the user asks about academic research, scientific papers, scholarly articles, or needs citations for academic work.',
          parameters: z.object({
            query: z.string().describe('The academic search query to find relevant research papers'),
            limit: z.number().optional().default(10).describe('Number of papers to return (default: 10, max: 20)'),
            year: z.string().optional().describe('Filter papers by publication year (e.g., "2020-2024" or "2023")'),
            fieldsOfStudy: z.array(z.string()).optional().describe('Filter by fields of study (e.g., ["Computer Science", "Medicine"])'),
          }),
          execute: async ({ query, limit = 10, year, fieldsOfStudy }) => {
            try {
              const searchResults = await searchAcademicPapers(query, {
                limit: Math.min(limit, 20),
                year,
                fieldsOfStudy,
              })

              return {
                success: true,
                total: searchResults.total,
                papers: searchResults.data.map(paper => ({
                  paperId: paper.paperId,
                  title: paper.title,
                  abstract: paper.abstract ?
                    (paper.abstract.length > 300 ?
                      paper.abstract.substring(0, 300) + '...' :
                      paper.abstract) :
                    null,
                  authors: paper.authors.map(author => author.name).join(', '),
                  venue: paper.venue,
                  year: paper.year,
                  citationCount: paper.citationCount,
                  influentialCitationCount: paper.influentialCitationCount,
                  fieldsOfStudy: paper.fieldsOfStudy,
                  url: paper.url,
                  openAccessPdf: paper.openAccessPdf?.url,
                })),
              }
            } catch (error) {
              console.error('Academic search error:', error)
              return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to search academic papers',
              }
            }
          },
        }),
      },
      toolChoice: 'auto',
      temperature: 0.7,
      maxTokens: 4000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
