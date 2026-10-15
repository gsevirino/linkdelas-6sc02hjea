import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  FileText,
  Database,
  Lock,
  PhoneCall,
  Share2,
  Cookie,
  UserCheck2,
  History,
  RefreshCw,
  Mail,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Privacy() {
  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in max-w-4xl mx-auto py-2">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7E3F8F] via-[#662F76] to-[#4A1D57] text-white p-8 sm:p-12 shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#E8B4B8]/10 pointer-events-none blur-xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-white/15 text-white hover:bg-white/20 border-white/20 backdrop-blur text-xs font-semibold px-3 py-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#E8B4B8]" />
            LGPD e Proteção de Dados
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Política de Privacidade
          </h1>
          <p className="text-[#FAF7F5]/90 text-base sm:text-lg leading-relaxed pt-1 font-medium">
            Última atualização: julho de 2026
          </p>
        </div>
      </section>

      {/* Parágrafo introdutório antes das seções */}
      <section className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E5DFE3] shadow-xs">
        <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
          Esta política explica como o LinkDelas coleta, usa e protege os dados pessoais das
          clientes, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
          13.709/2018).
        </p>
      </section>

      {/* Seções 1 a 9 */}
      <div className="space-y-6">
        {/* 1. Quais dados coletamos */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                1. Quais dados coletamos
              </h2>
            </div>
            <ul className="space-y-3 pt-1">
              <li className="flex items-start gap-3 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
                <div className="w-6 h-6 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Nome, e-mail e CPF, no momento do cadastro;</span>
              </li>
              <li className="flex items-start gap-3 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
                <div className="w-6 h-6 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  Número de WhatsApp, cidade, bairro e foto de perfil, para prestadoras que anunciam
                  serviços;
                </span>
              </li>
              <li className="flex items-start gap-3 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
                <div className="w-6 h-6 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Avaliações e comentários que você escreve sobre profissionais;</span>
              </li>
              <li className="flex items-start gap-3 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
                <div className="w-6 h-6 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Prestadoras favoritas que você salva;</span>
              </li>
              <li className="flex items-start gap-3 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
                <div className="w-6 h-6 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  Denúncias que você registra, incluindo categoria e descrição do problema;
                </span>
              </li>
              <li className="flex items-start gap-3 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
                <div className="w-6 h-6 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  Dados técnicos básicos de navegação (necessários para o funcionamento do site).
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 2. Por que coletamos esses dados */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                2. Por que coletamos esses dados
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              O CPF é usado exclusivamente para reforçar a segurança e a confiança entre as clientes
              da comunidade (evitar contas falsas ou duplicadas) — ele nunca é exibido publicamente
              no seu perfil. Justamente por esse motivo, o perfil completo de uma prestadora (foto,
              nome e WhatsApp) só fica visível para clientes com cadastro completo (CPF confirmado);
              quem visita o site sem conta vê apenas categoria, cidade e nota média, sem nenhuma
              informação que identifique a prestadora. Os demais dados são usados para o
              funcionamento das funcionalidades que você utiliza (busca, favoritos, avaliações,
              denúncias).
            </p>
          </CardContent>
        </Card>

        {/* 3. Registro de segurança (contato via WhatsApp) */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                3. Registro de segurança (contato via WhatsApp)
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Por ser um serviço de prestação em domicílio, registramos o momento em que uma cliente
              clica em "Chamar no WhatsApp" para uma prestadora (quem contatou quem, e quando) —
              nada além disso; não registramos cliques, páginas visitadas ou navegação em geral.
              Esse registro existe especificamente para proteger a segurança física das usuárias
              (base legal do art. 7º da LGPD) e só é acessado pela administração do LinkDelas em
              caso de necessidade real, por exemplo para atender uma solicitação das autoridades
              policiais.
            </p>
          </CardContent>
        </Card>

        {/* 4. Com quem compartilhamos */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                4. Com quem compartilhamos
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Seus dados são armazenados com o Supabase (provedor de banco de dados e autenticação)
              e a Vercel (hospedagem do site), que atuam como operadores de dados sob nossas
              instruções. Não vendemos nem compartilhamos seus dados com terceiros para fins de
              marketing.
            </p>
          </CardContent>
        </Card>

        {/* 5. Cookies e armazenamento local */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                5. Cookies e armazenamento local
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Usamos o armazenamento local do navegador (localStorage) apenas para lembrar sua
              sessão de login e a última área do site que você visitou (ex: modo cliente ou
              prestadora) — não usamos cookies de rastreamento de terceiros para publicidade.
            </p>
          </CardContent>
        </Card>

        {/* 6. Seus direitos */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <UserCheck2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                6. Seus direitos
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Conforme a LGPD, você pode solicitar a qualquer momento: acesso aos seus dados,
              correção de informações incorretas, exclusão da sua conta e dos seus dados, ou
              informações sobre como seus dados são tratados. Para exercer qualquer um desses
              direitos, entre em contato pelo e-mail{' '}
              <a
                href="mailto:contato@linkdelas.com.br"
                className="text-[#7E3F8F] font-semibold underline hover:text-[#662F76] transition-colors"
              >
                contato@linkdelas.com.br
              </a>
              . Atendemos as solicitações dentro do prazo previsto em lei.
            </p>
          </CardContent>
        </Card>

        {/* 7. Retenção de dados */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <History className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                7. Retenção de dados
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Mantemos seus dados enquanto sua conta estiver ativa. Ao solicitar exclusão de conta,
              seus dados pessoais são removidos, exceto quando a lei exigir retenção por período
              determinado (ex: obrigações fiscais sobre pagamentos já realizados, ou registros de
              segurança necessários para atender uma investigação em andamento).
            </p>
          </CardContent>
        </Card>

        {/* 8. Alterações desta política */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                8. Alterações desta política
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Esta política pode ser atualizada periodicamente para refletir mudanças no
              funcionamento da plataforma ou na legislação. A data da última atualização está sempre
              indicada no topo desta página.
            </p>
          </CardContent>
        </Card>

        {/* 9. Contato */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                9. Contato
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Dúvidas sobre privacidade e dados pessoais podem ser enviadas para{' '}
              <a
                href="mailto:contato@linkdelas.com.br"
                className="text-[#7E3F8F] font-semibold underline hover:text-[#662F76] transition-colors"
              >
                contato@linkdelas.com.br
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção final com links de apoio */}
      <section className="bg-gradient-to-r from-[#FAF7F5] to-[#F3EEF0] rounded-3xl p-8 sm:p-10 border border-[#E5DFE3] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-[#2D2A32]">Conheça os nossos Termos de Uso</h3>
          <p className="text-sm text-[#6E6A73]">
            Veja as regras gerais, diretrizes e responsabilidades da comunidade LinkDelas.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            asChild
            variant="outline"
            className="border-[#7E3F8F]/30 text-[#7E3F8F] hover:bg-[#7E3F8F]/10 hover:text-[#7E3F8F] font-semibold"
          >
            <Link to="/termos">
              <FileText className="w-4 h-4 mr-1.5" />
              Termos de Uso
            </Link>
          </Button>
          <Button asChild className="bg-[#7E3F8F] text-white hover:bg-[#662F76] font-semibold">
            <Link to="/sobre">
              Sobre nós
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
