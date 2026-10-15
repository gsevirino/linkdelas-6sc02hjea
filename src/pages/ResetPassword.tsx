import React, { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const { confirmPasswordReset } = useAuth()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!token) {
      setErrorMsg('Token de recuperação inválido ou ausente no link.')
      return
    }

    if (password.length < 8) {
      setErrorMsg('A nova senha deve ter no mínimo 8 caracteres.')
      return
    }

    if (password !== passwordConfirm) {
      setErrorMsg('As senhas digitadas não coincidem.')
      return
    }

    setLoading(true)
    const res = await confirmPasswordReset(token, password)
    setLoading(false)

    if (res.error) {
      setErrorMsg('Não foi possível redefinir a senha. O link pode ter expirado.')
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 animate-fade-in">
      <div className="w-full max-w-md">
        <Card className="border-[#E5DFE3] shadow-md bg-white">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-[#2D2A32]">Redefinir sua senha</CardTitle>
            <CardDescription className="text-xs text-[#6E6A73]">
              Crie uma nova senha segura para sua conta
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
                    Senha redefinida com sucesso!
                  </h3>
                  <p className="text-xs text-[#6E6A73]">
                    Agora você pode entrar usando sua nova senha.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/entrar')}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white mt-3"
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
                      Nenhum código de recuperação encontrado na URL. Use o link recebido por
                      e-mail.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-[#2D2A32]">
                    Nova senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                    <Input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="pl-9 pr-10 text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A73]"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="passwordConfirm" className="text-xs font-semibold text-[#2D2A32]">
                    Confirmar nova senha
                  </Label>
                  <Input
                    id="passwordConfirm"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium shadow-xs"
                >
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </Button>

                <div className="text-center pt-2">
                  <Link to="/entrar" className="text-xs text-[#6E6A73] hover:text-[#7E3F8F]">
                    Cancelar e voltar para o login
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
