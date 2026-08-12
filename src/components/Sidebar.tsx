import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FileText,
  Filter,
  CalendarDays,
  DollarSign,
  ListChecks,
  MessageSquare,
  Megaphone,
  GraduationCap,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/conteudo', label: 'Conteúdo', icon: FileText },
  { to: '/funil', label: 'Funil', icon: Filter },
  { to: '/calendario', label: 'Calendário', icon: CalendarDays },
  { to: '/comissoes', label: 'Comissões', icon: DollarSign },
  { to: '/plano-dia-1', label: 'Plano Dia 1', icon: ListChecks },
  { to: '/consultor-ia', label: 'Consultor IA', icon: MessageSquare },
  { to: '/canais', label: 'Canais de Divulgação', icon: Megaphone },
  { to: '/guia-afiliacao', label: 'Guia de Afiliação', icon: GraduationCap },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-bold">Sistema Afiliado</h1>
        <p className="text-sm text-slate-400">TikTok Shop</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 mb-2 truncate">{user?.email || 'usuário'}</p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>
    </aside>
  )
}
