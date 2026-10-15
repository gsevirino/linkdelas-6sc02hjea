import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const res = await requestPasswordReset(email.trim())
    setLoading(false)

    if (res.error) {
      setErrorMsg(
        'Não foi possível enviar o link. Verifique se o e-mail está digitado corretamente.',
      )
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="border-[#E5DFE3] shadow-md bg-white">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold text-[#2D2A32]">Recuperar senha</CardTitle>
            <CardDescription className="text-xs text-[#6E6A73]">
              Enviaremos um link seguro para você redefinir seu acesso
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {sent ? (
              <div className="space-y-4 text-center py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-[#2D2A32]">Link enviado!</h3>
                  <p className="text-xs text-[#6E6A73]">
                    Se o e-mail <strong>{email}</strong> estiver cadastrado em nossa base, você
                    receberá as instruções em alguns instantes.
                  </p>
                </div>
                <Button asChild className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white mt-4">
                  <Link to="/entrar">Voltar para o login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <Alert
                    variant="destructive"
                    className="text-xs py-2 bg-red-50 border-red-200 text-red-800"
                  >
                    <AlertDescription>{errorMsg}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-[#2D2A32]">
                    Seu e-mail cadastrado
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium shadow-xs"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to="/entrar"
                    className="text-xs text-[#6E6A73] hover:text-[#7E3F8F] inline-flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Lembrou a senha? Voltar para o login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
