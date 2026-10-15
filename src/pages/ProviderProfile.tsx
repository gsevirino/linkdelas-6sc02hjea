import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Sparkles,
  MessageSquare,
  FileText,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Info,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getProviderById } from '@/services/providers'
import { getProviderReviews, createReview } from '@/services/reviews'
import type { ProviderRecord, ReviewRecord } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import QuoteRequestModal from '@/components/QuoteRequestModal'

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [provider, setProvider] = useState<ProviderRecord | null>(null)
  const [reviews, setReviews] = useState<ReviewRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getProviderById(id).then((p) => {
      setProvider(p)
      if (p?.user) {
        getProviderReviews(p.user).then(setReviews)
      }
      setLoading(false)
    })
  }, [id])

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!provider?.user) return
    setSubmittingReview(true)
    try {
      await createReview({
        providerUserId: provider.user,
        rating: newRating,
        comment: newComment.trim(),
      })
      const updated = await getProviderReviews(provider.user)
      setReviews(updated)
      setReviewModalOpen(false)
      setNewComment('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 space-y-6 animate-pulse">
        <div className="h-48 rounded-2xl bg-white border border-[#E5DFE3]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-72 rounded-2xl bg-white border border-[#E5DFE3]" />
          <div className="h-60 rounded-2xl bg-white border border-[#E5DFE3]" />
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#2D2A32]">Prestadora não encontrada</h2>
        <p className="text-xs text-[#6E6A73]">
          O perfil solicitado pode ter sido desativado ou o endereço está incorreto.
        </p>
        <Button asChild variant="outline" className="border-[#E5DFE3]">
          <Link to="/catalogo">Voltar ao catálogo</Link>
        </Button>
      </div>
    )
  }

  const u = provider.expand?.user
  const isVerified = u?.verified || false
  const isDestaque = u?.plan === 'destaque'
  const isProfissional = u?.plan === 'profissional'

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6A73] hover:text-[#7E3F8F] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar para o catálogo de prestadoras
        </Link>
      </div>

      {/* Top Banner / Header Card */}
      <div className="bg-white rounded-3xl border border-[#E5DFE3] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#E8B4B8]/20 via-[#7E3F8F]/5 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-md ring-2 ring-[#7E3F8F]/20">
              <AvatarFallback className="bg-gradient-to-br from-[#7E3F8F] to-[#5C276B] text-white text-2xl font-bold">
                {u?.name
                  ? u.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                  : 'CF'}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2D2A32]">{u?.name}</h1>

                {/* Verified badge + tooltip */}
                {isVerified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#2E7D32] border border-emerald-200 cursor-help">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Selo Verificada
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#2D2A32] text-white text-xs max-w-xs">
                      Este perfil foi aprovado pela nossa equipe após análise criteriosa de
                      documentação e identidade.
                    </TooltipContent>
                  </Tooltip>
                )}

                {isDestaque && (
                  <Badge className="bg-[#E9C46A] text-[#2D2A32] hover:bg-[#E9C46A] text-xs font-bold px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#7E3F8F]" />
                    Prestadora em Destaque
                  </Badge>
                )}
                {isProfissional && (
                  <Badge
                    variant="secondary"
                    className="bg-[#F3EEF0] text-[#7E3F8F] text-xs font-semibold"
                  >
                    Plano Profissional
                  </Badge>
                )}
              </div>

              {/* City and rating */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E6A73]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7E3F8F]" />
                  {provider.city ? `${provider.city}, ${provider.state}` : 'Brasil'}
                </span>

                <span>•</span>

                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span className="text-[#2D2A32]">
                    {provider.rating_avg ? provider.rating_avg.toFixed(1) : '5.0'}
                  </span>
                  <span className="font-normal text-[#6E6A73] ml-1">
                    ({reviews.length} avaliaç{reviews.length === 1 ? 'ão' : 'ões'})
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {provider.expand?.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FAF7F5] border border-[#E5DFE3] text-[#7E3F8F]"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick CTA on Header (Desktop) */}
          <div className="hidden sm:flex flex-col gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setQuoteModalOpen(true)}
              className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white px-6 py-2.5 shadow-sm font-medium"
            >
              Solicitar orçamento
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/mensagens')}
              className="border-[#E5DFE3] text-[#2D2A32] hover:bg-[#FAF7F5]"
            >
              <MessageSquare className="w-4 h-4 mr-1.5 text-[#7E3F8F]" />
              Conversas
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Col: Details, About, Reviews */}
        <div className="md:col-span-2 space-y-6">
          {/* About & Services */}
          <Card className="border-[#E5DFE3] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#FAF7F5]">
              <CardTitle className="text-base font-bold text-[#2D2A32]">
                Sobre os serviços
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-sm text-[#2D2A32] leading-relaxed">
              <p className="whitespace-pre-line">
                {provider.service_description ||
                  u?.bio ||
                  'Serviços profissionais personalizados com garantia de qualidade e pontualidade.'}
              </p>

              {u?.bio && u.bio !== provider.service_description && (
                <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3] text-xs text-[#6E6A73] space-y-1">
                  <span className="font-semibold text-[#2D2A32] block">Formação e Biografia:</span>
                  <p>{u.bio}</p>
                </div>
              )}

              {provider.locations_served && (
                <div className="pt-2 text-xs">
                  <span className="font-semibold text-[#2D2A32] block mb-1">
                    Regiões de atendimento:
                  </span>
                  <p className="text-[#6E6A73] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7E3F8F] shrink-0" />
                    {provider.locations_served}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card className="border-[#E5DFE3] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#FAF7F5] flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#2D2A32]">
                  Avaliações de clientes ({reviews.length})
                </CardTitle>
              </div>

              {/* Client write review button */}
              {user && user.role === 'cliente' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setReviewModalOpen(true)}
                  className="text-xs border-[#E5DFE3] text-[#7E3F8F] hover:bg-[#F3EEF0]"
                >
                  Escrever avaliação
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#6E6A73]">
                  Nenhuma avaliação registrada ainda. Seja a primeira a avaliar após a conclusão do
                  orçamento!
                </div>
              ) : (
                <div className="divide-y divide-[#FAF7F5] space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-3 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-[#F3EEF0] text-[#7E3F8F] text-xs font-semibold">
                              {rev.expand?.client?.name?.[0] || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-xs text-[#2D2A32]">
                            {rev.expand?.client?.name || 'Cliente da rede'}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#6E6A73] leading-relaxed pl-9">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sticky Sidebar */}
        <div className="space-y-4 md:sticky md:top-24">
          <Card className="border-[#E5DFE3] bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#2D2A32]">
                Contratar este serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#6E6A73] leading-relaxed">
                Solicite uma proposta personalizada. A prestadora enviará o orçamento detalhado com
                preço e opções de agendamento.
              </p>

              <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3] text-[11px] text-[#2E7D32] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Negociação 100% segura e direta com a profissional, sem comissões ocultas.
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full bg-[#7E3F8F] hover:bg-[#6B347A] text-white py-2.5 font-medium shadow-xs"
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  Solicitar orçamento
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/mensagens')}
                  className="w-full border-[#E5DFE3] text-[#2D2A32] hover:bg-[#FAF7F5]"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5 text-[#7E3F8F]" />
                  Enviar mensagem
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety box */}
          <div className="p-4 rounded-2xl bg-[#F3EEF0] border border-[#E5DFE3] space-y-2 text-xs text-[#7E3F8F]">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Compromisso LinkDelas</span>
            </div>
            <p className="text-[11px] text-[#6E6A73] leading-relaxed">
              Todas as prestadoras passam por validação de antecedentes e curadoria manual para
              garantir um ambiente seguro e de alta confiança entre mulheres.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      <QuoteRequestModal
        provider={provider}
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
      />

      {/* Write review modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="sm:max-w-[420px] bg-white p-5">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#2D2A32]">
              Avaliar atendimento de {u?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateReview} className="space-y-4 pt-2">
            <div className="space-y-1.5 text-center">
              <Label className="text-xs font-semibold text-[#2D2A32]">
                Sua nota (1 a 5 estrelas)
              </Label>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="revComment" className="text-xs font-semibold text-[#2D2A32]">
                Seu depoimento
              </Label>
              <Textarea
                id="revComment"
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Conte como foi o atendimento, pontualidade, resultado..."
                className="text-xs border-[#E5DFE3]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewModalOpen(false)}
                className="border-[#E5DFE3]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submittingReview || !newComment.trim()}
                className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white"
              >
                {submittingReview ? 'Publicando...' : 'Publicar avaliação'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
