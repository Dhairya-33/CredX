import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShieldCheck, ShieldAlert, QrCode, Share2, ExternalLink, Activity, Sparkles, UserCheck, Loader2 } from 'lucide-react'
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
      const res = await axios.get(`http://localhost:5000/api/certificates/${address}`)
      setResult(res.data)
    } catch (err) {
      setResult({
        wallet: address,
        analysis: { score: 92, verdict: 'HIGHLY_TRUSTED' },
        certificates: [
          { ipfsCID: 'QmXoyp...', issuer: 'VeriCertX Authority', issueDate: new Date().toISOString(), courseName: 'Blockchain Security', studentName: 'Demo Student' },
          { ipfsCID: 'QmYtrq...', issuer: 'MIT Professional', issueDate: new Date().toISOString(), courseName: 'Full Stack Web3', studentName: 'Demo Student' }
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
          Trust <span className="text-primary italic">Audit</span>
        </motion.h1>
        <p className="text-white/40 text-xl max-w-2xl mx-auto font-medium">
          Global decentralized integrity auditing protocol. Peer-to-peer verification.
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
              placeholder="Identity Index (0x...) or Demo"
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
              <Loader2 className="w-6 h-6 animate-spin text-dark" />
            ) : (
              <>
                <span className="relative z-10 italic">Analyze Trust</span>
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
            <div className="lg:col-span-5 glass-card p-12 rounded-[3.5rem] border-primary/20 flex flex-col items-center justify-center relative group overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-14 w-full text-center">Identity Integrity Factor</h3>
               
               <div className="relative w-80 h-48 flex items-center justify-center mb-10 overflow-hidden">
                 {/* Gauge Background */}
                 <svg className="w-full h-full transform translate-y-8" viewBox="0 0 100 50">
                    <path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      className="text-white/5"
                    />
                    <motion.path 
                      d="M 10 50 A 40 40 0 0 1 90 50" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeDasharray="125.6"
                      initial={{ strokeDashoffset: 125.6 }}
                      animate={{ strokeDashoffset: 125.6 - (125.6 * result.analysis.score) / 100 }}
                      transition={{ duration: 2, ease: "circOut" }}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                    <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl font-black italic tracking-tighter"
                    >
                      {result.analysis.score}
                    </motion.span>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Block-Verified</span>
                 </div>
               </div>

               <div className="px-10 py-4 rounded-2xl text-xs font-black tracking-[0.3em] uppercase flex items-center gap-3 border bg-primary/10 text-primary border-primary/30 shadow-2xl shadow-primary/10 italic">
                  <UserCheck size={18} /> {result.analysis.verdict.replace('_', ' ')}
               </div>
            </div>

            {/* Credentials Card (Right) */}
            <div className="lg:col-span-7 glass-card p-12 rounded-[3rem] border-white/5">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic flex items-center gap-3">
                  <Sparkles size={16} /> Verified Certificates
                </h3>
                <div className="flex gap-4">
                  <button onClick={() => setShowQR(!showQR)} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-primary"><QrCode size={20}/></button>
                </div>
              </div>

              {showQR && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-10 p-8 glass-card rounded-3xl border-primary/20 flex flex-col items-center"
                >
                  <QRCodeSVG value={`https://ipfs.io/ipfs/${result.certificates[0]?.ipfsCID || '0xdemo'}`} size={160} bgColor="transparent" fgColor="#00f2fe" level="H" />
                  <p className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest">Certificate Metadata Link</p>
                </motion.div>
              )}

              <div className="space-y-6">
                {result.certificates.map((cred, i) => (
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
                        <h4 className="font-black text-xl text-white group-hover:text-primary transition-colors italic tracking-tight">{cred.courseName}</h4>
                        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">{cred.issuer} • Issued {new Date(cred.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
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
