import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Search,
  FileText,
  Calendar,
  Star,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  Share2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getProviders } from '@/services/providers'
import { getQuotes } from '@/services/quotes'
import type { ProviderRecord, QuoteRecord } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import QuoteRequestModal from '@/components/QuoteRequestModal'

export default function Index() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  const [recommendedProviders, setRecommendedProviders] = useState<ProviderRecord[]>([])
  const [recentQuotes, setRecentQuotes] = useState<QuoteRecord[]>([])
  const [selectedProviderForQuote, setSelectedProviderForQuote] = useState<ProviderRecord | null>(
    null,
  )
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const isProvider = user?.role === 'prestadora'

  useEffect(() => {
    // If not authenticated and not loading, redirect to sign in as specified:
    // "/entrar (login, é a home de quem não está logado)"
    if (!isLoading && !user) {
      navigate('/entrar', { replace: true })
      return
    }

    if (user) {
      setLoadingData(true)
      Promise.all([getProviders({ sort: 'relevance' }), getQuotes()]).then(
        ([provs, quotesList]) => {
          setRecommendedProviders(provs.slice(0, 6))
          setRecentQuotes(quotesList.slice(0, 4))
          setLoadingData(false)
        },
      )
    }
  }, [user, isLoading, navigate])

  if (isLoading || loadingData) {
    return (
      <div className="space-y-6 py-6 animate-pulse">
        <div className="h-28 rounded-3xl bg-white border border-[#E5DFE3]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 rounded-2xl bg-white" />
          <div className="h-32 rounded-2xl bg-white" />
          <div className="h-32 rounded-2xl bg-white" />
        </div>
      </div>
    )
  }

  // PRESTADORA VIEW
  if (isProvider) {
    const isApproved = user.status === 'approved'
    const newQuotesCount = recentQuotes.filter((q) => q.status === 'pendente').length
    const answeredCount = recentQuotes.filter(
      (q) => q.status === 'respondido' || q.status === 'aprovado',
    ).length
    const estimatedRevenue = recentQuotes
      .filter((q) => q.status === 'aprovado' || q.status === 'concluido')
      .reduce((acc, q) => acc + (q.price || 0), 0)

    return (
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header Greeting & Plan badge */}
        <div className="bg-white rounded-3xl border border-[#E5DFE3] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
                Olá, {user.name}
              </h1>
              {user.verified && (
                <span title="Perfil Verificado">
                  <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#6E6A73] mt-1">
              Painel de gestão de serviços e solicitações profissionais
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-xs uppercase font-bold px-3 py-1 bg-[#FAF7F5] border-[#E5DFE3] text-[#7E3F8F]"
            >
              Plano {user.plan || 'Essencial'}
            </Badge>
            {user.verified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2E7D32] border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verificada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Em análise
              </span>
            )}
          </div>
        </div>

        {/* Pending verification banner if not approved */}
        {!isApproved && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-900">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-900">Seu perfil está em análise</h3>
                <p className="text-amber-800/90 leading-relaxed mt-0.5 max-w-xl">
                  Normalmente analisamos os dados e documentos em até 48h úteis. Enquanto isso, você
                  já pode configurar seu perfil e responder propostas recebidas.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-900 bg-white hover:bg-amber-100/50"
            >
              <Link to="/configuracoes">Acompanhar status</Link>
            </Button>
          </div>
        )}

        {/* Prestadora Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#E5DFE3] bg-white shadow-2xs">
            <CardHeader className="pb-1 p-4">
              <CardDescription className="text-xs text-[#6E6A73]">
                Novas solicitações
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-[#7E3F8F]">{newQuotesCount}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <span className="text-[11px] text-[#6E6A73]">Aguardando sua proposta</span>
            </CardContent>
          </Card>

          <Card className="border-[#E5DFE3] bg-white shadow-2xs">
            <CardHeader className="pb-1 p-4">
              <CardDescription className="text-xs text-[#6E6A73]">
                Orçamentos respondidos
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-[#2D2A32]">{answeredCount}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <span className="text-[11px] text-[#6E6A73]">Propostas enviadas</span>
            </CardContent>
          </Card>

          <Card className="border-[#E5DFE3] bg-white shadow-2xs">
            <CardHeader className="pb-1 p-4">
              <CardDescription className="text-xs text-[#6E6A73]">Receita aprovada</CardDescription>
              <CardTitle className="text-2xl font-bold text-[#2E7D32]">
                R$ {estimatedRevenue.toFixed(0)}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <span className="text-[11px] text-[#6E6A73]">Orçamentos aprovados</span>
            </CardContent>
          </Card>

          <Card className="border-[#E5DFE3] bg-white shadow-2xs">
            <CardHeader className="pb-1 p-4">
              <CardDescription className="text-xs text-[#6E6A73]">Avaliação média</CardDescription>
              <CardTitle className="text-2xl font-bold text-amber-500 flex items-center gap-1">
                <span>5.0</span>
                <Star className="w-5 h-5 fill-amber-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <span className="text-[11px] text-[#6E6A73]">Reputação excelente</span>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/orcamentos"
            className="p-5 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-all hover:-translate-y-0.5 shadow-2xs flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors">
                Responder Orçamentos
              </h4>
              <p className="text-xs text-[#6E6A73]">Acesse a caixa de entrada de novos pedidos</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7E3F8F]" />
          </Link>

          <Link
            to="/assinar"
            className="p-5 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-all hover:-translate-y-0.5 shadow-2xs flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors">
                Destacar meu Perfil
              </h4>
              <p className="text-xs text-[#6E6A73]">
                Suba para o topo das buscas com o Plano Destaque
              </p>
            </div>
            <Sparkles className="w-4 h-4 text-[#E9C46A]" />
          </Link>

          <Link
            to="/configuracoes"
            className="p-5 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-all hover:-translate-y-0.5 shadow-2xs flex items-center justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors">
                Editar meu Perfil Público
              </h4>
              <p className="text-xs text-[#6E6A73]">Atualize bio, fotos e categorias atendidas</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7E3F8F]" />
          </Link>
        </div>

        {/* Recent Quotes */}
        <Card className="border-[#E5DFE3] bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-[#FAF7F5] flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#2D2A32]">
                Últimos pedidos de orçamento
              </CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-[#7E3F8F]">
              <Link to="/orcamentos">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-[#FAF7F5]">
            {recentQuotes.length === 0 ? (
              <p className="text-xs text-[#6E6A73] py-4 text-center">
                Nenhum orçamento recebido até o momento.
              </p>
            ) : (
              recentQuotes.slice(0, 3).map((q) => (
                <div key={q.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-xs text-[#2D2A32]">
                      {q.expand?.client?.name || 'Cliente'}
                    </p>
                    <p className="text-[11px] text-[#6E6A73] line-clamp-1">{q.description}</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="text-xs border-[#E5DFE3]">
                    <Link to="/orcamentos">Ver</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // CLIENTE VIEW
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Greeting */}
      <div className="bg-white rounded-3xl border border-[#E5DFE3] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
            Olá, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E6A73]">
            Encontre serviços confiáveis prestados exclusivamente por mulheres verificadas.
          </p>
        </div>

        <Button
          asChild
          className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white px-5 py-2.5 shadow-xs font-medium"
        >
          <Link to="/catalogo">
            <Search className="w-4 h-4 mr-1.5" />
            Explorar catálogo
          </Link>
        </Button>
      </div>

      {/* Quick Actions Row: 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/catalogo"
          className="p-5 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-all hover:-translate-y-1 shadow-2xs flex flex-col justify-between group h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors">
              Encontrar prestadora
            </h4>
            <p className="text-xs text-[#6E6A73] mt-0.5">
              Busque por especialidade, cidade ou avaliação
            </p>
          </div>
        </Link>

        <Link
          to="/orcamentos"
          className="p-5 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-all hover:-translate-y-1 shadow-2xs flex flex-col justify-between group h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors">
              Meus orçamentos
            </h4>
            <p className="text-xs text-[#6E6A73] mt-0.5">Acompanhe respostas e aprove propostas</p>
          </div>
        </Link>

        <Link
          to="/mensagens"
          className="p-5 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-all hover:-translate-y-1 shadow-2xs flex flex-col justify-between group h-36"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#E8B4B8]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors">
              Chat direto
            </h4>
            <p className="text-xs text-[#6E6A73] mt-0.5">
              Tire dúvidas e negocie com as profissionais
            </p>
          </div>
        </Link>
      </div>

      {/* Recommended Providers: Horizontal scrollable carousel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2D2A32]">Prestadoras recomendadas para você</h2>
            <p className="text-xs text-[#6E6A73]">
              Profissionais em destaque com altas avaliações e verificação ativa
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-[#7E3F8F]">
            <Link to="/catalogo">
              Ver todas
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProviders.map((p) => {
            const u = p.expand?.user
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-white border border-[#E5DFE3] hover:border-[#7E3F8F]/40 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#7E3F8F] text-white font-bold text-xs">
                      {u?.name
                        ? u.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                        : 'CF'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-sm text-[#2D2A32] truncate">{u?.name}</h4>
                      {u?.verified && <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#6E6A73] truncate">
                      {p.city ? `${p.city}, ${p.state}` : 'Brasil'}
                    </p>
                    <div className="flex items-center text-amber-500 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      <span>{p.rating_avg ? p.rating_avg.toFixed(1) : '5.0'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6E6A73] line-clamp-2 leading-relaxed">
                  {p.service_description || 'Serviços especializados com foco no público feminino.'}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-xs border-[#E5DFE3] bg-white"
                  >
                    <Link to={`/prestadoras/${p.id}`}>Ver perfil</Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProviderForQuote(p)
                      setQuoteModalOpen(true)
                    }}
                    className="text-xs bg-[#7E3F8F] hover:bg-[#6B347A] text-white"
                  >
                    Orçamento
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recent quotes section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#2D2A32]">Seus orçamentos recentes</h2>
          <Button asChild variant="ghost" size="sm" className="text-xs text-[#7E3F8F]">
            <Link to="/orcamentos">Ver histórico completo</Link>
          </Button>
        </div>

        <Card className="border-[#E5DFE3] bg-white shadow-xs">
          <CardContent className="p-4 divide-y divide-[#FAF7F5]">
            {recentQuotes.length === 0 ? (
              <p className="text-xs text-[#6E6A73] text-center py-4">
                Você ainda não solicitou nenhum orçamento.
              </p>
            ) : (
              recentQuotes.slice(0, 3).map((q) => (
                <div key={q.id} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-xs text-[#2D2A32]">
                      Prestadora: {q.expand?.provider?.name || 'Profissional'}
                    </p>
                    <p className="text-[11px] text-[#6E6A73] line-clamp-1">{q.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] capitalize border-[#E5DFE3]">
                      {q.status}
                    </Badge>
                    <Button asChild size="sm" variant="ghost" className="text-xs text-[#7E3F8F]">
                      <Link to={`/orcamentos/${q.id}`}>Ver</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* Modal quote */}
      {selectedProviderForQuote && (
        <QuoteRequestModal
          provider={selectedProviderForQuote}
          open={quoteModalOpen}
          onOpenChange={setQuoteModalOpen}
        />
      )}
    </div>
  )
}
