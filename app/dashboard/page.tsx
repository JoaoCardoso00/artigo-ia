"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Settings,
  User,
  MoreHorizontal,
  Trash2,
  Edit,
  MessageSquare,
  Crown,
  FileText,
  LogOut
} from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { transcribeAudio } from "@/lib/audio-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Chat } from "@/components/ui/chat"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/stores/auth-store"
import Link from "next/link"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

const mockChats: ChatSession[] = [
  {
    id: "1",
    title: "Estrutura do TCC sobre sustentabilidade",
    lastMessage: "Vou criar um esboço detalhado para seu TCC...",
    timestamp: new Date()
  },
  {
    id: "2",
    title: "Metodologia de pesquisa qualitativa",
    lastMessage: "A metodologia qualitativa é ideal para...",
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: "3",
    title: "Revisão bibliográfica - artigo científico",
    lastMessage: "Para fazer uma boa revisão bibliográfica...",
    timestamp: new Date(Date.now() - 86400000)
  }
]

function DashboardContent() {
  const { user, signOut } = useAuthStore()
  const [selectedChat, setSelectedChat] = useState<string | null>("1")
  const [searchQuery, setSearchQuery] = useState("")

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
      model: "gemini-1.5-pro",
    },
  })

  const isLoading = status === "submitted" || status === "streaming"

  const handleSignOut = async () => {
    await signOut()
  }

  function createNewChat() {
    console.log("Creating new chat...")
  }

  function handleChatAction(action: string, chatId: string, event: React.MouseEvent) {
    event.stopPropagation()
    console.log(`${action} chat ${chatId}`)
  }

  const filteredChats = mockChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r flex flex-col">
          <SidebarHeader className="border-b p-4 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Artigo IA</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="flex-1 flex flex-col">

            {/* Search */}
            <div className="p-4 border-b">
              <Button size="sm" className="w-full mb-4" onClick={createNewChat}>
                <Plus className="h-4 w-4" />
                Nova Conversa
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white"
                />


              </div>

            </div>

            {/* Chat History - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <SidebarMenu>
                  {filteredChats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <div className="relative group">
                        <SidebarMenuButton
                          onClick={() => setSelectedChat(chat.id)}
                          className={cn(
                            "w-full justify-start p-3 h-auto",
                            selectedChat === chat.id && "bg-muted"
                          )}
                        >
                          <div className="flex items-start space-x-2 w-full">
                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-5 truncate">
                                {chat.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {chat.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <div className="flex items-center space-x-3 w-full">
                        <User className="h-4 w-4" />
                        <span className="flex-1">
                          {user?.user_metadata?.full_name || user?.email || "Usuário"}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen">
          {/* Header */}
          <header className="border-b p-3.5 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-xl font-semibold">
                  {selectedChat
                    ? filteredChats.find(c => c.id === selectedChat)?.title || "Nova Conversa"
                    : "Nova Conversa"
                  }
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 p-6 min-h-0">
            <div className="max-w-4xl mx-auto h-full">
              <Chat
                className="h-full"
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
                  "Faça um artigo simples sobre o uso de banco de dados relacionais no contexto de modelos de linguagem (LLMs)",
                  "Preciso de artigos científicos recentes sobre sustentabilidade empresarial para meu TCC",
                  "Crie um documento ABNT sobre metodologias ágeis em desenvolvimento de software",
                  "Gere um artigo acadêmico sobre inteligência artificial na educação com referências",
                ]}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default function AcademicDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
