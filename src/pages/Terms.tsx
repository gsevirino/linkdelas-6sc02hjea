import React from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  ShieldCheck,
  UserCheck,
  Megaphone,
  BadgeCheck,
  Star,
  AlertTriangle,
  Scale,
  RefreshCw,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Terms() {
  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in max-w-4xl mx-auto py-2">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7E3F8F] via-[#662F76] to-[#4A1D57] text-white p-8 sm:p-12 shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#E8B4B8]/10 pointer-events-none blur-xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-white/15 text-white hover:bg-white/20 border-white/20 backdrop-blur text-xs font-semibold px-3 py-1">
            <FileText className="w-3.5 h-3.5 mr-1.5 text-[#E8B4B8]" />
            Transparência e Segurança
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Termos de Uso
          </h1>
          <p className="text-[#FAF7F5]/90 text-base sm:text-lg leading-relaxed pt-1 font-medium">
            Última atualização: julho de 2026
          </p>
        </div>
      </section>

      {/* Seções 1 a 9 */}
      <div className="space-y-6">
        {/* 1. Sobre o LinkDelas */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                1. Sobre o LinkDelas
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              O LinkDelas é uma plataforma online que conecta clientes a prestadoras de serviço
              autônomo. O LinkDelas atua como um espaço de divulgação e intermediação de contato —
              não somos parte na relação de prestação de serviço entre cliente e prestadora, não
              empregamos as prestadoras cadastradas e não garantimos a qualidade, pontualidade ou
              resultado dos serviços contratados por meio da plataforma.
            </p>
          </CardContent>
        </Card>

        {/* 2. Cadastro */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                2. Cadastro
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Para usar recursos como avaliar profissionais ou anunciar serviços, é necessário criar
              uma conta com nome, e-mail e senha. Prestadoras complementam o cadastro com categoria
              de serviço, descrição, telefone de contato, cidade e foto de perfil. Você é
              responsável por manter suas informações de cadastro atualizadas e verdadeiras, e por
              manter sua senha em sigilo.
            </p>
          </CardContent>
        </Card>

        {/* 3. Anúncio de serviços (prestadoras) */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                3. Anúncio de serviços (prestadoras)
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Prestadoras podem anunciar serviços por meio dos planos Essencial (gratuito),
              Profissional (R$ 49/mês) e Destaque (R$ 99/mês), contratados pela própria plataforma.
              O pagamento é confirmado manualmente pela administração — não há cobrança automática
              recorrente. Um anúncio com mensalidade vencida deixa de aparecer nas buscas públicas
              até que o pagamento seja regularizado, mas os dados cadastrados pela prestadora não
              são apagados e podem ser reativados a qualquer momento mediante novo pagamento. A
              administração pode pausar, suspender ou cancelar um anúncio em caso de descumprimento
              destes Termos.
            </p>
          </CardContent>
        </Card>

        {/* 4. Selo "Verificada" */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                4. Selo "Verificada"
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              O selo "Verificada" indica que a administração analisou e aprovou o cadastro da
              prestadora (dados informados, categoria, descrição e foto de perfil) antes de sua
              publicação no catálogo. A prestadora pode solicitar a remoção do selo a qualquer
              momento. O selo atesta apenas a aprovação do cadastro pela administração e não
              constitui garantia de qualidade, idoneidade ou resultado dos serviços prestados.
            </p>
          </CardContent>
        </Card>

        {/* 5. Avaliações */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                5. Avaliações
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Avaliações só podem ser feitas por clientes com conta cadastrada e devem refletir
              experiências reais e verdadeiras. É proibido publicar avaliações falsas, ofensivas ou
              que violem direitos de terceiros. A administração pode remover avaliações que violem
              estas regras.
            </p>
          </CardContent>
        </Card>

        {/* 6. Conduta proibida */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                6. Conduta proibida
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Não é permitido usar o LinkDelas para fins ilegais, assediar outras clientes, publicar
              conteúdo falso ou ofensivo, ou tentar acessar dados de outras contas sem autorização.
              Contas que violem estas regras podem ser suspensas ou encerradas.
            </p>
          </CardContent>
        </Card>

        {/* 7. Limitação de responsabilidade */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                7. Limitação de responsabilidade
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              O LinkDelas se esforça para manter a plataforma disponível e segura, mas não garante
              funcionamento ininterrupto e não se responsabiliza por danos decorrentes de serviços
              contratados entre cliente e prestadora, nem por informações incorretas fornecidas
              pelas próprias clientes.
            </p>
          </CardContent>
        </Card>

        {/* 8. Alterações destes Termos */}
        <Card className="rounded-3xl border-[#E5DFE3] bg-white shadow-xs overflow-hidden">
          <CardContent className="p-7 sm:p-9 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2A32] tracking-tight">
                8. Alterações destes Termos
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
              Estes Termos podem ser atualizados periodicamente. Alterações relevantes serão
              comunicadas na plataforma. O uso continuado após uma atualização representa
              concordância com os novos termos.
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
              Dúvidas sobre estes Termos podem ser enviadas para{' '}
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
          <h3 className="text-lg font-bold text-[#2D2A32]">Conheça mais sobre a nossa proposta</h3>
          <p className="text-sm text-[#6E6A73]">
            Veja nossa missão, princípios e como fazemos a curadoria da rede.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            asChild
            variant="outline"
            className="border-[#7E3F8F]/30 text-[#7E3F8F] hover:bg-[#7E3F8F]/10 hover:text-[#7E3F8F] font-semibold"
          >
            <Link to="/sobre">
              Sobre nós
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
          <Button asChild className="bg-[#7E3F8F] text-white hover:bg-[#662F76] font-semibold">
            <Link to="/catalogo">Ver catálogo</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
