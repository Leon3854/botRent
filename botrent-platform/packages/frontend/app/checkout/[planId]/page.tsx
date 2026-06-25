'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api-client'
import { Plan } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchApi<Plan[]>(`/plans`)
      .then(data => {
        const foundPlan = data.find(p => p.id === Number(params.planId))
        if (foundPlan) {
          setPlan(foundPlan)
        } else {
          setError('Тариф не найден')
        }
      })
      .catch(() => setError('Ошибка загрузки тарифа'))
      .finally(() => setLoading(false))
  }, [params.planId])

  const handlePayment = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    setIsProcessing(true)
    setError('')
    
    try {
      const response = await fetchApi<{ confirmation_url: string }>('/payments/create', {
        method: 'POST',
        body: JSON.stringify({ planId: plan?.id }),
      })
      
      if (response.confirmation_url) {
        window.location.href = response.confirmation_url
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании платежа')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Тариф не найден'}</p>
          <Link href="/" className="text-primary hover:underline">Вернуться на главную</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/#pricing" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к тарифам
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Оформление подписки</h1>
            <p className="text-muted-foreground">Тариф «{plan.name}»</p>
          </div>

          <div className="p-8 rounded-2xl bg-card/50 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <div className="text-right">
                <span className="text-3xl font-bold">{plan.price.toLocaleString()} ₽</span>
                <span className="text-muted-foreground">/мес</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature: string) => (
                <li key={feature} className="flex items-center text-muted-foreground">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                'Создание платежа...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Оплатить {plan.price.toLocaleString()} ₽</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Нажимая «Оплатить», вы соглашаетесь с условиями использования</p>
            <div className="mt-2 space-x-4">
              <Link href="/privacy" className="hover:underline">Политика конфиденциальности</Link>
              <Link href="/terms" className="hover:underline">Условия использования</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}