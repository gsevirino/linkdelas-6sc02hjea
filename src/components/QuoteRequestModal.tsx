import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  X,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { createQuote } from '@/services/quotes'
import type { ProviderRecord } from '@/types/database'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface QuoteRequestModalProps {
  provider: ProviderRecord
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function QuoteRequestModal({
  provider,
  open,
  onOpenChange,
}: QuoteRequestModalProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>(provider.categories?.[0] || '')
  const [description, setDescription] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const providerName = provider.expand?.user?.name || 'Prestadora'
  const categoriesList = provider.expand?.categories || []

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!user) {
      // Redirect to sign in preserving context
      navigate('/entrar', { state: { from: { pathname: `/prestadoras/${provider.id}` } } })
      return
    }

    if (description.trim().length < 20) {
      setErrorMsg(
        'Por favor, descreva sua necessidade com mais detalhes (mínimo de 20 caracteres).',
      )
      return
    }

    setStep(2)
  }

  const handleFinalSubmit = async () => {
    setErrorMsg(null)
    setLoading(true)

    try {
      await createQuote({
        providerId: provider.user,
        categoryId: selectedCategory || undefined,
        description: description.trim(),
        preferredDate: preferredDate || undefined,
        attachmentFile: attachmentFile || undefined,
      })
      setLoading(false)
      setStep(3)
    } catch (err: any) {
      setLoading(false)
      setErrorMsg(err.message || 'Erro ao enviar solicitação de orçamento. Tente novamente.')
    }
  }

  const handleResetAndClose = () => {
    setDescription('')
    setPreferredDate('')
    setAttachmentFile(null)
    setStep(1)
    setErrorMsg(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-white p-6 max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <DialogHeader className="pb-3 border-b border-[#FAF7F5]">
              <DialogTitle className="text-xl font-bold text-[#2D2A32]">
                Solicitar orçamento
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6E6A73]">
                Envie os detalhes do serviço que você precisa para{' '}
                <strong className="text-[#7E3F8F]">{providerName}</strong>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleStep1Next} className="space-y-4 pt-3">
              {errorMsg && (
                <Alert
                  variant="destructive"
                  className="text-xs py-2 bg-red-50 border-red-200 text-red-800"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}

              {/* Prestadora fixa */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-[#6E6A73]">
                  Prestadora de Serviço
                </Label>
                <div className="p-2.5 rounded-lg bg-[#FAF7F5] border border-[#E5DFE3] text-sm font-medium text-[#2D2A32] flex items-center justify-between">
                  <span>{providerName}</span>
                  <span className="text-xs text-[#6E6A73]">
                    {provider.city || 'Atendimento local'}
                  </span>
                </div>
              </div>

              {/* Categoria */}
              {categoriesList.length > 0 && (
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold text-[#2D2A32]">
                    Categoria do serviço
                  </Label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 text-sm rounded-md border border-[#E5DFE3] bg-white focus:outline-none focus:ring-2 focus:ring-[#7E3F8F]"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Descrição */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="description" className="text-xs font-semibold text-[#2D2A32]">
                    Descreva o que você precisa *
                  </Label>
                  <span
                    className={`text-[11px] ${
                      description.trim().length >= 20 ? 'text-[#2E7D32]' : 'text-[#6E6A73]'
                    }`}
                  >
                    {description.trim().length}/20 min
                  </span>
                </div>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Gostaria de saber os valores para um pacote de 4 sessões de drenagem linfática com atendimento domiciliar em Moema durante as terças-feiras..."
                  className="text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
                />
              </div>

              {/* Data preferencial */}
              <div className="space-y-1.5">
                <Label htmlFor="preferredDate" className="text-xs font-semibold text-[#2D2A32]">
                  Data preferencial para atendimento (opcional)
                </Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
                  <Input
                    id="preferredDate"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="pl-9 text-sm border-[#E5DFE3]"
                  />
                </div>
              </div>

              {/* Anexo opcional */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#2D2A32]">
                  Anexar imagem de referência ou documento (opcional, até 5MB)
                </Label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 border border-dashed border-[#E5DFE3] rounded-lg p-3 text-center cursor-pointer hover:border-[#7E3F8F]/50 transition-colors bg-[#FAF7F5]">
                    <Upload className="w-4 h-4 mx-auto text-[#6E6A73] mb-1" />
                    <span className="text-xs text-[#6E6A73] block truncate">
                      {attachmentFile ? attachmentFile.name : 'Selecionar arquivo do dispositivo'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAttachmentFile(e.target.files[0])
                        }
                      }}
                    />
                  </label>
                  {attachmentFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAttachmentFile(null)}
                      className="text-red-600 p-2 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-[#E5DFE3]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-xs"
                >
                  Revisar solicitação
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader className="pb-3 border-b border-[#FAF7F5]">
              <DialogTitle className="text-xl font-bold text-[#2D2A32]">
                Revise sua solicitação
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6E6A73]">
                Confira os detalhes antes de enviar para a prestadora
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-3 text-xs text-[#2D2A32]">
              {errorMsg && (
                <Alert variant="destructive" className="py-2 bg-red-50 border-red-200 text-red-800">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <AlertDescription>{errorMsg}</AlertDescription>
                </Alert>
              )}

              <div className="p-3 rounded-lg bg-[#FAF7F5] border border-[#E5DFE3] space-y-2">
                <div>
                  <span className="text-[#6E6A73] block">Prestadora:</span>
                  <span className="font-semibold text-sm text-[#7E3F8F]">{providerName}</span>
                </div>
                <div>
                  <span className="text-[#6E6A73] block">Descrição:</span>
                  <p className="whitespace-pre-line text-[#2D2A32] mt-0.5">{description}</p>
                </div>
                {preferredDate && (
                  <div>
                    <span className="text-[#6E6A73] block">Data preferencial:</span>
                    <span className="font-medium text-[#2D2A32]">
                      {new Date(preferredDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                {attachmentFile && (
                  <div>
                    <span className="text-[#6E6A73] block">Arquivo anexado:</span>
                    <span className="font-medium text-[#2D2A32] flex items-center gap-1 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-[#7E3F8F]" />
                      {attachmentFile.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F3EEF0] flex items-center gap-2 text-[#7E3F8F] text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  Nenhum valor é cobrado agora. A prestadora responderá com a proposta de preço e
                  disponibilidade diretamente na sua aba de Orçamentos.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="border-[#E5DFE3]"
                >
                  Voltar e editar
                </Button>
                <Button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-xs"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    'Enviar solicitação'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-[#2D2A32]">
                Sua solicitação foi enviada!
              </DialogTitle>
              <p className="text-xs text-[#6E6A73]">
                {providerName} foi notificada e responderá seu orçamento em breve.
              </p>
            </div>
            <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={handleResetAndClose} className="border-[#E5DFE3]">
                Continuar navegando
              </Button>
              <Button
                onClick={() => {
                  handleResetAndClose()
                  navigate('/orcamentos')
                }}
                className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white"
              >
                Acompanhar no meu orçamento
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
