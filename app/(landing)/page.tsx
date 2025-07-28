"use client"

import { FileText, Sparkles, Zap, BookOpen, Search, Globe } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { transcribeAudio } from "@/lib/audio-utils"
import { Chat } from "@/components/ui/chat"

export default function LandingPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      model: "llama-3.3-70b-versatile",
    },
  })

  const isLoading = status === "submitted" || status === "streaming"

  return (
    <div className="bg-background flex flex-col mx-auto pt-32">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                  Escreva seu trabalho acadêmico em minutos.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Nossa IA pesquisa automaticamente na internet, escreve seu trabalho e entrega um PDF
                  completamente formatado seguindo as normas acadêmicas. Tudo em minutos.
                </p>
              </div>

              {/* Quick Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <FileText className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">PDF formatado automaticamente</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Search className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Pesquisa automática na web</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Globe className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Fontes e referências incluídas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Normas ABNT, APA, IEEE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <Zap className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Pronto em minutos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">TCC, artigos, monografias</span>
                </div>
              </div>

              <div className="flex space-x-8">
                <div>
                  <div className="text-2xl font-bold text-foreground">10k+</div>
                  <div className="text-sm text-muted-foreground">Usuários</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">50k+</div>
                  <div className="text-sm text-muted-foreground">Trabalhos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Chat */}
            <div className="space-y-4">
              <div className="rounded-2xl border bg-background shadow-lg">
                <div className="p-4">
                  <Chat
                    className="h-[450px]"
                    messages={messages}
                    handleSubmit={handleSubmit}
                    input={input}
                    handleInputChange={handleInputChange}
                    isGenerating={isLoading}
                    stop={stop}
                    append={append}
                    setMessages={setMessages}
                    transcribeAudio={transcribeAudio}
                    suggestions={[
                      "Preciso de um TCC sobre sustentabilidade empresarial",
                      "Artigo científico sobre psicologia cognitiva",
                      "Monografia sobre transformação digital nas empresas",
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
