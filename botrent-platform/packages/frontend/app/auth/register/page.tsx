'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const form = e.target as HTMLFormElement
    const firstName = (form.querySelector('[name="firstName"]') as HTMLInputElement).value
    const email = (form.querySelector('[name="email"]') as HTMLInputElement).value
    const password = (form.querySelector('[name="password"]') as HTMLInputElement).value

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ firstName, email, password })
      })
      
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess(true)
      setTimeout(() => { window.location.href = '/auth/login' }, 2000)
      
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a1a',color:'white',textAlign:'center'}}>
        <div>
          <h1 style={{fontSize:32,marginBottom:20}}>✅ Registration successful!</h1>
          <p style={{color:'#9ca3af'}}>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a1a',color:'white'}}>
      <div style={{width:'400px',padding:40,background:'#1a1a2e',borderRadius:16}}>
        <h1 style={{textAlign:'center',marginBottom:10,fontSize:28}}>🚀 BotRent</h1>
        <p style={{textAlign:'center',marginBottom:30,color:'#9ca3af'}}>Create account</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:15}}>
            <label style={{display:'block',marginBottom:5,fontSize:14}}>Name</label>
            <input name="firstName" placeholder="Ivan" required 
              style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #374151',background:'#111827',color:'white',fontSize:16,boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:15}}>
            <label style={{display:'block',marginBottom:5,fontSize:14}}>Email</label>
            <input name="email" type="email" placeholder="you@example.com" required 
              style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #374151',background:'#111827',color:'white',fontSize:16,boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:'block',marginBottom:5,fontSize:14}}>Password</label>
            <input name="password" type="password" placeholder="••••••••" required 
              style={{width:'100%',padding:12,borderRadius:8,border:'1px solid #374151',background:'#111827',color:'white',fontSize:16,boxSizing:'border-box'}} />
          </div>
          
          {error && (
            <div style={{padding:12,marginBottom:15,borderRadius:8,background:'#7f1d1d',color:'#fca5a5',fontSize:14}}>
              {error}
            </div>
          )}
          
          <button type="submit" disabled={loading} 
            style={{width:'100%',padding:14,background:loading?'#2563eb':'#3b82f6',color:'white',border:'none',borderRadius:8,fontSize:16,cursor:'pointer',fontWeight:600}}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        
        <div style={{textAlign:'center',marginTop:20,fontSize:14}}>
          Have account?{' '}
          <Link href="/auth/login" style={{color:'#3b82f6',textDecoration:'none'}}>Sign in</Link>
        </div>
        <div style={{textAlign:'center',marginTop:10}}>
          <Link href="/" style={{color:'#6b7280',fontSize:14,textDecoration:'none'}}>← Home</Link>
        </div>
      </div>
    </div>
  )
}
