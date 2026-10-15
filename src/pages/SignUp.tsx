import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  User,
  Briefcase,
  Lock,
  Mail,
  Phone,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getCategories } from '@/services/categories'
import type { CategoryRecord, UserRole } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignUp() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  // State
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<UserRole>('cliente')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('SP')
  const [bio, setBio] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [consentWomenOnly, setConsentWomenOnly] = useState(false)

  const [categoriesList, setCategoriesList] = useState<CategoryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    getCategories().then(setCategoriesList)
  }, [])

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1
    return score
  }
  const passStrength = getPasswordStrength(password)

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (password.length < 8) {
      setErrorMessage('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    if (role === 'cliente') {
      // Direct submit for clients
      handleFinalSubmit()
    } else {
      // Go to step 2 for providers
      setStep(2)
    }
  }

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMessage(null)

    if (role === 'prestadora') {
      if (!consentWomenOnly) {
        setErrorMessage('É necessário confirmar o termo da rede feminina para continuar.')
        return
      }
      if (selectedCategories.length === 0) {
        setErrorMessage('Selecione pelo menos uma categoria de serviço.')
        return
      }
      if (!serviceDescription.trim()) {
        setErrorMessage('Por favor, descreva os serviços que você oferece.')
        return
      }
    }

    setLoading(true)
    const res = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      phone: phone.trim(),
      city: city.trim(),
      state: stateCode,
      bio: bio.trim(),
      serviceDescription: serviceDescription.trim(),
      categories: selectedCategories,
    })
    setLoading(false)

    if (res.error) {
      setErrorMessage(
        res.error.message ||
          'Não foi possível concluir seu cadastro. Verifique se o e-mail já está em uso.',
      )
    } else {
      navigate('/boas-vindas', {
        state: { email: email.trim(), role, name: name.trim() },
      })
    }
  }

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catId))
    } else {
      setSelectedCategories([...selectedCategories, catId])
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 animate-fade-in">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7E3F8F] to-[#5C276B] items-center justify-center text-white shadow-md shadow-[#7E3F8F]/20 mb-2">
            <Sparkles className="w-6 h-6 text-[#E8B4B8]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
            Faça parte da LinkDelas
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A73] mt-1">
            {step === 1
              ? 'Etapa 1 de 2: Seus dados de acesso'
              : 'Etapa 2 de 2: Informações profissionais do seu serviço'}
          </p>
        </div>

        <Card className="border-[#E5DFE3] shadow-md bg-white">
          <CardHeader className="pb-3 border-b border-[#FAF7F5]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#2D2A32]">
                {step === 1 ? 'Crie sua conta' : 'Complete seu perfil de Prestadora'}
              </CardTitle>
              {role === 'prestadora' && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3EEF0] text-[#7E3F8F]">
                  Passo {step} de 2
                </span>
              )}
            </div>
            <CardDescription className="text-xs text-[#6E6A73]">
              {step === 1
                ? 'Escolha se você quer contratar ou oferecer serviços'
                : 'Seu perfil passará por uma curadoria cuidadosa antes da aprovação'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            {errorMessage && (
              <Alert
                variant="destructive"
                className="mb-4 text-xs py-2 bg-red-50 border-red-200 text-red-800"
              >
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                {/* Role selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-[#2D2A32]">
                    Qual o seu objetivo principal?
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('cliente')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        role === 'cliente'
                          ? 'border-[#7E3F8F] bg-[#FAF7F5] ring-2 ring-[#7E3F8F]/20'
                          : 'border-[#E5DFE3] hover:border-[#7E3F8F]/50 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <User
                          className={`w-5 h-5 ${
                            role === 'cliente' ? 'text-[#7E3F8F]' : 'text-[#6E6A73]'
                          }`}
                        />
                        {role === 'cliente' && (
                          <div className="w-4 h-4 rounded-full bg-[#7E3F8F] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-sm text-[#2D2A32]">Sou Cliente</span>
                      <span className="text-xs text-[#6E6A73]">
                        Quero encontrar e contratar mulheres qualificadas
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('prestadora')}
                      className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        role === 'prestadora'
                          ? 'border-[#7E3F8F] bg-[#FAF7F5] ring-2 ring-[#7E3F8F]/20'
                          : 'border-[#E5DFE3] hover:border-[#7E3F8F]/50 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Briefcase
                          className={`w-5 h-5 ${
                            role === 'prestadora' ? 'text-[#7E3F8F]' : 'text-[#6E6A73]'
                          }`}
                        />
                        {role === 'prestadora' && (
                          <div className="w-4 h-4 rounded-full bg-[#7E3F8F] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-sm text-[#2D2A32]">Sou Prestadora</span>
                      <span className="text-xs text-[#6E6A73]">
                        Quero divulgar meu trabalho e receber orçamentos
                      </span>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-[#2D2A32]">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mariana Silveira"
                    className="text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                  />
                </div>

                {/* Email */}
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
                      placeholder="mariana@exemplo.com.br"
                      className="pl-9 text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                    />
                  </div>
                </div>

                {/* Password & indicator */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-[#2D2A32]">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="pl-9 text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                    />
                  </div>
                  {password && (
                    <div className="space-y-1 pt-1">
                      <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                        <div
                          className={`h-full ${
                            passStrength >= 1 ? 'bg-amber-400' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`h-full ${
                            passStrength >= 2 ? 'bg-amber-500' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`h-full ${
                            passStrength >= 3 ? 'bg-lime-500' : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`h-full ${
                            passStrength >= 4 ? 'bg-[#2E7D32]' : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-[#6E6A73]">
                        {passStrength < 2
                          ? 'Senha fraca'
                          : passStrength < 4
                            ? 'Senha média'
                            : 'Senha forte'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Basic location */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold text-[#2D2A32]">
                      Cidade
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="text-sm border-[#E5DFE3]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stateCode" className="text-xs font-semibold text-[#2D2A32]">
                      Estado (UF)
                    </Label>
                    <select
                      id="stateCode"
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="w-full h-10 px-3 text-sm rounded-md border border-[#E5DFE3] bg-white focus:outline-none focus:ring-2 focus:ring-[#7E3F8F]"
                    >
                      {['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'BA', 'DF', 'PE', 'CE', 'GO', 'ES'].map(
                        (uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium transition-all shadow-xs mt-2"
                >
                  {role === 'prestadora' ? (
                    <span className="flex items-center gap-1.5">
                      Continuar para dados do serviço
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : loading ? (
                    'Criando conta...'
                  ) : (
                    'Concluir cadastro'
                  )}
                </Button>
              </form>
            ) : (
              /* Step 2 for providers */
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-[#2D2A32]">
                    WhatsApp ou telefone profissional
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                    <Input
                      id="phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="pl-9 text-sm border-[#E5DFE3]"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-[#2D2A32]">
                    Categorias em que você atua (selecione uma ou mais)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categoriesList.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`p-2.5 rounded-lg border text-xs font-medium text-left flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'border-[#7E3F8F] bg-[#F3EEF0] text-[#7E3F8F]'
                              : 'border-[#E5DFE3] bg-white text-[#2D2A32] hover:border-[#7E3F8F]/40'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Service description */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="serviceDescription"
                    className="text-xs font-semibold text-[#2D2A32]"
                  >
                    Descrição dos serviços prestados
                  </Label>
                  <Textarea
                    id="serviceDescription"
                    required
                    rows={4}
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Conte quais procedimentos, técnicas ou serviços você realiza, diferenciais e como costuma atender (domicílio, espaço próprio)..."
                    className="text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                  />
                </div>

                {/* Short Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio" className="text-xs font-semibold text-[#2D2A32]">
                    Breve biografia profissional / Certificações
                  </Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ex: Formada em estética há 6 anos, pós em cosmetologia..."
                    className="text-sm border-[#E5DFE3]"
                  />
                </div>

                {/* Consent checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#2D2A32] leading-relaxed p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3]">
                    <Checkbox
                      checked={consentWomenOnly}
                      onCheckedChange={(checked) => setConsentWomenOnly(Boolean(checked))}
                      className="mt-0.5 border-[#7E3F8F] data-[state=checked]:bg-[#7E3F8F]"
                    />
                    <span>
                      <strong>Declaro que sou mulher</strong> e quero compor a rede LinkDelas,
                      respeitando o regulamento de segurança e qualidade do catálogo.
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-[#E5DFE3]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium transition-all shadow-xs"
                  >
                    {loading ? 'Cadastrando...' : 'Finalizar cadastro e enviar para análise'}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-5 pt-4 border-t border-[#E5DFE3] text-center">
              <p className="text-xs text-[#6E6A73]">
                Já possui uma conta?{' '}
                <Link to="/entrar" className="font-semibold text-[#7E3F8F] hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
