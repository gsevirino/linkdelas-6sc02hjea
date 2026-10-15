import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Search,
  MessageSquare,
  FileText,
  User,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Heart,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/catalogo')
    }
    setMobileMenuOpen(false)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/entrar')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CF'

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F5] text-[#2D2A32] font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5DFE3] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7E3F8F] to-[#5C276B] flex items-center justify-center text-white shadow-md shadow-[#7E3F8F]/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-[#E8B4B8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-[#7E3F8F]">
                LinkDelas
              </span>
              <span className="text-[11px] font-medium text-[#6E6A73] uppercase tracking-wider">
                Serviços de Mulheres
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-md mx-4"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar massagem, organização, estética..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#F3EEF0] border border-transparent rounded-full focus:outline-none focus:border-[#7E3F8F] focus:bg-white transition-all text-[#2D2A32] placeholder:text-[#6E6A73]"
            />
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/catalogo"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#7E3F8F] bg-[#F3EEF0]'
                    : 'text-[#2D2A32] hover:text-[#7E3F8F] hover:bg-[#FAF7F5]'
                }`
              }
            >
              Catálogo
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/orcamentos"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#7E3F8F] bg-[#F3EEF0]'
                        : 'text-[#2D2A32] hover:text-[#7E3F8F] hover:bg-[#FAF7F5]'
                    }`
                  }
                >
                  <FileText className="w-4 h-4" />
                  Orçamentos
                </NavLink>

                <NavLink
                  to="/mensagens"
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-[#7E3F8F] bg-[#F3EEF0]'
                        : 'text-[#2D2A32] hover:text-[#7E3F8F] hover:bg-[#FAF7F5]'
                    }`
                  }
                >
                  <MessageSquare className="w-4 h-4" />
                  Mensagens
                </NavLink>
              </>
            )}

            {user?.role === 'prestadora' && (
              <NavLink
                to="/assinar"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#7E3F8F] bg-[#F3EEF0]'
                      : 'text-[#2D2A32] hover:text-[#7E3F8F] hover:bg-[#FAF7F5]'
                  }`
                }
              >
                <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                Planos
              </NavLink>
            )}

            {/* User Profile Dropdown or Sign In */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-[#E5DFE3] hover:border-[#7E3F8F]/40 transition-colors focus:outline-none">
                    <Avatar className="w-8 h-8 border border-white">
                      <AvatarImage src={user.avatar ? user.avatar : undefined} />
                      <AvatarFallback className="bg-[#7E3F8F] text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[100px] truncate text-left">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#6E6A73] mr-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1 bg-white">
                  <DropdownMenuLabel className="font-normal px-3 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-[#2D2A32] flex items-center gap-1.5">
                        {user.name}
                        {user.verified && <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />}
                      </p>
                      <p className="text-xs leading-none text-[#6E6A73] truncate">{user.email}</p>
                      <div className="pt-1 flex items-center gap-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold uppercase tracking-wider bg-[#F3EEF0] text-[#7E3F8F]"
                        >
                          {user.role === 'prestadora' ? 'Prestadora' : 'Cliente'}
                        </Badge>
                        {user.role === 'prestadora' && user.plan && (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-semibold text-[#6E6A73] border-[#E5DFE3]"
                          >
                            {user.plan}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer">
                    <User className="mr-2 h-4 h-4 text-[#6E6A73]" />
                    <span>Início / Painel</span>
                  </DropdownMenuItem>
                  {user.role === 'prestadora' && (
                    <DropdownMenuItem
                      onClick={() => navigate('/assinar')}
                      className="cursor-pointer"
                    >
                      <CreditCard className="mr-2 h-4 w-4 text-[#6E6A73]" />
                      <span>Meu Plano</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => navigate('/configuracoes')}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4 text-[#6E6A73]" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair da conta</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/entrar')}
                  className="text-sm font-medium text-[#7E3F8F] hover:bg-[#F3EEF0]"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => navigate('/cadastro')}
                  className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white text-sm font-medium shadow-xs"
                >
                  Cadastre-se
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2D2A32] hover:bg-[#F3EEF0] transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E5DFE3] bg-white px-4 py-4 space-y-3 animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A73]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar serviços..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F3EEF0] rounded-lg focus:outline-none focus:border-[#7E3F8F] text-[#2D2A32]"
              />
            </form>

            <nav className="flex flex-col space-y-1 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-lg text-[#2D2A32] hover:bg-[#FAF7F5]"
              >
                Início
              </Link>
              <Link
                to="/catalogo"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-lg text-[#2D2A32] hover:bg-[#FAF7F5]"
              >
                Catálogo de Prestadoras
              </Link>
              {user && (
                <>
                  <Link
                    to="/orcamentos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium rounded-lg text-[#2D2A32] hover:bg-[#FAF7F5] flex items-center justify-between"
                  >
                    <span>Orçamentos</span>
                    <FileText className="w-4 h-4 text-[#6E6A73]" />
                  </Link>
                  <Link
                    to="/mensagens"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium rounded-lg text-[#2D2A32] hover:bg-[#FAF7F5] flex items-center justify-between"
                  >
                    <span>Mensagens</span>
                    <MessageSquare className="w-4 h-4 text-[#6E6A73]" />
                  </Link>
                  {user.role === 'prestadora' && (
                    <Link
                      to="/assinar"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium rounded-lg text-[#2D2A32] hover:bg-[#FAF7F5] flex items-center justify-between"
                    >
                      <span>Planos e Assinatura</span>
                      <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                    </Link>
                  )}
                  <Link
                    to="/configuracoes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-sm font-medium rounded-lg text-[#2D2A32] hover:bg-[#FAF7F5] flex items-center justify-between"
                  >
                    <span>Configurações</span>
                    <Settings className="w-4 h-4 text-[#6E6A73]" />
                  </Link>
                </>
              )}
            </nav>

            <div className="pt-3 border-t border-[#E5DFE3]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[#7E3F8F] text-white text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-semibold text-[#2D2A32]">{user.name}</p>
                      <p className="text-[#6E6A73]">{user.role}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-red-600 border-red-200"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/entrar')
                    }}
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/cadastro')
                    }}
                    className="bg-[#7E3F8F] hover:bg-[#6B347A] text-white"
                  >
                    Cadastrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area: max-width 1200px centered */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E5DFE3] bg-white mt-12 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7E3F8F] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-[#E8B4B8]" />
                </div>
                <span className="font-bold text-base text-[#7E3F8F]">LinkDelas</span>
              </div>
              <p className="text-xs text-[#6E6A73] leading-relaxed">
                Marketplace seguro e acolhedor que conecta prestadoras de serviço mulheres a
                clientes mulheres em todo o Brasil.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#2E7D32] font-medium pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Prestadoras verificadas com curadoria</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D2A32] mb-3">
                Para Clientes
              </h4>
              <ul className="space-y-2 text-sm text-[#6E6A73]">
                <li>
                  <Link to="/catalogo" className="hover:text-[#7E3F8F] transition-colors">
                    Explorar catálogo
                  </Link>
                </li>
                <li>
                  <Link to="/orcamentos" className="hover:text-[#7E3F8F] transition-colors">
                    Solicitar orçamento
                  </Link>
                </li>
                <li>
                  <span className="text-[#6E6A73]/70">Garantia de segurança feminina</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D2A32] mb-3">
                Para Prestadoras
              </h4>
              <ul className="space-y-2 text-sm text-[#6E6A73]">
                <li>
                  <Link to="/cadastro" className="hover:text-[#7E3F8F] transition-colors">
                    Cadastrar serviço
                  </Link>
                </li>
                <li>
                  <Link to="/assinar" className="hover:text-[#7E3F8F] transition-colors">
                    Planos de visibilidade
                  </Link>
                </li>
                <li>
                  <span className="text-[#6E6A73]/70">Como funciona o selo verificado</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D2A32] mb-3">
                Institucional
              </h4>
              <ul className="space-y-2 text-sm text-[#6E6A73]">
                <li>
                  <span className="cursor-default">Sobre nós</span>
                </li>
                <li>
                  <span className="cursor-default">Termos de Uso</span>
                </li>
                <li>
                  <span className="cursor-default">Privacidade & Dados</span>
                </li>
                <li>
                  <span className="cursor-default">contato@conexaofeminina.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E5DFE3] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E6A73] gap-4">
            <p>© {new Date().getFullYear()} LinkDelas. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1 text-[#6E6A73]">
              Feito com <Heart className="w-3.5 h-3.5 text-[#7E3F8F] fill-[#7E3F8F]" /> por e para
              mulheres.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
