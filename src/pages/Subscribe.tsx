import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Check,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import type { ProviderPlan } from '@/types/database'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Subscribe() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const currentPlan: ProviderPlan = user?.plan || 'essencial'

  // Modal checkout state
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    key: ProviderPlan
    name: string
    price: string
  } | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExp, setCardExp] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [processing, setProcessing] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const plans = [
    {
      key: 'essencial' as ProviderPlan,
      name: 'Plano Essencial',
      price: 'R$ 0',
      period: '/mês',
      description: 'Ideal para iniciar sua presença profissional no catálogo de serviços.',
      highlight: false,
      badgeText: null,
      features: [
        'Listagem básica no catálogo',
        'Até 10 orçamentos recebidos por mês',
        'Visibilidade padrão na busca',
        'Chat com clientes via plataforma',
        'Aprovação documental com selo após análise',
      ],
      ctaText: 'Usar o plano gratuito',
    },
    {
      key: 'profissional' as ProviderPlan,
      name: 'Plano Profissional',
      price: 'R$ 49',
      period: '/mês',
      description:
        'Mais solicitações e destaque para profissionais que desejam acelerar sua agenda.',
      highlight: true,
      badgeText: 'Mais Popular',
      features: [
        'Orçamentos e solicitações ilimitadas',
        'Selo "Profissional" visível no perfil',
        'Posição de destaque nos resultados de busca',
        'Suporte prioritário via WhatsApp',
        'Galeria de fotos ampliada',
        'Estatísticas mensais de visualizações',
      ],
      ctaText: 'Assinar Profissional',
    },
    {
      key: 'destaque' as ProviderPlan,
      name: 'Plano Destaque',
      price: 'R$ 99',
      period: '/mês',
      description:
        'Máxima visibilidade: topo de busca, vitrine na página inicial e máxima credibilidade.',
      highlight: false,
      badgeText: 'Máxima Visibilidade',
      features: [
        'Tudo do Plano Profissional',
        'Posicionamento no topo da página de busca',
        'Destaque com borda dourada e selo premium',
        'Vitrine na página inicial para todas as clientes',
        'Selo Verificada exibido de forma proeminente',
        'Consultoria de bio e otimização de perfil',
      ],
      ctaText: 'Assinar Destaque',
    },
  ]

  const handleOpenCheckout = (plan: (typeof plans)[0]) => {
    if (plan.key === currentPlan) return
    setSelectedPlanForCheckout(plan)
    setCheckoutSuccess(false)
  }

  const handleConfirmMockCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlanForCheckout || !user) return

    setProcessing(true)
    try {
      // Simulate payment delay & update plan on user
      await new Promise((res) => setTimeout(res, 900))

      const isPaid =
        selectedPlanForCheckout.key === 'profissional' || selectedPlanForCheckout.key === 'destaque'

      await pb.collection('users').update(user.id, {
        plan: selectedPlanForCheckout.key,
        verified: user.status === 'approved' && isPaid,
      })

      await refreshUser()
      setProcessing(false)
      setCheckoutSuccess(true)
    } catch (err) {
      console.error(err)
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3EEF0] text-[#7E3F8F] mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
          Monetização por Assinatura • Zero Comissão sobre seus Serviços
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#2D2A32]">
          Planos de Visibilidade para Prestadoras
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A73] leading-relaxed">
          Você fica com 100% do valor que cobra das clientes. Nossos planos aumentam seu destaque no
          catálogo e o número de orçamentos que você recebe todo mês.
        </p>
      </div>

      {/* Current plan banner */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-[#E9C46A]" />
          </div>
          <div>
            <p className="text-xs text-[#6E6A73]">Seu plano atual:</p>
            <h3 className="font-bold text-sm text-[#2D2A32] capitalize">Plano {currentPlan}</h3>
          </div>
        </div>

        <span className="text-xs text-[#2E7D32] font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          Assinatura Ativa
        </span>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p) => {
          const isCurrent = p.key === currentPlan
          return (
            <Card
              key={p.key}
              className={`flex flex-col justify-between rounded-3xl transition-all duration-200 relative ${
                p.highlight
                  ? 'border-2 border-[#7E3F8F] shadow-lg shadow-[#7E3F8F]/10 bg-white ring-2 ring-[#7E3F8F]/10'
                  : 'border-[#E5DFE3] bg-white hover:border-[#7E3F8F]/40 shadow-xs'
              }`}
            >
              {p.badgeText && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#7E3F8F] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    {p.badgeText}
                  </span>
                </div>
              )}

              <CardHeader className="pt-6 pb-4">
                <CardTitle className="text-lg font-bold text-[#2D2A32]">{p.name}</CardTitle>
                <CardDescription className="text-xs text-[#6E6A73] min-h-[36px] pt-1">
                  {p.description}
                </CardDescription>
                <div className="pt-3">
                  <span className="text-3xl font-extrabold text-[#2D2A32]">{p.price}</span>
                  <span className="text-xs text-[#6E6A73]">{p.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                <div className="border-t border-[#FAF7F5] pt-3 space-y-2.5">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#2D2A32]">
                      <Check className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-[#FAF7F5]">
                <Button
                  onClick={() => handleOpenCheckout(p)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 font-medium transition-all shadow-xs ${
                    isCurrent
                      ? 'bg-gray-100 text-gray-500 cursor-default'
                      : p.highlight
                        ? 'bg-[#7E3F8F] hover:bg-[#6B347A] text-white'
                        : 'bg-white border border-[#E5DFE3] text-[#2D2A32] hover:bg-[#FAF7F5]'
                  }`}
                >
                  {isCurrent ? 'Plano atual em uso' : p.ctaText}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* Mock Billing history */}
      <Card className="border-[#E5DFE3] bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-[#FAF7F5]">
          <CardTitle className="text-base font-bold text-[#2D2A32]">
            Histórico de faturamento
          </CardTitle>
          <CardDescription className="text-xs text-[#6E6A73]">
            Comprovantes e registros de renovação de visibilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-[#FAF7F5]">
          <div className="py-2.5 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-[#2D2A32]">Assinatura {currentPlan.toUpperCase()}</p>
              <p className="text-[11px] text-[#6E6A73]">
                {new Date().toLocaleDateString('pt-BR')} • Pagamento simulado MVP
              </p>
            </div>
            <span className="font-semibold text-[#2E7D32]">
              {currentPlan === 'essencial'
                ? 'R$ 0,00'
                : currentPlan === 'profissional'
                  ? 'R$ 49,00'
                  : 'R$ 99,00'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Modal (Simulated Mock) */}
      <Dialog
        open={Boolean(selectedPlanForCheckout)}
        onOpenChange={(open) => {
          if (!open) setSelectedPlanForCheckout(null)
        }}
      >
        <DialogContent className="sm:max-w-[480px] bg-white p-6">
          {checkoutSuccess ? (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2E7D32] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-[#2D2A32]">
                  Plano ativado com sucesso!
                </DialogTitle>
                <p className="text-xs text-[#6E6A73]">
                  Seu perfil agora tem a visibilidade e os benefícios do{' '}
                  <strong>{selectedPlanForCheckout?.name}</strong>.
                </p>
              </div>
              <Button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white mt-2"
              >
                Concluir
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="pb-3 border-b border-[#FAF7F5]">
                <DialogTitle className="text-lg font-bold text-[#2D2A32]">
                  Confirmar Assinatura: {selectedPlanForCheckout?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6E6A73]">
                  Valor: <strong>{selectedPlanForCheckout?.price}/mês</strong> • Simulação funcional
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleConfirmMockCheckout} className="space-y-4 pt-2">
                <Tabs value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <TabsList className="grid grid-cols-2 bg-[#F3EEF0]">
                    <TabsTrigger value="card" className="text-xs flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                      Cartão de Crédito
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="text-xs flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5" />
                      Pix Instantâneo
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-3 pt-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-[#2D2A32]">
                        Número do Cartão
                      </Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• 4242"
                        className="text-xs border-[#E5DFE3]"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-[#2D2A32]">
                        Nome impresso no Cartão
                      </Label>
                      <Input
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Ex: MARIANA SILVEIRA"
                        className="text-xs border-[#E5DFE3]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-[#2D2A32]">Validade</Label>
                        <Input
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM/AA"
                          className="text-xs border-[#E5DFE3]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-[#2D2A32]">CVV</Label>
                        <Input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="text-xs border-[#E5DFE3]"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pix" className="space-y-3 pt-3 text-center">
                    <div className="w-32 h-32 mx-auto bg-[#FAF7F5] border border-dashed border-[#7E3F8F] rounded-xl flex flex-col items-center justify-center text-xs text-[#7E3F8F] p-2">
                      <QrCode className="w-16 h-16 text-[#7E3F8F] mb-1" />
                      <span className="text-[10px]">QR Code simulado</span>
                    </div>
                    <p className="text-xs text-[#6E6A73]">
                      O código Copia e Cola Pix será validado automaticamente no checkout mock.
                    </p>
                  </TabsContent>
                </Tabs>

                <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3] flex items-center gap-2 text-xs text-[#6E6A73]">
                  <Lock className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>
                    Ambiente seguro. Esta é uma simulação funcional: seu plano será salvo
                    imediatamente em seu perfil.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedPlanForCheckout(null)}
                    className="border-[#E5DFE3]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-xs"
                  >
                    {processing ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processando...
                      </span>
                    ) : (
                      `Confirmar assinatura (${selectedPlanForCheckout?.price})`
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
