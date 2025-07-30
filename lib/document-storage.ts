import { DocumentContent } from './document-generator'

// In-memory storage for demo (in production, use Redis or database)
const documentStore = new Map<string, DocumentContent>()

export function storeDocument(id: string, content: DocumentContent) {
  documentStore.set(id, content)
  
  // Clean up after 24 hours
  setTimeout(() => {
    documentStore.delete(id)
  }, 24 * 60 * 60 * 1000)
}

export function getDocument(id: string): DocumentContent | undefined {
  return documentStore.get(id)
}