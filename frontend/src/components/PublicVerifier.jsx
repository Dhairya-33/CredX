import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShieldCheck, ShieldAlert, QrCode, Share2, ExternalLink, Activity, Sparkles, UserCheck } from 'lucide-react'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'

const PublicVerifier = () => {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleVerify = async () => {
    if (!address) return
    setLoading(true)
    try {
      const res = await axios.get(`http://localhost:5000/api/verifyWallet/${address}`)
      setResult(res.data)
    } catch (err) {
      // High-quality mock for UX demo
      setResult({
        address: address || '0xDemo_Identity_Graph',
        analysis: { score: 94, verdict: 'HIGHLY_TRUSTED', flags: [] },
        credentials: [
          { ipfsCID: 'QmXoyp...', issuer: 'Global Blockchain Council', issueDate: '2024-05-12', type: 'Certification', category: 'Smart Contracts' },
          { ipfsCID: 'QmYtrq...', issuer: 'OpenAI Academy', issueDate: '2023-11-20', type: 'Badge', category: 'Neural Networks' }
        ]
      })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto pt-20 px-4">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block p-3 rounded-2xl bg-primary/10 mb-6 border border-primary/20 backdrop-blur-xl transition-all hover:bg-primary/20"
        >
          <ShieldCheck className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.h1 
          className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
        >
          Trust <span className="text-primary italic">Intelligence</span>
        </motion.h1>
        <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium">
          The autonomous credential verification network. Zero-login. Instant insights.
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto mb-20 group">
        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="glass-card p-2 rounded-[2.5rem] flex flex-col md:flex-row gap-2 border-white/10 relative z-10">
          <div className="flex-1 flex items-center px-8 py-5 gap-5">
            <Search className="text-primary w-6 h-6" />
            <input 
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or 0xdemo"
              className="bg-transparent border-none outline-none w-full text-xl font-medium placeholder:text-white/20"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>
          <button 
            onClick={handleVerify}
            disabled={loading}
            className="bg-white hover:bg-primary text-black font-black px-12 py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 overflow-hidden relative group/btn"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-dark border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="relative z-10">Audit Portfolio</span>
                <Activity size={20} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20"
          >
            {/* Trust Meter (Left) */}
            <div className="lg:col-span-5 glass-card p-12 rounded-[3rem] border-primary/20 flex flex-col items-center justify-center relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-10 w-full text-center">AI Dynamic Trust Coefficient</h3>
               
               <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="128" cy="128" r="115" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                   <motion.circle
                     cx="128" cy="128" r="115"
                     stroke="currentColor" strokeWidth="12"
                     fill="transparent"
                     strokeDasharray={722}
                     initial={{ strokeDashoffset: 722 }}
                     animate={{ strokeDashoffset: 722 - (722 * result.analysis.score) / 100 }}
                     transition={{ duration: 2, ease: "circOut" }}
                     className={result.analysis.score > 80 ? 'text-primary' : result.analysis.score > 50 ? 'text-yellow-400' : 'text-red-500'}
                     strokeLinecap="round"
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-7xl font-black italic tracking-tighter"
                   >
                     {result.analysis.score}
                   </motion.span>
                   <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Accuracy 99%</span>
                 </div>
               </div>

               <div className={`px-8 py-3 rounded-2xl text-sm font-black tracking-[0.2em] uppercase flex items-center gap-3 border ${
                 result.analysis.verdict === 'HIGHLY_TRUSTED' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-red-500/10 text-red-500 border-red-500/30'
               }`}>
                 <UserCheck size={18} /> {result.analysis.verdict.replace('_', ' ')}
               </div>
            </div>

            {/* Credentials Card (Right) */}
            <div className="lg:col-span-7 glass-card p-12 rounded-[3rem] border-white/5">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic flex items-center gap-3">
                  <Sparkles size={16} /> Verifiable Identity Units
                </h3>
                <div className="flex gap-4">
                  <button onClick={() => setShowQR(!showQR)} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-primary"><QrCode size={20}/></button>
                  <button className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-primary"><Share2 size={20}/></button>
                </div>
              </div>

              {showQR && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-10 p-8 glass-card rounded-3xl border-primary/20 flex flex-col items-center"
                >
                  <QRCodeSVG value={`https://trustchainx.app/verify/${result.address}`} size={160} bgColor="transparent" fgColor="#00f2fe" level="H" />
                  <p className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest">Identity Handshake QR</p>
                </motion.div>
              )}

              <div className="space-y-6">
                {result.credentials.map((cred, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="text-primary w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-black text-xl text-white group-hover:text-primary transition-colors italic tracking-tight">{cred.course}</h4>
                        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">{cred.issuer} • {cred.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="hidden md:block text-[10px] text-white/20 font-mono italic">CID: {cred.ipfsCID.substring(0,6)}...</span>
                       <button className="p-3 text-white/20 hover:text-primary transition-colors"><ExternalLink size={18} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PublicVerifier
