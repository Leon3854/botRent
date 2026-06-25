'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bot, LayoutDashboard, CreditCard, LogOut, Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    router.push('/auth/login')
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Мобильное меню */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span className="font-bold">BotRent</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Боковая панель */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-full bg-card border-r border-border/40 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">BotRent</span>
          </Link>
          
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Обзор</span>
            </Link>
            <Link
              href="/dashboard/bots"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Bot className="w-5 h-5" />
              <span>Мои боты</span>
            </Link>
            <Link
              href="/dashboard/subscription"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CreditCard className="w-5 h-5" />
              <span>Подписка</span>
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors w-full text-muted-foreground"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}