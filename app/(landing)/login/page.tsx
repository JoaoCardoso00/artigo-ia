import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-background flex flex-col items-center justify-center gap-6 pt-48">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
