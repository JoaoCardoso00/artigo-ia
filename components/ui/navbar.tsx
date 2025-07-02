"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0 sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Artigo IA</span>
            </Link>
            <div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Início</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/pricing">Preços</Link>
              </Button>
              <Button variant="ghost" size="sm">
                Como funciona
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
            <Button size="sm">
              Começar grátis
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
