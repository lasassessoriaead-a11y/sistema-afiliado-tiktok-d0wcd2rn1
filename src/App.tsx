import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import Content from '@/pages/Content'
import Funnel from '@/pages/Funnel'
import Calendar from '@/pages/Calendar'
import Commissions from '@/pages/Commissions'
import PlanDay1 from '@/pages/PlanDay1'
import Consultant from '@/pages/Consultant'
import PromotionChannels from '@/pages/PromotionChannels'
import AffiliationGuide from '@/pages/AffiliationGuide'
import NotFound from '@/pages/NotFound'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/conteudo" element={<Content />} />
            <Route path="/funil" element={<Funnel />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/comissoes" element={<Commissions />} />
            <Route path="/plano-dia-1" element={<PlanDay1 />} />
            <Route path="/consultor-ia" element={<Consultant />} />
            <Route path="/canais" element={<PromotionChannels />} />
            <Route path="/guia-afiliacao" element={<AffiliationGuide />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
