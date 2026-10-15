import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Mail, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ConfirmEmailChange() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { confirmEmailChange } = useAuth()

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!token) {
      setErrorMsg('Token de confirmação não encontrado no link.')
      return
    }

    setLoading(true)
    const res = await confirmEmailChange(token, password)
    setLoading(false)

    if (res.error) {
      setErrorMsg(
        'Não foi possível confirmar a alteração de e-mail. Verifique se a senha informada está correta ou se o link expirou.',
      )
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="border-[#E5DFE3] shadow-md bg-white">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl font-bold text-[#2D2A32]">
              Confirmar novo e-mail
            </CardTitle>
            <CardDescription className="text-xs text-[#6E6A73]">
              Por segurança, digite sua senha atual para autorizar a troca de e-mail
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {success ? (
              <div className="space-y-4 text-center py-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-[#2D2A32]">
                    E-mail alterado com sucesso!
                  </h3>
                  <p className="text-xs text-[#6E6A73]">
                    Sua sessão foi encerrada. Faça login novamente usando seu novo endereço de
                    e-mail.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/entrar')}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white mt-4"
                >
                  Fazer login agora
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

                {!token && (
                  <Alert className="text-xs py-2 bg-amber-50 border-amber-200 text-amber-800">
                    <AlertDescription>
                      Código de confirmação ausente na URL. Abra o link enviado diretamente em sua
                      caixa de entrada.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-[#2D2A32]">
                    Sua senha atual
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium shadow-xs"
                >
                  {loading ? 'Confirmando...' : 'Confirmar e salvar novo e-mail'}
                </Button>

                <div className="text-center pt-2">
                  <Link to="/" className="text-xs text-[#6E6A73] hover:text-[#7E3F8F]">
                    Cancelar e voltar ao painel
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
