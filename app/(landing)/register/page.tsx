import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="bg-background flex flex-col items-center justify-center gap-6 pt-48">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
