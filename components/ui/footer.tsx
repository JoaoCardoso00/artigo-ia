import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>Artigo IA</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
