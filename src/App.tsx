/* Main App Component - Handles routing (using react-router-dom), query client and other providers */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'

import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Welcome from './pages/Welcome'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import ConfirmEmailChange from './pages/ConfirmEmailChange'
import Catalog from './pages/Catalog'
import About from './pages/About'
import Terms from './pages/Terms'
import ProviderProfile from './pages/ProviderProfile'
import Quotes from './pages/Quotes'
import QuoteDetail from './pages/QuoteDetail'
import Messages from './pages/Messages'
import Subscribe from './pages/Subscribe'
import SettingsPage from './pages/Settings'

// Guard for routes that require an authenticated user
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-[#6E6A73]">Verificando credenciais...</div>
    )
  }
  if (!user) {
    return <Navigate to="/entrar" replace />
  }
  return <>{children}</>
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            {/* Main dashboard (differentiated by client / provider or redirects to /entrar if logged out) */}
            <Route path="/" element={<Index />} />

            {/* Auth routes */}
            <Route path="/entrar" element={<SignIn />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/boas-vindas" element={<Welcome />} />
            <Route path="/recuperar-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/verificar-email" element={<VerifyEmail />} />
            <Route path="/confirmar-alteracao-email" element={<ConfirmEmailChange />} />

            {/* Public / Marketplace routes */}
            <Route path="/sobre" element={<About />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/prestadoras/:id" element={<ProviderProfile />} />

            {/* Protected authenticated routes */}
            <Route
              path="/orcamentos"
              element={
                <ProtectedRoute>
                  <Quotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orcamentos/:id"
              element={
                <ProtectedRoute>
                  <QuoteDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mensagens"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assinar"
              element={
                <ProtectedRoute>
                  <Subscribe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
