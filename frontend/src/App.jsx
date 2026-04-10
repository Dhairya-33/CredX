import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, LayoutDashboard, Search, PlusCircle, Activity, Globe, Zap, Bell } from 'lucide-react'
import PublicVerifier from './components/PublicVerifier'
import AdminPanel from './components/AdminPanel'
import UserDashboard from './components/UserDashboard'

function App() {
  const [activeTab, setActiveTab] = useState('verifier')

  const navItems = [
    { id: 'verifier', name: 'Identity Audit', icon: Search },
    { id: 'admin', name: 'Authority Port', icon: PlusCircle },
    { id: 'dashboard', name: 'Trust Profile', icon: LayoutDashboard },
  ]

  return (
    <div className="min-h-screen bg-elite-mesh relative overflow-hidden font-['Outfit']">
      {/* Dynamic Aura Background */}
      <div className="fixed top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[160px] pointer-events-none animate-pulse" />

      {/* Elite Universal Header */}
      <header className="sticky top-0 z-[100] translate-y-4 px-6 md:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto glass-card rounded-[2.5rem] border-white/5 px-10 py-5 flex items-center justify-between pointer-events-auto backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('verifier')}>
            <div className="bg-gradient-to-tr from-primary via-accent to-pink-500 p-3 rounded-2xl group-hover:rotate-[15deg] transition-transform duration-500 shadow-lg shadow-primary/20">
              <Shield className="w-8 h-8 text-dark" />
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black italic tracking-tighter leading-none">
                TrustChain<span className="text-primary italic">X</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">L2 Identity Protocol</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-3 bg-white/[0.03] p-1.5 rounded-[2rem] border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-8 py-3.5 rounded-full transition-all duration-500 relative group/nav ${
                    activeTab === item.id 
                    ? 'bg-white text-dark shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                   {activeTab === item.id && (
                    <motion.div 
                        layoutId="nav-bg"
                        className="absolute inset-0 bg-white rounded-full -z-10"
                        transition={{ type: 'spring', duration: 0.6 }}
                    />
                  )}
                  <Icon size={18} className={activeTab === item.id ? 'animate-bounce' : 'group-hover/nav:scale-110 transition-transform'} />
                  <span className="font-black text-sm uppercase tracking-widest">{item.name}</span>
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end gap-1">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                 <span className="text-xs font-black text-primary uppercase tracking-widest">Global Mainnet</span>
               </div>
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Block Height: #892,104</span>
            </div>
            
            <div className="flex gap-3">
                <button className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"><Bell size={20}/></button>
                <button className="bg-white text-black font-black px-10 py-5 rounded-full flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/10 uppercase text-xs tracking-[0.2em] group">
                    <Zap size={16} className="group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all" /> Auth Wallet
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Execution Content */}
      <main className="container mx-auto px-6 pt-16 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -50, filter: 'blur(20px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'verifier' && <PublicVerifier />}
            {activeTab === 'admin' && <AdminPanel />}
            {activeTab === 'dashboard' && <UserDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Elite Floating Footer (Mobile) */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] glass-card rounded-[2.5rem] p-3 flex justify-around border-white/10 z-[100] backdrop-blur-3xl shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-5 rounded-3xl transition-all duration-500 scale-100 active:scale-90 ${
                activeTab === item.id ? 'bg-primary text-dark shadow-[0_0_20px_rgba(0,242,254,0.4)] rotate-[8deg]' : 'text-white/30'
              }`}
            >
              <Icon size={28} />
            </button>
          )
        })}
      </div>
      
      {/* Global Metadata */}
      <div className="fixed bottom-6 left-6 hidden xxl:block">
         <div className="flex items-center gap-4 text-white/10 font-black italic tracking-[0.5em] text-[10px] uppercase">
            <Globe size={14} /> Global Trust Handshake Protocol v1.4.2
         </div>
      </div>
    </div>
  )
}

export default App
