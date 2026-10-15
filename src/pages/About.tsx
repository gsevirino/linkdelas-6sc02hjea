import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Users,
  Compass,
  ArrowRight,
  MessageCircle,
  FileCheck2,
  CheckCircle2,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function About() {
  return (
    <div className="space-y-12 sm:space-y-16 animate-fade-in max-w-4xl mx-auto py-2">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7E3F8F] via-[#662F76] to-[#4A1D57] text-white p-8 sm:p-12 shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#E8B4B8]/10 pointer-events-none blur-xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-white/15 text-white hover:bg-white/20 border-white/20 backdrop-blur text-xs font-semibold px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#E8B4B8]" />
            Nossa História e Propósito
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Sobre nós
          </h1>
          <p className="text-[#FAF7F5]/90 text-base sm:text-lg leading-relaxed pt-1">
            Uma rede feita por e para mulheres, fortalecendo a autonomia, a confiança e a
            valorização do trabalho feminino em todo o Brasil.
          </p>
        </div>
      </section>

      {/* Sobre a LinkDelas */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DFE3] shadow-xs space-y-5">
        <div className="inline-flex items-center gap-2 text-[#7E3F8F] text-xs font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4 text-[#7E3F8F]" />
          <span>Origem</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A32] tracking-tight">
          Sobre a LinkDelas
        </h2>
        <div className="space-y-4 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed font-normal">
          <p>
            A LinkDelas nasceu de uma constatação simples: mulheres buscam e oferecem serviços o
            tempo todo, mas nem sempre encontram um lugar onde se sintam seguras para contratar — e
            ser contratadas.
          </p>
          <p className="p-5 sm:p-6 rounded-2xl bg-[#F3EEF0] border-l-4 border-[#7E3F8F] text-[#2D2A32] font-medium">
            Criamos a LinkDelas para ser esse lugar. Uma plataforma exclusiva, onde prestadoras de
            serviço são mulheres e clientes são mulheres. Do outro lado da tela, sempre haverá outra
            mulher.
          </p>
        </div>
      </section>

      {/* Nossa missão */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FAF7F5] to-[#F3EEF0] p-8 sm:p-10 border border-[#E5DFE3] space-y-4">
        <div className="inline-flex items-center gap-2 text-[#7E3F8F] text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#7E3F8F]" />
          <span>Propósito Central</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A32] tracking-tight">
          Nossa missão
        </h2>
        <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed">
          Conectar mulheres com mulheres, com segurança, respeito e transparência — para que
          talentos femininos floresçam e para que toda cliente encontre, com confiança, a
          profissional certa para cada necessidade.
        </p>
      </section>

      {/* O que você encontra aqui */}
      <section className="space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#7E3F8F] text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#7E3F8F]" />
            <span>Experiência</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A32] tracking-tight">
            O que você encontra aqui
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="rounded-2xl border-[#E5DFE3] bg-white shadow-xs hover:border-[#7E3F8F]/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-sm sm:text-base text-[#2D2A32] leading-relaxed">
                Um catálogo de prestadoras verificadas, organizado por categoria e cidade — de
                autocuidado e beleza a gestão do lar, saúde e personal styling.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E5DFE3] bg-white shadow-xs hover:border-[#7E3F8F]/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <p className="text-sm sm:text-base text-[#2D2A32] leading-relaxed">
                Um fluxo de orçamento simples: você descreve o que precisa, a prestadora responde
                com preço e condições, e você decide no seu tempo.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E5DFE3] bg-white shadow-xs hover:border-[#7E3F8F]/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-sm sm:text-base text-[#2D2A32] leading-relaxed">
                Conversa direta e segura com a prestadora, do primeiro "olá" até a conclusão do
                serviço.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Compromisso LinkDelas */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5DFE3] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7E3F8F] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#E8B4B8]" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7E3F8F] block">
              Garantia & Curadoria
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A32] tracking-tight">
              Compromisso LinkDelas
            </h2>
          </div>
        </div>

        <div className="space-y-4 text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed">
          <p className="font-semibold text-[#2D2A32]">
            A confiança não é um detalhe: é a base de tudo.
          </p>
          <p>
            Por isso, toda prestadora passa por uma aprovação antes de aparecer no catálogo, e as
            que aderem aos nossos planos carregam o selo de verificação. Monitoramos a experiência
            das duas pontas e agimos sempre que algo não estiver alinhado com os nossos valores:
            respeito, segurança e valorização do trabalho feminino.
          </p>
        </div>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-semibold text-[#7E3F8F]">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3]">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>Respeito mútuo</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3]">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>Segurança entre mulheres</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7F5] border border-[#E5DFE3]">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>Valorização profissional</span>
          </div>
        </div>
      </section>

      {/* Para prestadoras */}
      <section className="bg-gradient-to-br from-white to-[#FAF7F5] rounded-3xl p-8 sm:p-10 border border-[#E5DFE3] shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 text-[#7E3F8F] text-xs font-bold uppercase tracking-wider">
          <Briefcase className="w-4 h-4 text-[#7E3F8F]" />
          <span>Oportunidades</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2A32] tracking-tight">
          Para prestadoras
        </h2>
        <p className="text-base sm:text-lg text-[#2D2A32]/90 leading-relaxed">
          Se você é uma profissional e quer transformar seu talento em oportunidade, a LinkDelas é o
          seu espaço: cadastro gratuito, visibilidade para quem realmente importa e ferramentas para
          gerenciar orçamentos e conversas em um só lugar.
        </p>
      </section>

      {/* Junte-se a nós (CTA final) */}
      <section className="rounded-3xl bg-[#7E3F8F] text-white p-8 sm:p-12 text-center space-y-6 shadow-md">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Junte-se a nós
          </h2>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed">
            Seja para contratar, seja para empreender, aqui você está entre iguais. Crie sua conta e
            faça parte da rede LinkDelas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-white text-[#7E3F8F] hover:bg-[#FAF7F5] font-bold text-base shadow-sm px-7"
          >
            <Link to="/cadastro">
              Criar conta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white font-medium text-base px-6"
          >
            <Link to="/catalogo">Conheça o catálogo</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
