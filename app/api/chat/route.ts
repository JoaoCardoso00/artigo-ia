import { google } from '@ai-sdk/google'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { searchWeb } from '@/lib/tavily'
import { searchAcademicPapers } from '@/lib/semantic-scholar'
import { DocumentGenerator, DocumentContent, DocumentSection, Reference } from '@/lib/document-generator'
import { storeDocument } from '@/lib/document-storage'

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

📄 **Geração de Documentos Acadêmicos:**
- Criar documentos completos em formato ABNT (artigos, TCCs, dissertações)
- Gerar arquivos LaTeX e HTML para download
- Formatar citações e referências automaticamente
- Estruturar seções (introdução, desenvolvimento, metodologia, conclusão)
- Incluir resumo, palavras-chave e bibliografia

**Instruções importantes:**
- Sempre cite suas fontes quando usar informações de buscas
- Priorize fontes acadêmicas confiáveis
- Seja preciso e rigoroso nas informações científicas
- Quando buscar artigos, explique brevemente por que são relevantes
- Use linguagem acadêmica apropriada, mas acessível
- Para temas atuais, use busca web; para pesquisa científrica, use busca acadêmica
- Quando solicitado para gerar um artigo/documento completo, use a ferramenta generateDocument
- Sempre inclua título, autor, seções estruturadas e referências quando gerar documentos
- Para documentos acadêmicos, siga sempre o formato ABNT

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

        generateDocument: tool({
          description: 'Generate a complete academic document (article, paper, TCC) in ABNT format. Use this when the user requests a complete article, paper, or document to be generated and downloaded.',
          parameters: z.object({
            title: z.string().describe('The title of the document'),
            author: z.string().describe('The author name'),
            institution: z.string().optional().describe('Educational institution'),
            course: z.string().optional().describe('Course or department'),
            advisor: z.string().optional().describe('Advisor or supervisor name'),
            abstract: z.string().optional().describe('Document abstract/summary'),
            keywords: z.array(z.string()).optional().describe('Keywords for the document'),
            sections: z.array(z.object({
              title: z.string().describe('Section title'),
              content: z.string().describe('Section content'),
              subsections: z.array(z.object({
                title: z.string().describe('Subsection title'),
                content: z.string().describe('Subsection content')
              })).optional().describe('Subsections within this section')
            })).describe('Document sections with content'),
            references: z.array(z.object({
              id: z.string().describe('Reference ID'),
              type: z.enum(['article', 'book', 'inproceedings', 'misc']).describe('Type of reference'),
              title: z.string().describe('Reference title'),
              author: z.string().describe('Reference authors'),
              year: z.string().describe('Publication year'),
              journal: z.string().optional().describe('Journal name'),
              publisher: z.string().optional().describe('Publisher'),
              pages: z.string().optional().describe('Page numbers'),
              url: z.string().optional().describe('URL if available'),
              doi: z.string().optional().describe('DOI if available')
            })).optional().describe('References/bibliography')
          }),
          execute: async ({ title, author, institution, course, advisor, abstract, keywords, sections, references }) => {
            try {
              const generator = new DocumentGenerator()
              
              const documentContent: DocumentContent = {
                title,
                author,
                institution,
                course,
                advisor,
                abstract,
                keywords,
                sections: sections.map(section => ({
                  title: section.title,
                  content: section.content,
                  subsections: section.subsections?.map(sub => ({
                    title: sub.title,
                    content: sub.content
                  }))
                })),
                references: references?.map(ref => ({
                  id: ref.id,
                  type: ref.type,
                  title: ref.title,
                  author: ref.author,
                  year: ref.year,
                  journal: ref.journal,
                  publisher: ref.publisher,
                  pages: ref.pages,
                  url: ref.url,
                  doi: ref.doi
                }))
              }
              
              const result = await generator.generateDocumentResponse(documentContent)
              
              // Store document for serving
              storeDocument(result.documentId, documentContent)
              
              return {
                success: true,
                documentId: result.documentId,
                title: result.title,
                downloads: {
                  html: result.htmlUrl,
                  latex: result.latexUrl
                },
                message: 'Documento gerado com sucesso! Use os links acima para visualizar ou baixar o documento em formato HTML ou LaTeX.'
              }
            } catch (error) {
              console.error('Document generation error:', error)
              return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate document',
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
