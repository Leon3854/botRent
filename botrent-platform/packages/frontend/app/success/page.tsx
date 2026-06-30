'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { fetchApi } from '@/lib/api-client'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Обрабатываем ваш платёж...')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    if (paymentId) {
      fetchApi(`/payments/${paymentId}/status`)
        .then((data: any) => {
          if (data.status === 'succeeded') {
            setMessage('Оплата прошла успешно! Ваша подписка активирована.')
            setIsVerified(true)
          } else {
            setMessage('Платёж обрабатывается. Мы уведомим вас, когда подписка будет активирована.')
          }
        })
        .catch(() => {
          setMessage('Оплата прошла успешно! Подписка будет активирована в ближайшее время.')
          setIsVerified(true)
        })
    } else {
      setMessage('Оплата прошла успешно! Подписка будет активирована в ближайшее время.')
      setIsVerified(true)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Оплата прошла успешно!</h1>
        <p className="text-muted-foreground mb-8">{message}</p>
        
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center space-x-2 w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <span>Перейти в личный кабинет</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 w-full border border-border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>На главную</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
