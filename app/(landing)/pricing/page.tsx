
export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 pt-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Nossos Planos</h1>
        <p className="text-lg text-muted-foreground">
          Escolha o plano que melhor se adapta às suas necessidades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-lg p-8 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Gratuito</h2>
          <p className="text-muted-foreground mb-6">
            Para começar a explorar a plataforma.
          </p>
          <div className="text-4xl font-bold mb-6">
            R$0<span className="text-lg font-normal">/mês</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              10.000 palavras por mês
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Acesso aos modelos básicos
            </li>
          </ul>
          <button className="mt-auto w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 py-2 px-4 rounded-md">
            Comece Agora
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-8 flex flex-col ring-2 ring-primary">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Profissional</h2>
            <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
              Popular
            </span>
          </div>
          <p className="text-muted-foreground mb-6">
            Para pesquisadores e estudantes sérios.
          </p>
          <div className="text-4xl font-bold mb-6">
            R$49<span className="text-lg font-normal">/mês</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Palavras ilimitadas
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Acesso aos modelos avançados
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Compilação de PDF em alta prioridade
            </li>
          </ul>
          <button className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
            Assine Agora
          </button>
        </div>


      </div>
    </div>
  )
}
