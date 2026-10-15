import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Building2,
} from 'lucide-react'
import { getProviders, ProviderFilters } from '@/services/providers'
import { getCategories } from '@/services/categories'
import type { ProviderRecord, CategoryRecord } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import QuoteRequestModal from '@/components/ui/../QuoteRequestModal'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('categoria') || ''

  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedState, setSelectedState] = useState('TODOS')
  const [cityInput, setCityInput] = useState('')
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'recent'>('relevance')

  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [providers, setProviders] = useState<ProviderRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Modal quote
  const [selectedProviderForQuote, setSelectedProviderForQuote] = useState<ProviderRecord | null>(
    null,
  )
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Fetch categories
  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  // Fetch providers
  useEffect(() => {
    setLoading(true)
    const filters: ProviderFilters = {
      search: searchTerm,
      categorySlug: selectedCategory || undefined,
      state: selectedState,
      city: cityInput,
      sort: sortBy,
    }
    getProviders(filters).then((data) => {
      setProviders(data)
      setLoading(false)
    })
  }, [searchTerm, selectedCategory, selectedState, cityInput, sortBy])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedState('TODOS')
    setCityInput('')
    setSortBy('relevance')
    setSearchParams({})
  }

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedCategory) ||
    selectedState !== 'TODOS' ||
    Boolean(cityInput)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E5DFE3]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2A32]">
            Catálogo de Prestadoras
          </h1>
          <p className="text-sm text-[#6E6A73] mt-1">
            Mulheres verificadas, capacitadas e prontas para atender você com segurança e
            excelência.
          </p>
        </div>

        {/* Mobile trigger for filters */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="border-[#E5DFE3] flex-1">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-[#7E3F8F]" />
                Filtros {hasActiveFilters && '•'}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-white p-5 overflow-y-auto">
              <SheetHeader className="text-left pb-4 border-b border-[#FAF7F5]">
                <SheetTitle className="text-base font-bold text-[#2D2A32] flex items-center justify-between">
                  <span>Filtrar resultados</span>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-[#7E3F8F] font-normal"
                    >
                      Limpar
                    </button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-5">
                {/* Mobile categories */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A73]">
                    Categoria
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        !selectedCategory
                          ? 'bg-[#7E3F8F] text-white'
                          : 'text-[#2D2A32] hover:bg-[#FAF7F5]'
                      }`}
                    >
                      Todas as categorias
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          selectedCategory === c.slug
                            ? 'bg-[#7E3F8F] text-white'
                            : 'text-[#2D2A32] hover:bg-[#FAF7F5]'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile state and city */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6A73]">
                    Localização
                  </span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full text-xs h-9 px-2.5 rounded-md border border-[#E5DFE3] bg-white"
                  >
                    <option value="TODOS">Todos os estados</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="SC">Santa Catarina (SC)</option>
                    <option value="RS">Rio Grande do Sul (RS)</option>
                  </select>
                  <Input
                    placeholder="Filtrar por cidade..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort selector mobile */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs h-9 px-2 rounded-md border border-[#E5DFE3] bg-white"
          >
            <option value="relevance">Destaques primeiro</option>
            <option value="rating">Melhor avaliadas</option>
            <option value="recent">Mais recentes</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar + Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block col-span-1 bg-white p-5 rounded-2xl border border-[#E5DFE3] space-y-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F5]">
            <h3 className="font-bold text-sm text-[#2D2A32] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#7E3F8F]" />
              Filtros
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-[#7E3F8F] hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#2D2A32]">Buscar termo</span>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6A73]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: drenagem, consultoria..."
                className="pl-8 text-xs h-9 border-[#E5DFE3]"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#2D2A32] block">Categorias</span>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-[#7E3F8F] text-white shadow-xs'
                    : 'text-[#2D2A32] hover:bg-[#FAF7F5]'
                }`}
              >
                Todas as categorias
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === c.slug
                      ? 'bg-[#7E3F8F] text-white shadow-xs'
                      : 'text-[#2D2A32] hover:bg-[#FAF7F5]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filters */}
          <div className="space-y-2 pt-2 border-t border-[#FAF7F5]">
            <span className="text-xs font-semibold text-[#2D2A32] block">Localização</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs h-9 px-2.5 rounded-md border border-[#E5DFE3] bg-white focus:outline-none focus:ring-1 focus:ring-[#7E3F8F]"
            >
              <option value="TODOS">Todos os estados (UF)</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
              <option value="MG">Minas Gerais (MG)</option>
              <option value="PR">Paraná (PR)</option>
              <option value="SC">Santa Catarina (SC)</option>
              <option value="RS">Rio Grande do Sul (RS)</option>
            </select>
            <Input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Digite a cidade..."
              className="text-xs h-9 border-[#E5DFE3]"
            />
          </div>

          {/* Sort selector desktop */}
          <div className="space-y-1.5 pt-2 border-t border-[#FAF7F5]">
            <span className="text-xs font-semibold text-[#2D2A32] block">Ordenar por</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs h-9 px-2.5 rounded-md border border-[#E5DFE3] bg-white focus:outline-none focus:ring-1 focus:ring-[#7E3F8F]"
            >
              <option value="relevance">Relevância / Destaques</option>
              <option value="rating">Melhor avaliadas</option>
              <option value="recent">Mais recentes</option>
            </select>
          </div>
        </aside>

        {/* Results Area */}
        <section className="col-span-1 md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6E6A73] px-1">
            <span>
              Mostrando <strong>{providers.length}</strong> prestadora
              {providers.length === 1 ? '' : 's'} encontrada
              {providers.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-white border border-[#E5DFE3] animate-pulse p-4"
                />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5DFE3] p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#F3EEF0] text-[#7E3F8F] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#2D2A32]">Nenhuma prestadora encontrada</h3>
              <p className="text-xs text-[#6E6A73] max-w-sm mx-auto">
                Tente ajustar os filtros de categoria, busca ou localização para encontrar
                profissionais disponíveis.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="border-[#E5DFE3] text-xs text-[#7E3F8F]"
                >
                  Limpar todos os filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((p) => {
                const u = p.expand?.user
                const isDestaque = u?.plan === 'destaque'
                const isProfissional = u?.plan === 'profissional'
                const isVerified = u?.verified || false

                return (
                  <div
                    key={p.id}
                    className={`group bg-white rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between overflow-hidden ${
                      isDestaque ? 'border-[#E9C46A] ring-1 ring-[#E9C46A]/40' : 'border-[#E5DFE3]'
                    }`}
                  >
                    {/* Card Top & Photo */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-12 h-12 border-2 border-white shadow-xs">
                            <AvatarFallback className="bg-[#7E3F8F] text-white font-bold text-sm">
                              {u?.name
                                ? u.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                : 'CF'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-sm text-[#2D2A32] group-hover:text-[#7E3F8F] transition-colors leading-tight">
                                {u?.name}
                              </h3>
                              {isVerified && (
                                <span title="Perfil Verificado com análise documental">
                                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6E6A73] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#6E6A73]" />
                              {p.city ? `${p.city}, ${p.state}` : 'Brasil'}
                            </p>
                          </div>
                        </div>

                        {/* Plan Badge */}
                        {isDestaque ? (
                          <Badge className="bg-[#E9C46A] text-[#2D2A32] hover:bg-[#E9C46A] text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-[#7E3F8F]" />
                            Destaque
                          </Badge>
                        ) : isProfissional ? (
                          <Badge
                            variant="secondary"
                            className="bg-[#F3EEF0] text-[#7E3F8F] text-[10px] font-semibold px-2 py-0.5"
                          >
                            Pro
                          </Badge>
                        ) : null}
                      </div>

                      {/* Categories Badges */}
                      <div className="flex flex-wrap gap-1">
                        {p.expand?.categories?.map((c) => (
                          <span
                            key={c.id}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FAF7F5] border border-[#E5DFE3] text-[#6E6A73]"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>

                      {/* Snippet */}
                      <p className="text-xs text-[#6E6A73] line-clamp-3 leading-relaxed">
                        {p.service_description ||
                          u?.bio ||
                          'Serviços especializados com foco no público feminino.'}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 pt-1 text-xs">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold ml-1 text-[#2D2A32]">
                            {p.rating_avg ? p.rating_avg.toFixed(1) : '5.0'}
                          </span>
                        </div>
                        <span className="text-[#6E6A73] text-[11px]">
                          ({p.review_count || 0} avaliaç{p.review_count === 1 ? 'ão' : 'ões'})
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Bottom */}
                    <div className="p-3 bg-[#FAF7F5] border-t border-[#E5DFE3] grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs border-[#E5DFE3] hover:border-[#7E3F8F] hover:text-[#7E3F8F] bg-white"
                      >
                        <Link to={`/prestadoras/${p.id}`}>Ver perfil</Link>
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProviderForQuote(p)
                          setQuoteModalOpen(true)
                        }}
                        className="text-xs bg-[#7E3F8F] hover:bg-[#6B347A] text-white shadow-2xs"
                      >
                        Orçamento
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Quote Request Modal */}
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
