'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, CreditCard, Clock, Plus, Settings, Power, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api-client'
import { Bot as BotType, Subscription, Payment } from '@/types'

export default function DashboardPage() {
  const [bots, setBots] = useState<BotType[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchApi<BotType[]>('/bots'),
      fetchApi<Subscription>('/subscriptions/active').catch(() => null),
      fetchApi<Payment[]>('/payments').catch(() => []),
    ]).then(([botsData, subData, paymentsData]) => {
      setBots(botsData)
      setSubscription(subData)
      setPayments(paymentsData)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const handleToggleBot = async (botId: number, isActive: boolean) => {
    try {
      const endpoint = isActive ? `/bots/${botId}/stop` : `/bots/${botId}/start`
      await fetchApi(endpoint, { method: 'POST' })
      setBots(prev => prev.map(bot => 
        bot.id === botId ? { ...bot, isActive: !isActive } : bot
      ))
    } catch (error) {
      console.error('Ошибка переключения бота:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Добро пожаловать в BotRent</h1>
        <p className="text-muted-foreground">Управляйте своими ботами и подпиской</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card/50 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Активные боты</h3>
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{bots.filter(b => b.isActive).length}</p>
          <p className="text-sm text-muted-foreground">из {bots.length} созданных</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card/50 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Тариф</h3>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          {subscription ? (
            <>
              <p className="text-3xl font-bold">{subscription.plan.name}</p>
              <p className="text-sm text-muted-foreground">
                {subscription.status === 'active' ? 'Активен' : subscription.status}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl text-muted-foreground">Нет подписки</p>
              <Link href="/#pricing" className="text-sm text-primary hover:underline">
                Выбрать тариф
              </Link>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-card/50 border border-border/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Платежи</h3>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{payments.length}</p>
          <p className="text-sm text-muted-foreground">за всё время</p>
        </motion.div>
      </div>

      {/* Боты */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Мои боты</h2>
          <Link
            href="/dashboard/bots/new"
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Создать бота</span>
          </Link>
        </div>

        <div className="grid gap-4">
          {bots.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>У вас ещё нет созданных ботов</p>
            </div>
          ) : (
            bots.map((bot) => (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {bot.botUsername ? `@${bot.botUsername}` : 'Не подключен'}
                      </p>
                      <p className="text-xs text-muted-foreground">Тип: {bot.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bot.isActive 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {bot.isActive ? 'Активен' : 'Остановлен'}
                    </span>
                    <button
                      onClick={() => handleToggleBot(bot.id, bot.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        bot.isActive 
                          ? 'hover:bg-destructive/10 text-destructive' 
                          : 'hover:bg-primary/10 text-primary'
                      }`}
                      title={bot.isActive ? 'Остановить бота' : 'Запустить бота'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/bots/${bot.id}`}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                      title="Настройки бота"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* История платежей */}
      {payments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">История платежей</h2>
          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Дата</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Сумма</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Статус</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/50 last:border-0">
                    <td className="p-4 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 font-medium">{payment.amount.toLocaleString()} ₽</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'succeeded'
                          ? 'bg-green-500/10 text-green-500'
                          : payment.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {payment.status === 'succeeded' ? 'Оплачен' : 
                         payment.status === 'pending' ? 'В обработке' : 'Отменён'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
