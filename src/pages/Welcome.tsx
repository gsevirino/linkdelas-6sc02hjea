import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MailCheck, Sparkles, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Welcome() {
  const location = useLocation()
  const { requestVerificationEmail } = useAuth()
  const email = (location.state as any)?.email || ''
  const role = (location.state as any)?.role || 'cliente'
  const name = (location.state as any)?.name || 'Querida'

  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    await requestVerificationEmail(email)
    setResending(false)
    setResendSuccess(true)
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-16 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="border-[#E5DFE3] shadow-md bg-white text-center">
          <CardHeader className="pb-3">
            <div className="w-16 h-16 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center mx-auto mb-3 shadow-inner">
              <MailCheck className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#2D2A32]">
              Conta criada com sucesso!
            </CardTitle>
            <CardDescription className="text-sm text-[#6E6A73] pt-1">
              {role === 'prestadora'
                ? `Bem-vinda à rede, ${name}! Seu cadastro foi recebido para curadoria.`
                : `Bem-vinda, ${name}! Você agora faz parte de um espaço seguro e exclusivo.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            <div className="p-4 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3] text-left text-xs text-[#2D2A32] space-y-2">
              <p className="font-semibold text-sm text-[#7E3F8F]">Próximo passo:</p>
              <p>
                Enviamos um link de confirmação para{' '}
                <strong>{email || 'o seu e-mail cadastrado'}</strong>.
              </p>
              <p className="text-[#6E6A73]">
                {role === 'prestadora'
                  ? 'Nossa equipe revisará seus dados em até 48h. Enquanto isso, confirme seu e-mail para ter acesso ao painel de orçamentos e mensagens.'
                  : 'Clique no link recebido para validar seu e-mail e começar a contatar prestadoras com tranquilidade.'}
              </p>
            </div>

            {resendSuccess && (
              <Alert className="text-xs py-2 bg-emerald-50 border-emerald-200 text-[#2E7D32]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                <AlertDescription>
                  Um novo link de confirmação foi enviado para sua caixa de entrada.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2.5">
              <Button
                asChild
                className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 shadow-xs"
              >
                <Link to="/entrar">
                  Ir para a página de login
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>

              {email && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full border-[#E5DFE3] text-xs text-[#6E6A73] hover:text-[#2D2A32]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Enviando e-mail...' : 'Enviar novo e-mail de confirmação'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
