import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, ChevronRight, Share2, Download, Filter, MapPin, ShieldCheck, Activity, Sparkles, Zap } from 'lucide-react'
import axios from 'axios'

const UserDashboard = () => {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/verifyWallet/0xdemo')
        setData(res.data)
      } catch (e) {
        setData({
          address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          analysis: { score: 98, verdict: 'HIGHLY_TRUSTED' },
          credentials: [
            { id: 1, course: 'Global AI Championship Winner', issuer: 'DeepMind Labs', date: '2025-02-12', category: 'Achievement', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800' },
            { id: 2, course: 'Distinguished Blockchain Architect', issuer: 'Ethereum Foundation', date: '2024-08-20', category: 'Degree', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800' },
            { id: 3, course: 'Cybersecurity Sentinel', issuer: 'NATO Cyber Force', date: '2024-01-05', category: 'Skill', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' }
          ]
        })
      }
    }
    fetchData()
  }, [])

  if (!data) return (
    <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <span className="text-primary font-black italic tracking-widest animate-pulse uppercase">Syncing with Node...</span>
        </div>
    </div>
  )

  return (
    <div className="pt-20 space-y-16 pb-24">
      {/* Elite User Header */}
      <div className="flex flex-col md:flex-row items-center gap-12 glass-card p-12 md:p-16 rounded-[4rem] border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[150px] -z-10 group-hover:bg-primary/10 transition-all duration-700" />
        
        <div className="relative">
          <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-white/5 p-2 group-hover:border-primary/20 transition-all duration-500 transform group-hover:rotate-6">
            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.address}`} alt="Avatar" className="w-full h-full object-cover rounded-[2.5rem] bg-gradient-to-br from-primary to-accent" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -bottom-4 -right-4 bg-primary p-4 rounded-3xl shadow-[0_0_30px_rgba(0,242,254,0.5)] border-4 border-dark"
          >
            <ShieldCheck size={28} className="text-dark" />
          </motion.div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <h1 className="text-6xl font-black italic tracking-tighter">Sovereign <span className="text-primary">Identity</span></h1>
              <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
            </div>
            <p className="text-white/30 font-mono text-lg tracking-widest uppercase">{data.address.substring(0, 12)}...{data.address.substring(data.address.length - 8)}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-3 text-primary text-sm font-black bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl uppercase tracking-[0.2em]">
              <Sparkles size={18}/> Level 99 Elite
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm font-bold bg-white/5 px-6 py-3 rounded-2xl uppercase tracking-widest backdrop-blur-md">
              <MapPin size={18} className="text-primary"/> Distributed Node
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button className="px-8 py-5 rounded-[2rem] bg-white text-dark font-black hover:bg-primary hover:text-dark transition-all flex items-center gap-3 uppercase text-sm tracking-widest"><Share2 size={20}/> Broadcast</button>
          <button className="px-8 py-5 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-black flex items-center gap-3 uppercase text-sm tracking-widest"><Download size={20}/> Export Vault</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Elite Gallery */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black italic flex items-center gap-4">
              <Award className="text-primary w-10 h-10" /> On-Chain <span className="text-primary">Artifacts</span>
            </h2>
            <div className="h-[2px] flex-1 mx-8 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.credentials.map((cred, i) => (
              <motion.div 
                key={cred.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                className="group relative h-96 rounded-[3rem] overflow-hidden glass-card border-none cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img src={cred.image} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700 scale-110 group-hover:scale-100" alt={cred.course} />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                  <div className="space-y-4">
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/30 px-3 py-1 rounded-full bg-primary/5">{cred.category}</span>
                    <h3 className="text-3xl font-black leading-none group-hover:text-primary transition-colors tracking-tighter">{cred.course}</h3>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{cred.issuer}</p>
                        <p className="text-[10px] text-white/20 font-mono">{cred.issueDate || cred.date}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Timeline */}
        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-3xl font-black italic flex items-center gap-4">
            <Clock className="text-accent w-10 h-10" /> Trust <span className="text-accent">Timeline</span>
          </h2>
          
          <div className="glass-card p-10 rounded-[3.5rem] border-white/10 space-y-12 relative overflow-hidden">
            <div className="absolute left-[3.4rem] top-24 bottom-24 w-[2px] bg-gradient-to-b from-primary via-accent to-transparent opacity-20" />
            
            {data.credentials.map((cred, i) => (
              <div key={i} className="flex gap-8 relative group">
                <div className="w-12 h-12 rounded-2xl bg-dark border-2 border-white/10 flex items-center justify-center z-10 group-hover:border-primary transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                    <Zap className="text-white/20 group-hover:text-primary transition-colors" size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{new Date(cred.issueDate || cred.date).getFullYear() || '2025'} Edition</span>
                  <h4 className="font-black text-xl italic group-hover:text-primary transition-all tracking-tight leading-tight">{cred.course}</h4>
                  <p className="text-[10px] text-white/20 font-mono break-all uppercase">Verified_Node_Signal_Success_#{Math.floor(Math.random() * 999999)}</p>
                </div>
              </div>
            ))}
            
            <button className="w-full mt-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.3em] text-white/30 hover:bg-white/10 hover:text-white transition-all italic">
              Access Full Identity Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Loader2 = ({className, size}) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>

export default UserDashboard
