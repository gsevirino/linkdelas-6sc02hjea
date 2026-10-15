import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Sparkles, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignIn() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    const res = await signIn(email.trim(), password)
    setLoading(false)

    if (res.error) {
      setErrorMessage(
        res.error.message ||
          'Não foi possível entrar. Verifique seu e-mail e senha e tente novamente.',
      )
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7E3F8F] to-[#5C276B] items-center justify-center text-white shadow-lg shadow-[#7E3F8F]/25 mb-3">
            <Sparkles className="w-7 h-7 text-[#E8B4B8]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
            LinkDelas
          </h1>
          <p className="text-sm text-[#6E6A73] mt-1">
            Rede confiável de serviços de mulheres para mulheres
          </p>
        </div>

        <Card className="border-[#E5DFE3] shadow-md bg-white">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-xl font-bold text-[#2D2A32]">Bem-vinda de volta</CardTitle>
            <CardDescription className="text-xs text-[#6E6A73]">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <Alert
                variant="destructive"
                className="mb-4 text-xs py-2 bg-red-50 border-red-200 text-red-800"
              >
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#2D2A32]">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@mulher.com.br"
                    className="pl-9 text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-[#2D2A32]">
                    Senha
                  </Label>
                  <Link
                    to="/recuperar-senha"
                    className="text-xs font-medium text-[#7E3F8F] hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-10 text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A73] hover:text-[#2D2A32]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium transition-all shadow-xs"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E5DFE3] text-center">
              <p className="text-xs text-[#6E6A73]">
                Ainda não tem uma conta?{' '}
                <Link
                  to="/cadastro"
                  className="font-semibold text-[#7E3F8F] hover:underline inline-flex items-center gap-1"
                >
                  Cadastre-se gratuitamente
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </CardContent>

          <CardFooter className="bg-[#FAF7F5] rounded-b-xl border-t border-[#E5DFE3] py-3 px-6 flex items-center justify-center gap-2 text-xs text-[#2E7D32]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Ambiente seguro exclusivo para mulheres</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
