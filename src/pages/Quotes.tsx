import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  Eye,
  Check,
  X,
  Send,
  Loader2,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getQuotes, respondQuote, updateQuoteStatus } from '@/services/quotes'
import { useRealtime } from '@/hooks/use-realtime'
import type { QuoteRecord, QuoteStatus } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function Quotes() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isProvider = user?.role === 'prestadora'
  const [activeTab, setActiveTab] = useState<string>(isProvider ? 'recebidos' : 'enviados')
  const [quotes, setQuotes] = useState<QuoteRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Respond Modal state (for providers)
  const [selectedQuoteToRespond, setSelectedQuoteToRespond] = useState<QuoteRecord | null>(null)
  const [respondPrice, setRespondPrice] = useState<string>('')
  const [respondMessage, setRespondMessage] = useState<string>('')
  const [submittingResponse, setSubmittingResponse] = useState(false)

  // Load quotes
  const fetchQuotes = () => {
    if (!user) return
    getQuotes().then((data) => {
      setQuotes(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchQuotes()
  }, [user])

  // Realtime subscription for quotes updates
  useRealtime<QuoteRecord>('quotes', () => {
    fetchQuotes()
  })

  // Filter sent vs received
  const sentQuotes = quotes.filter((q) => q.client === user?.id)
  const receivedQuotes = quotes.filter((q) => q.provider === user?.id)

  const handleApproveQuote = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'aprovado')
    fetchQuotes()
  }

  const handleRejectQuote = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'recusado')
    fetchQuotes()
  }

  const handleCompleteQuote = async (quoteId: string) => {
    await updateQuoteStatus(quoteId, 'concluido')
    fetchQuotes()
  }

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuoteToRespond) return
    const priceNum = parseFloat(respondPrice.replace(',', '.'))
    if (isNaN(priceNum) || priceNum <= 0) return

    setSubmittingResponse(true)
    await respondQuote(selectedQuoteToRespond.id, priceNum, respondMessage.trim())
    setSubmittingResponse(false)
    setSelectedQuoteToRespond(null)
    setRespondPrice('')
    setRespondMessage('')
    fetchQuotes()
  }

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'pendente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        )
      case 'respondido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-3 h-3" />
            Respondido
          </span>
        )
      case 'aprovado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#2E7D32] border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Aprovado
          </span>
        )
      case 'recusado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Recusado
          </span>
        )
      case 'concluido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#7E3F8F] border border-purple-200">
            <CheckCircle2 className="w-3 h-3" />
            Concluído
          </span>
        )
    }
  }

  const renderQuoteCard = (q: QuoteRecord, viewType: 'client' | 'provider') => {
    const isPending = q.status === 'pendente'
    const isAnswered = q.status === 'respondido'
    const isApproved = q.status === 'aprovado'
    const otherPerson = viewType === 'client' ? q.expand?.provider : q.expand?.client

    return (
      <div
        key={q.id}
        className={`bg-white rounded-2xl border transition-all p-5 shadow-xs space-y-4 ${
          viewType === 'provider' && isPending
            ? 'border-l-4 border-l-[#E8B4B8] border-t-[#E5DFE3] border-r-[#E5DFE3] border-b-[#E5DFE3]'
            : 'border-[#E5DFE3]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FAF7F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center font-bold text-xs">
              {otherPerson?.name?.[0] || (viewType === 'client' ? 'P' : 'C')}
            </div>
            <div>
              <p className="font-semibold text-sm text-[#2D2A32] leading-tight">
                {viewType === 'client' ? 'Prestadora: ' : 'Cliente: '}
                <span className="text-[#7E3F8F]">{otherPerson?.name || 'Usuária'}</span>
              </p>
              <p className="text-[11px] text-[#6E6A73]">
                Enviado em {new Date(q.created).toLocaleDateString('pt-BR')} às{' '}
                {new Date(q.created).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(q.status)}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-[#6E6A73] hover:text-[#7E3F8F]"
            >
              <Link to={`/orcamentos/${q.id}`}>
                <Eye className="w-3.5 h-3.5 mr-1" />
                Linha do tempo
              </Link>
            </Button>
          </div>
        </div>

        {/* Description & Details */}
        <div className="space-y-2 text-xs text-[#2D2A32]">
          {q.expand?.category && (
            <span className="inline-block px-2 py-0.5 rounded-md bg-[#FAF7F5] border border-[#E5DFE3] text-[11px] text-[#7E3F8F] font-medium">
              {q.expand.category.name}
            </span>
          )}

          <p className="text-sm text-[#2D2A32] leading-relaxed whitespace-pre-line bg-[#FAF7F5] p-3 rounded-xl border border-[#E5DFE3]">
            {q.description}
          </p>

          {q.preferred_date && (
            <p className="text-xs text-[#6E6A73] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7E3F8F]" />
              Data pretendida: {new Date(q.preferred_date).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Response section if answered or approved */}
        {(isAnswered || isApproved || q.status === 'concluido') && q.price && (
          <div className="p-3.5 rounded-xl bg-[#F3EEF0]/60 border border-[#E5DFE3] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#7E3F8F]">Proposta da Prestadora:</span>
              <span className="text-base font-bold text-[#2E7D32]">
                R$ {q.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
            {q.response && (
              <p className="text-xs text-[#6E6A73] leading-relaxed whitespace-pre-line">
                {q.response}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#FAF7F5]">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs border-[#E5DFE3] text-[#2D2A32] hover:bg-[#FAF7F5]"
            >
              <Link to={`/mensagens`}>
                <MessageSquare className="w-3.5 h-3.5 mr-1 text-[#7E3F8F]" />
                Abrir chat
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Client actions on responded */}
            {viewType === 'client' && isAnswered && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRejectQuote(q.id)}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Recusar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApproveQuote(q.id)}
                  className="text-xs bg-[#2E7D32] hover:bg-[#256629] text-white"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Aprovar orçamento
                </Button>
              </>
            )}

            {/* Provider actions on pending */}
            {viewType === 'provider' && isPending && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedQuoteToRespond(q)
                  setRespondPrice('')
                  setRespondMessage('')
                }}
                className="text-xs bg-[#7E3F8F] hover:bg-[#6B347A] text-white"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Responder proposta
              </Button>
            )}

            {/* Provider mark as complete when approved */}
            {viewType === 'provider' && isApproved && (
              <Button
                size="sm"
                onClick={() => handleCompleteQuote(q.id)}
                className="text-xs bg-[#7E3F8F] hover:bg-[#6B347A] text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Marcar como concluído
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5DFE3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
            Central de Orçamentos
          </h1>
          <p className="text-sm text-[#6E6A73] mt-1">
            Gerencie todas as suas solicitações, propostas de valor e negociações diretas.
          </p>
        </div>

        <Button asChild variant="outline" className="border-[#E5DFE3] self-start sm:self-auto">
          <Link to="/catalogo">
            <Sparkles className="w-4 h-4 mr-1.5 text-[#7E3F8F]" />
            Explorar catálogo
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-[#F3EEF0] p-1 rounded-xl">
          <TabsTrigger
            value="enviados"
            className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7E3F8F] data-[state=active]:shadow-xs"
          >
            Enviados por mim ({sentQuotes.length})
          </TabsTrigger>
          <TabsTrigger
            value="recebidos"
            className="text-xs font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#7E3F8F] data-[state=active]:shadow-xs"
          >
            Recebidos ({receivedQuotes.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Enviados */}
        <TabsContent value="enviados" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          ) : sentQuotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5DFE3] p-10 text-center space-y-3">
              <FileText className="w-10 h-10 text-[#6E6A73] mx-auto" />
              <h3 className="font-bold text-base text-[#2D2A32]">Nenhum orçamento enviado</h3>
              <p className="text-xs text-[#6E6A73] max-w-sm mx-auto">
                Você ainda não solicitou nenhum orçamento. Visite os perfis das prestadoras no
                catálogo e envie sua primeira proposta.
              </p>
              <Button asChild className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white">
                <Link to="/catalogo">Buscar prestadoras agora</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">{sentQuotes.map((q) => renderQuoteCard(q, 'client'))}</div>
          )}
        </TabsContent>

        {/* Tab Recebidos */}
        <TabsContent value="recebidos" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          ) : receivedQuotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5DFE3] p-10 text-center space-y-3">
              <FileText className="w-10 h-10 text-[#6E6A73] mx-auto" />
              <h3 className="font-bold text-base text-[#2D2A32]">Nenhum orçamento recebido</h3>
              <p className="text-xs text-[#6E6A73] max-w-sm mx-auto">
                {isProvider
                  ? 'Você ainda não recebeu pedidos de orçamento. Mantenha seu perfil completo e destaque seu trabalho para atrair mais clientes.'
                  : 'Esta aba exibe solicitações enviadas para você como profissional.'}
              </p>
              {isProvider && (
                <Button asChild variant="outline" className="border-[#E5DFE3]">
                  <Link to="/assinar">Conhecer planos de destaque</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {receivedQuotes.map((q) => renderQuoteCard(q, 'provider'))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Provider Reply Modal */}
      <Dialog
        open={Boolean(selectedQuoteToRespond)}
        onOpenChange={(open) => {
          if (!open) setSelectedQuoteToRespond(null)
        }}
      >
        <DialogContent className="sm:max-w-[480px] bg-white p-6">
          <DialogHeader className="pb-3 border-b border-[#FAF7F5]">
            <DialogTitle className="text-lg font-bold text-[#2D2A32]">
              Enviar proposta de orçamento
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6E6A73]">
              Informe o preço estimado e detalhes de execução para{' '}
              {selectedQuoteToRespond?.expand?.client?.name || 'a cliente'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendResponse} className="space-y-4 pt-3">
            <div className="p-3 rounded-lg bg-[#FAF7F5] border border-[#E5DFE3] text-xs text-[#6E6A73]">
              <span className="font-semibold text-[#2D2A32] block mb-1">Solicitação:</span>
              <p className="line-clamp-3 text-[#2D2A32]">{selectedQuoteToRespond?.description}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold text-[#2D2A32]">
                Valor total do serviço (R$) *
              </Label>
              <Input
                id="price"
                required
                type="number"
                step="0.01"
                min="1"
                value={respondPrice}
                onChange={(e) => setRespondPrice(e.target.value)}
                placeholder="Ex: 180.00"
                className="text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="response" className="text-xs font-semibold text-[#2D2A32]">
                Mensagem explicativa e condições (opcional)
              </Label>
              <Textarea
                id="response"
                rows={3}
                value={respondMessage}
                onChange={(e) => setRespondMessage(e.target.value)}
                placeholder="Ex: O valor inclui material próprio e até 2 horas de atendimento domiciliar. Disponibilidade para a próxima quinta-feira às 14h."
                className="text-sm border-[#E5DFE3] focus-visible:ring-[#7E3F8F]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedQuoteToRespond(null)}
                className="border-[#E5DFE3]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingResponse || !respondPrice}
                className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-xs"
              >
                {submittingResponse ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  'Enviar resposta'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
