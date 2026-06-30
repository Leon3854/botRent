'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ShoppingCart, Headphones, Check, ArrowRight, Menu, X, Bot } from 'lucide-react'
import { landingContent } from '@/content/landing'
import { fetchApi } from '@/lib/api-client'
import { Plan } from '@/types'

const iconMap: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="w-6 h-6" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
}

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', business: '', botType: 'booking' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    fetchApi<Plan[]>('/plans')
      .then(data => {
        // Парсим features если это строка JSON
        const parsedData = data.map((plan: any) => ({
          ...plan,
          features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features
        }))
        setPlans(parsedData)
      })
      .catch(console.error)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    try {
      await fetchApi('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      setSubmitMessage('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.')
      setFormData({ name: '', phone: '', business: '', botType: 'booking' })
    } catch (error: any) {
      setSubmitMessage(error.message || 'Произошла ошибка. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Навигация */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">BotRent</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Возможности</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">Как работает</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Тарифы</a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">Войти</Link>
            <Link href="/auth/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
              Регистрация
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b border-border/40 p-4 space-y-4">
            <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">Возможности</a>
            <a href="#how-it-works" className="block text-muted-foreground hover:text-foreground transition-colors">Как работает</a>
            <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">Тарифы</a>
            <Link href="/auth/login" className="block text-muted-foreground hover:text-foreground transition-colors">Войти</Link>
            <Link href="/auth/register" className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center">Регистрация</Link>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="container px-4 mx-auto relative">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
              >
                {landingContent.hero.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-muted-foreground mb-8"
              >
                {landingContent.hero.subtitle}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="#pricing" className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center">
                  {landingContent.hero.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Возможности платформы</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {landingContent.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {iconMap[feature.icon]}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-card/30">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {landingContent.howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">{landingContent.plansTitle}</h2>
            <p className="text-center text-muted-foreground mb-12">{landingContent.plansSubtitle}</p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => {
                // Убеждаемся что features это массив
                const features = Array.isArray(plan.features) ? plan.features : 
                                typeof plan.features === 'string' ? JSON.parse(plan.features) : []
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-8 rounded-2xl border backdrop-blur-sm ${
                      index === 1 
                        ? 'bg-primary/10 border-primary/50 scale-105' 
                        : 'bg-card/50 border-border/50'
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price.toLocaleString()} ₽</span>
                      <span className="text-muted-foreground">/мес</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center text-muted-foreground">
                          <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/checkout/${plan.id}`}
                      className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                        index === 1
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'border border-border hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      Выбрать тариф
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section className="py-20 bg-card/30">
          <div className="container px-4 mx-auto max-w-xl">
            <h2 className="text-3xl font-bold text-center mb-8">Оставьте заявку</h2>
            <form onSubmit={handleLeadSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Имя</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="business" className="block text-sm font-medium mb-2">Сфера бизнеса</label>
                <input
                  type="text"
                  id="business"
                  name="business"
                  value={formData.business}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="botType" className="block text-sm font-medium mb-2">Тип бота</label>
                <select
                  id="botType"
                  name="botType"
                  value={formData.botType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                >
                  <option value="booking">Запись клиентов</option>
                  <option value="quiz">Квиз</option>
                  <option value="catalog">Каталог</option>
                  <option value="notifications">Уведомления</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
              {submitMessage && (
                <p className={`text-center ${submitMessage.includes('ошибк') ? 'text-destructive' : 'text-green-500'}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{landingContent.ctaSection.title}</h2>
            <p className="text-muted-foreground mb-8">{landingContent.ctaSection.subtitle}</p>
            <Link href="/auth/register" className="inline-flex items-center bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              {landingContent.ctaSection.button}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40">
        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground">{landingContent.footer.copyright}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Политика конфиденциальности</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Условия использования</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}