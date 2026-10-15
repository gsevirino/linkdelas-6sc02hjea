import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { confirmVerification } = useAuth()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      setErrorMsg('Token de verificação não encontrado na URL.')
      return
    }

    confirmVerification(token).then((res) => {
      setLoading(false)
      if (res.error) {
        setErrorMsg('O link de verificação é inválido ou já expirou.')
      } else {
        setSuccess(true)
      }
    })
  }, [token, confirmVerification])

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="border-[#E5DFE3] shadow-md bg-white text-center">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold text-[#2D2A32]">
              Verificação de E-mail
            </CardTitle>
            <CardDescription className="text-xs text-[#6E6A73]">
              Confirmando a autenticidade do seu endereço eletrônico
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-2">
            {loading ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#7E3F8F] animate-spin" />
                <p className="text-sm text-[#6E6A73]">Validando token de confirmação...</p>
              </div>
            ) : success ? (
              <div className="space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2D2A32]">
                    E-mail verificado com sucesso!
                  </h3>
                  <p className="text-xs text-[#6E6A73] mt-1">
                    Sua conta está confirmada. Você já pode acessar todos os recursos da plataforma.
                  </p>
                </div>
                <Button asChild className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white">
                  <Link to="/entrar">Ir para o login</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2D2A32]">Falha na verificação</h3>
                  <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
                </div>
                <Button asChild variant="outline" className="w-full border-[#E5DFE3]">
                  <Link to="/entrar">Voltar para o início</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
