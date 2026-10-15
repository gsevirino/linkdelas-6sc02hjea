import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  CreditCard,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
  Phone,
  MapPin,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { getCategories } from '@/services/categories'
import type { CategoryRecord } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function SettingsPage() {
  const { user, refreshUser, requestEmailChange, signOut } = useAuth()
  const navigate = useNavigate()

  // Profile form state
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [city, setCity] = useState(user?.city || '')
  const [stateCode, setStateCode] = useState(user?.state || 'SP')
  const [bio, setBio] = useState(user?.bio || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.categories || [])
  const [serviceDescription, setServiceDescription] = useState('')
  const [categoriesList, setCategoriesList] = useState<CategoryRecord[]>([])

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Security: Change Password
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Security: Change Email
  const [newEmail, setNewEmail] = useState('')
  const [sendingEmailChange, setSendingEmailChange] = useState(false)
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false)
  const [emailChangeError, setEmailChangeError] = useState<string | null>(null)

  // Delete Account Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    getCategories().then(setCategoriesList)
  }, [])

  useEffect(() => {
    if (user?.id && user.role === 'prestadora') {
      // Load provider description
      pb.collection('providers')
        .getFirstListItem(`user="${user.id}"`)
        .then((p) => {
          setServiceDescription(p.service_description || '')
        })
        .catch(() => {})
    }
  }, [user])

  // Profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSavingProfile(true)
    setProfileSuccess(false)
    setProfileError(null)

    try {
      await pb.collection('users').update(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: stateCode,
        bio: bio.trim(),
        categories: selectedCategories,
      })

      // Update provider record if applicable
      if (user.role === 'prestadora') {
        try {
          const prov = await pb.collection('providers').getFirstListItem(`user="${user.id}"`)
          if (prov) {
            await pb.collection('providers').update(prov.id, {
              city: city.trim(),
              state: stateCode,
              service_description: serviceDescription.trim(),
              categories: selectedCategories,
            })
          }
        } catch {
          /* intentionally ignored */
        }
      }

      await refreshUser()
      setSavingProfile(false)
      setProfileSuccess(true)
    } catch (err: any) {
      setSavingProfile(false)
      setProfileError(err.message || 'Erro ao atualizar dados do perfil.')
    }
  }

  // Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword.length < 8) {
      setPasswordError('A nova senha precisa ter no mínimo 8 caracteres.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('A confirmação da nova senha não confere.')
      return
    }

    setSavingPassword(true)
    try {
      await pb.collection('users').update(user.id, {
        oldPassword,
        password: newPassword,
        passwordConfirm: confirmNewPassword,
      })
      setSavingPassword(false)
      setPasswordSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err: any) {
      setSavingPassword(false)
      setPasswordError(err.message || 'Erro ao alterar senha. Verifique sua senha atual.')
    }
  }

  // Email change request
  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailChangeError(null)
    setEmailChangeSuccess(false)

    if (!newEmail.trim() || newEmail.trim() === user?.email) {
      setEmailChangeError('Digite um e-mail diferente do atual.')
      return
    }

    setSendingEmailChange(true)
    const res = await requestEmailChange(newEmail.trim())
    setSendingEmailChange(false)

    if (res.error) {
      setEmailChangeError(res.error.message || 'Erro ao solicitar alteração de e-mail.')
    } else {
      setEmailChangeSuccess(true)
    }
  }

  // Account deletion
  const handleDeleteAccount = async () => {
    if (!user) return
    setDeletingAccount(true)
    try {
      await pb.collection('users').delete(user.id)
      signOut()
      navigate('/entrar')
    } catch (err: any) {
      setDeletingAccount(false)
      setDeleteModalOpen(false)
      alert('Não foi possível excluir sua conta. Entre em contato com o suporte.')
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
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="pb-2 border-b border-[#E5DFE3]">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
          Configurações da Conta
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A73] mt-1">
          Gerencie suas informações pessoais, plano de visibilidade e segurança de acesso.
        </p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="bg-[#F3EEF0] p-1 rounded-xl">
          <TabsTrigger
            value="perfil"
            className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7E3F8F] data-[state=active]:shadow-xs flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            Perfil
          </TabsTrigger>
          {user?.role === 'prestadora' && (
            <TabsTrigger
              value="assinatura"
              className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7E3F8F] data-[state=active]:shadow-xs flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Assinatura
            </TabsTrigger>
          )}
          <TabsTrigger
            value="seguranca"
            className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7E3F8F] data-[state=active]:shadow-xs flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* TAB PERFIL */}
        <TabsContent value="perfil" className="space-y-6">
          <Card className="border-[#E5DFE3] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#FAF7F5]">
              <CardTitle className="text-base font-bold text-[#2D2A32]">Dados do Perfil</CardTitle>
              <CardDescription className="text-xs text-[#6E6A73]">
                {user?.role === 'prestadora'
                  ? 'Essas informações alimentam seu perfil público no catálogo de prestadoras.'
                  : 'Seus dados de contato e identificação no marketplace.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {profileSuccess && (
                <Alert className="text-xs py-2 bg-emerald-50 border-emerald-200 text-[#2E7D32]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <AlertDescription>Perfil atualizado com sucesso!</AlertDescription>
                </Alert>
              )}

              {profileError && (
                <Alert
                  variant="destructive"
                  className="text-xs py-2 bg-red-50 border-red-200 text-red-800"
                >
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pName" className="text-xs font-semibold text-[#2D2A32]">
                      Nome completo
                    </Label>
                    <Input
                      id="pName"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-sm border-[#E5DFE3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pPhone" className="text-xs font-semibold text-[#2D2A32]">
                      WhatsApp / Telefone
                    </Label>
                    <Input
                      id="pPhone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="text-sm border-[#E5DFE3]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pCity" className="text-xs font-semibold text-[#2D2A32]">
                      Cidade
                    </Label>
                    <Input
                      id="pCity"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="text-sm border-[#E5DFE3]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pState" className="text-xs font-semibold text-[#2D2A32]">
                      Estado (UF)
                    </Label>
                    <select
                      id="pState"
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

                <div className="space-y-1.5">
                  <Label htmlFor="pBio" className="text-xs font-semibold text-[#2D2A32]">
                    Biografia e Apresentação
                  </Label>
                  <Textarea
                    id="pBio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte sobre sua trajetória, formação ou o que você busca na plataforma..."
                    className="text-sm border-[#E5DFE3]"
                  />
                </div>

                {user?.role === 'prestadora' && (
                  <>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="pServiceDesc"
                        className="text-xs font-semibold text-[#2D2A32]"
                      >
                        Descrição detalhada dos serviços prestados
                      </Label>
                      <Textarea
                        id="pServiceDesc"
                        rows={4}
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        placeholder="Quais procedimentos você realiza, locais onde atende, diferenciais..."
                        className="text-sm border-[#E5DFE3]"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <Label className="text-xs font-semibold text-[#2D2A32]">
                        Categorias de atendimento
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categoriesList.map((c) => {
                          const isSel = selectedCategories.includes(c.id)
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleCategory(c.id)}
                              className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                                isSel
                                  ? 'border-[#7E3F8F] bg-[#F3EEF0] text-[#7E3F8F]'
                                  : 'border-[#E5DFE3] bg-white text-[#2D2A32]'
                              }`}
                            >
                              {c.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {!user.verified && (
                      <p className="text-xs text-[#6E6A73] italic pt-1">
                        * Alterações relevantes em perfil profissional serão salvas para revisão da
                        nossa curadoria.
                      </p>
                    )}
                  </>
                )}

                <div className="pt-3 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-xs"
                  >
                    {savingProfile ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      'Salvar alterações'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB ASSINATURA (prestadoras) */}
        {user?.role === 'prestadora' && (
          <TabsContent value="assinatura" className="space-y-6">
            <Card className="border-[#E5DFE3] bg-white shadow-xs">
              <CardHeader className="pb-3 border-b border-[#FAF7F5] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-[#2D2A32]">Plano Ativo</CardTitle>
                  <CardDescription className="text-xs text-[#6E6A73]">
                    Gerencie seu nível de visibilidade no catálogo de serviços
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate('/assinar')}
                  className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white text-xs"
                >
                  Alterar plano
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E5DFE3] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#6E6A73]">Plano atual:</span>
                    <h3 className="font-bold text-lg text-[#2D2A32] capitalize">
                      Plano {user.plan || 'Essencial'}
                    </h3>
                    <p className="text-xs text-[#6E6A73] mt-0.5">
                      {user.plan === 'destaque'
                        ? 'Máxima exposição no topo do catálogo e na home'
                        : user.plan === 'profissional'
                          ? 'Orçamentos ilimitados e posição de destaque'
                          : 'Listagem gratuita no catálogo'}
                    </p>
                  </div>
                  <span className="font-bold text-base text-[#2E7D32]">
                    {user.plan === 'destaque'
                      ? 'R$ 99/mês'
                      : user.plan === 'profissional'
                        ? 'R$ 49/mês'
                        : 'R$ 0/mês'}
                  </span>
                </div>

                <div className="pt-2">
                  <h4 className="font-semibold text-xs text-[#2D2A32] mb-2">
                    Histórico de cobrança
                  </h4>
                  <div className="border border-[#E5DFE3] rounded-xl overflow-hidden divide-y divide-[#FAF7F5] text-xs">
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-[#6E6A73]">Renovação mensal</span>
                      <span className="font-medium text-[#2D2A32]">Confirmado</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB SEGURANÇA */}
        <TabsContent value="seguranca" className="space-y-6">
          {/* Troca de senha */}
          <Card className="border-[#E5DFE3] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#FAF7F5]">
              <CardTitle className="text-base font-bold text-[#2D2A32]">
                Alterar senha de acesso
              </CardTitle>
              <CardDescription className="text-xs text-[#6E6A73]">
                Mantenha sua conta protegida com uma senha forte e única
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {passwordSuccess && (
                <Alert className="text-xs py-2 bg-emerald-50 border-emerald-200 text-[#2E7D32] mb-4">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <AlertDescription>Senha alterada com sucesso!</AlertDescription>
                </Alert>
              )}

              {passwordError && (
                <Alert
                  variant="destructive"
                  className="text-xs py-2 bg-red-50 border-red-200 text-red-800 mb-4"
                >
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#2D2A32]">Senha atual</Label>
                  <Input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-xs border-[#E5DFE3]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#2D2A32]">Nova senha</Label>
                  <Input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="text-xs border-[#E5DFE3]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#2D2A32]">
                    Confirmar nova senha
                  </Label>
                  <Input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="text-xs border-[#E5DFE3]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={savingPassword}
                  className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white text-xs mt-2"
                >
                  {savingPassword ? 'Atualizando...' : 'Atualizar senha'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Troca de e-mail */}
          <Card className="border-[#E5DFE3] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#FAF7F5]">
              <CardTitle className="text-base font-bold text-[#2D2A32]">
                Alterar endereço de e-mail
              </CardTitle>
              <CardDescription className="text-xs text-[#6E6A73]">
                E-mail atual: <strong>{user?.email}</strong>. Um link de confirmação será enviado
                para o novo endereço.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {emailChangeSuccess && (
                <Alert className="text-xs py-2 bg-emerald-50 border-emerald-200 text-[#2E7D32] mb-4">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <AlertDescription>
                    Link de confirmação enviado para <strong>{newEmail}</strong>. Verifique sua
                    caixa de entrada para autorizar a troca.
                  </AlertDescription>
                </Alert>
              )}

              {emailChangeError && (
                <Alert
                  variant="destructive"
                  className="text-xs py-2 bg-red-50 border-red-200 text-red-800 mb-4"
                >
                  <AlertDescription>{emailChangeError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRequestEmailChange} className="space-y-3 max-w-md">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#2D2A32]">Novo e-mail</Label>
                  <Input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="novo.email@exemplo.com.br"
                    className="text-xs border-[#E5DFE3]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sendingEmailChange}
                  className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white text-xs"
                >
                  {sendingEmailChange ? 'Enviando...' : 'Solicitar troca de e-mail'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Excluir conta */}
          <Card className="border-red-200 bg-red-50/30 shadow-xs">
            <CardHeader className="pb-3 border-b border-red-100">
              <CardTitle className="text-base font-bold text-red-700 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                Zona de perigo: Excluir conta
              </CardTitle>
              <CardDescription className="text-xs text-red-600/80">
                A exclusão da sua conta remove permanentemente seu perfil e dados do catálogo. Esta
                ação é irreversível.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                Excluir minha conta definitivamente
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[420px] bg-white p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Tem certeza que deseja excluir?
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6E6A73] pt-1">
              Todos os seus orçamentos, mensagens e histórico na Conexão Feminina serão apagados e
              não poderão ser recuperados.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              className="border-[#E5DFE3]"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deletingAccount}
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingAccount ? 'Excluindo...' : 'Sim, excluir definitivamente'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
