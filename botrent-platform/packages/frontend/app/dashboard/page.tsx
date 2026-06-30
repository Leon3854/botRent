'use client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [bots, setBots] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddBot, setShowAddBot] = useState(false)
  const [newBot, setNewBot] = useState({ name: '', type: 'booking', botToken: '', botUsername: '' })
  const [checking, setChecking] = useState(true)

  const getToken = () => localStorage.getItem('token')

  const logout = () => {
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  const apiFetch = async (url: string, options: any = {}) => {
    const token = getToken()
    if (!token) { logout(); return null }
    
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (res.status === 401) {
      logout()
      return null
    }
    return res
  }

  const loadData = async () => {
    const res1 = await apiFetch('http://localhost:4000/api/auth/me')
    if (!res1) return
    setUser(await res1.json())
    setChecking(false)

    const res2 = await fetch('http://localhost:4000/api/plans')
    const data = await res2.json()
    setPlans(data.map((p: any) => ({
      ...p, features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
    })))

    const res3 = await apiFetch('http://localhost:4000/api/subscriptions/active')
    if (res3 && res3.ok) setSubscription(await res3.json())

    const res4 = await apiFetch('http://localhost:4000/api/bots')
    if (res4 && res4.ok) setBots(await res4.json())
  }

  useEffect(() => { loadData() }, [])

  const activatePlan = async (planId: number) => {
    setLoading(true)
    await apiFetch('http://localhost:4000/api/subscriptions', {
      method: 'POST', body: JSON.stringify({ planId })
    })
    await apiFetch('http://localhost:4000/api/subscriptions/activate-test', { method: 'POST' })
    setMessage('Activated!')
    setTimeout(() => window.location.reload(), 1000)
  }

  const createBot = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await apiFetch('http://localhost:4000/api/bots', {
      method: 'POST', body: JSON.stringify(newBot)
    })
    if (res && res.ok) {
      setShowAddBot(false)
      setNewBot({ name: '', type: 'booking', botToken: '', botUsername: '' })
      loadData()
    }
  }

  const toggleBot = async (botId: number, isActive: boolean) => {
    await apiFetch(`http://localhost:4000/api/bots/${botId}/${isActive ? 'stop' : 'start'}`, { method: 'POST' })
    loadData()
  }

  const deleteBot = async (botId: number) => {
    if (!confirm('Delete?')) return
    await apiFetch(`http://localhost:4000/api/bots/${botId}`, { method: 'DELETE' })
    loadData()
  }

  if (checking) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a1a',color:'white',fontSize:20}}>Loading...</div>

  return (
    <div style={{minHeight:'100vh',background:'#0a0a1a',color:'white'}}>
      <div style={{background:'#111827',padding:'15px 30px',display:'flex',justifyContent:'space-between'}}>
        <a href="/" style={{fontSize:24,fontWeight:'bold',color:'white',textDecoration:'none'}}>BotRent</a>
        <button onClick={logout} style={{padding:'8px 16px',background:'#ef4444',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>Exit</button>
      </div>
      <div style={{maxWidth:1000,margin:'0 auto',padding:40}}>
        {subscription ? (
          <div style={{background:'#065f46',padding:20,borderRadius:12,marginBottom:20}}>
            Active: {subscription.plan?.name} — {subscription.plan?.price} rub/mo
          </div>
        ) : (
          <div style={{background:'#7f1d1d',padding:20,borderRadius:12,marginBottom:20}}>No subscription</div>
        )}
        {message && <div style={{padding:20,borderRadius:12,marginBottom:20,background:message.includes('Error')?'#7f1d1d':'#065f46'}}>{message}</div>}
        
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:20,marginBottom:30}}>
          <div style={{background:'#1a1a2e',padding:20,borderRadius:16}}>
            <h3>{user?.firstName}</h3>
            <p style={{color:'#9ca3af'}}>{user?.email}</p>
          </div>
          <div style={{background:'#1a1a2e',padding:20,borderRadius:16}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:15}}>
              <h3 style={{margin:0}}>Bots ({Array.isArray(bots)?bots.length:0})</h3>
              {subscription && <button onClick={()=>setShowAddBot(true)} style={{padding:'8px 16px',background:'#3b82f6',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>+ New</button>}
            </div>
            {(Array.isArray(bots)?bots:[]).map((bot:any)=>(
              <div key={bot.id} style={{background:'#111827',padding:10,borderRadius:8,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <strong>{bot.name}</strong>
                  <span style={{marginLeft:10,color:bot.isActive?'#10b981':'#ef4444',fontSize:12}}>{bot.isActive?'ON':'OFF'}</span>
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button onClick={()=>toggleBot(bot.id,bot.isActive)} style={{padding:'4px 10px',borderRadius:4,border:'none',background:bot.isActive?'#dc2626':'#10b981',color:'white',fontSize:11,cursor:'pointer'}}>{bot.isActive?'Stop':'Start'}</button>
                  <button onClick={()=>deleteBot(bot.id)} style={{padding:'4px 10px',borderRadius:4,border:'1px solid #ef4444',background:'transparent',color:'#ef4444',fontSize:11,cursor:'pointer'}}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!subscription && plans.map((plan,i)=>(
          <div key={plan.id} style={{background:i===1?'#1e3a5f':'#1a1a2e',padding:20,borderRadius:12,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><strong>{plan.name}</strong> — {plan.price} rub/mo</div>
            <button onClick={()=>activatePlan(plan.id)} style={{padding:'8px 20px',background:'#3b82f6',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>Activate</button>
          </div>
        ))}

        {showAddBot && (
          <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
            <div style={{background:'#1a1a2e',padding:25,borderRadius:16,width:400}}>
              <h3 style={{marginBottom:15}}>New Bot</h3>
              <form onSubmit={createBot}>
                <input placeholder="Name" value={newBot.name} onChange={e=>setNewBot({...newBot,name:e.target.value})} required style={{width:'100%',padding:8,marginBottom:8,borderRadius:6,border:'1px solid #374151',background:'#111827',color:'white',boxSizing:'border-box'}} />
                <input placeholder="Token" value={newBot.botToken} onChange={e=>setNewBot({...newBot,botToken:e.target.value})} required style={{width:'100%',padding:8,marginBottom:8,borderRadius:6,border:'1px solid #374151',background:'#111827',color:'white',boxSizing:'border-box'}} />
                <input placeholder="@username" value={newBot.botUsername} onChange={e=>setNewBot({...newBot,botUsername:e.target.value})} required style={{width:'100%',padding:8,marginBottom:8,borderRadius:6,border:'1px solid #374151',background:'#111827',color:'white',boxSizing:'border-box'}} />
                <select value={newBot.type} onChange={e=>setNewBot({...newBot,type:e.target.value})} style={{width:'100%',padding:8,marginBottom:15,borderRadius:6,border:'1px solid #374151',background:'#111827',color:'white'}}>
                  <option value="booking">Booking</option><option value="quiz">Quiz</option><option value="catalog">Catalog</option><option value="notifications">Notifications</option>
                </select>
                <div style={{display:'flex',gap:10}}>
                  <button type="button" onClick={()=>setShowAddBot(false)} style={{flex:1,padding:10,background:'#374151',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>Cancel</button>
                  <button type="submit" style={{flex:1,padding:10,background:'#3b82f6',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
