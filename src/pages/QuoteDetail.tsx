import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getQuoteById } from '@/services/quotes'
import type { QuoteRecord } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function QuoteDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [quote, setQuote] = useState<QuoteRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getQuoteById(id).then((q) => {
      setQuote(q)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-[#6E6A73]">Carregando linha do tempo...</div>
    )
  }

  if (!quote) {
    return (
      <div className="py-12 text-center space-y-3">
        <h2 className="text-lg font-bold text-[#2D2A32]">Orçamento não encontrado</h2>
        <Button asChild variant="outline">
          <Link to="/orcamentos">Voltar aos orçamentos</Link>
        </Button>
      </div>
    )
  }

  const clientName = quote.expand?.client?.name || 'Cliente'
  const providerName = quote.expand?.provider?.name || 'Prestadora'

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in pb-10">
      <div>
        <Link
          to="/orcamentos"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6A73] hover:text-[#7E3F8F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para a lista de orçamentos
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5DFE3] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#FAF7F5]">
          <div>
            <h1 className="text-xl font-bold text-[#2D2A32]">Linha do Tempo do Orçamento</h1>
            <p className="text-xs text-[#6E6A73] mt-0.5">
              Protocolo #{quote.id} • Criado em{' '}
              {new Date(quote.created).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <Button asChild size="sm" className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white">
            <Link to="/mensagens">
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Abrir conversa
            </Link>
          </Button>
        </div>

        {/* Timeline items */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5DFE3]">
          {/* Step 1: Request sent */}
          <div className="relative space-y-1.5">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#7E3F8F] text-white flex items-center justify-center text-[10px] ring-4 ring-white">
              1
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#2D2A32]">
                Solicitação enviada por {clientName}
              </span>
              <span className="text-[11px] text-[#6E6A73]">
                {new Date(quote.created).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-xs text-[#6E6A73] bg-[#FAF7F5] p-3 rounded-xl border border-[#E5DFE3] whitespace-pre-line">
              {quote.description}
            </p>
            {quote.preferred_date && (
              <p className="text-xs text-[#6E6A73] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#7E3F8F]" />
                Data de preferência: {new Date(quote.preferred_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          {/* Step 2: Provider response */}
          <div className="relative space-y-1.5">
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-4 ring-white ${
                quote.price ? 'bg-[#7E3F8F] text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              2
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#2D2A32]">Resposta de {providerName}</span>
              {quote.price && (
                <span className="text-[11px] text-[#6E6A73]">
                  {new Date(quote.updated).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            {quote.price ? (
              <div className="p-3 rounded-xl bg-[#F3EEF0] border border-[#E5DFE3] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7E3F8F]">Proposta de valor:</span>
                  <span className="text-base font-bold text-[#2E7D32]">
                    R$ {quote.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {quote.response && (
                  <p className="text-xs text-[#6E6A73] leading-relaxed whitespace-pre-line">
                    {quote.response}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#6E6A73] italic">
                Aguardando envio de valores e condições pela prestadora.
              </p>
            )}
          </div>

          {/* Step 3: Approval or Rejection */}
          <div className="relative space-y-1.5">
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-4 ring-white ${
                quote.status === 'aprovado' || quote.status === 'concluido'
                  ? 'bg-[#2E7D32] text-white'
                  : quote.status === 'recusado'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              3
            </div>
            <span className="font-bold text-sm text-[#2D2A32]">
              Decisão da Cliente ({clientName})
            </span>
            {quote.status === 'aprovado' || quote.status === 'concluido' ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#2E7D32] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Orçamento aprovado pela cliente! O serviço está confirmado para realização.
                </span>
              </div>
            ) : quote.status === 'recusado' ? (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Proposta recusada pela cliente.</span>
              </div>
            ) : (
              <p className="text-xs text-[#6E6A73] italic">
                A cliente avaliará a proposta assim que o valor for enviado.
              </p>
            )}
          </div>

          {/* Step 4: Completion */}
          {(quote.status === 'concluido' || quote.status === 'aprovado') && (
            <div className="relative space-y-1.5">
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ring-4 ring-white ${
                  quote.status === 'concluido'
                    ? 'bg-[#7E3F8F] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                4
              </div>
              <span className="font-bold text-sm text-[#2D2A32]">Conclusão do Serviço</span>
              {quote.status === 'concluido' ? (
                <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3] text-xs text-[#2D2A32]">
                  Serviço marcado como concluído pela prestadora com sucesso.
                </div>
              ) : (
                <p className="text-xs text-[#6E6A73] italic">
                  Aguardando execução do atendimento e marcação de conclusão.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
