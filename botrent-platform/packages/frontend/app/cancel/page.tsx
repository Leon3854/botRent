'use client'

import { motion } from 'framer-motion'
import { XCircle, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Оплата отменена</h1>
        <p className="text-muted-foreground mb-8">
          Вы отменили оплату. Если у вас возникли проблемы, свяжитесь с нашей поддержкой.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center space-x-2 w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <span>Попробовать снова</span>
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