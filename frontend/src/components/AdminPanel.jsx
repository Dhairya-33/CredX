import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, PlusCircle, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck, Activity } from 'lucide-react'
import axios from 'axios'
import confetti from 'canvas-confetti'

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    wallet: '0xdemo',
    course: '',
    issuer: 'VeriCertX Authority',
    grade: 'A+',
    category: 'Degree'
  })
  const [isListening, setIsListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus({ type: 'error', message: 'Speech recognition not supported in this browser.' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      if (transcript.includes('issue to')) {
        const parts = transcript.split('issue to ')[1].split(' for ');
        if (parts.length >= 2) {
          setFormData(prev => ({
            ...prev,
            name: parts[0].trim(),
            course: parts[1].trim()
          }));
        }
      }
    };
    recognition.start();
  }

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    try {
      const res = await axios.post('http://localhost:5000/api/issue-certificate', formData);
      if (res.data.success) {
        setStatus({ type: 'success', message: `Certificate Issued & Anchored. TX: ${res.data.txHash.substring(0, 10)}...` });
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#7000ff', '#ff00c1']
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to issue certificate. Check backend logs.' });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto pt-16 px-4">
      <div className="mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles size={14} /> Authority Level: VeriCert Admin
        </motion.div>
        <h2 className="text-5xl font-black mb-4 tracking-tight">Issue New <span className="text-primary italic">Certificate</span></h2>
        <p className="text-white/40 text-lg">Blockchain-backed Soulbound Certificates for verified achievements.</p>
      </div>

      <div className="glass-card p-10 md:p-12 rounded-[2.5rem] border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] -z-10" />
        
        <button 
          onClick={handleVoiceInput}
          className={`absolute top-10 right-10 p-5 rounded-2xl transition-all duration-500 hover:scale-110 ${
            isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110' : 'bg-white/5 hover:bg-white/10 text-primary hover:text-white'
          }`}
          title="Voice Command"
        >
          <Mic size={28} className={isListening ? 'animate-pulse text-white' : ''} />
        </button>

        <form onSubmit={handleIssue} className="space-y-8 flex flex-col xl:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <PlusCircle size={14} /> Student Full Name
                </label>
                <input 
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all text-lg font-medium"
                    placeholder="e.g. John Doe"
                />
                </div>
                <div className="space-y-3">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Student Wallet Address
                </label>
                <input 
                    type="text" required
                    value={formData.wallet}
                    onChange={e => setFormData({...formData, wallet: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all text-lg font-mono tracking-tighter"
                    placeholder="0x..."
                />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} /> Course Name
                    </label>
                    <input 
                    type="text" required
                    value={formData.course}
                    onChange={e => setFormData({...formData, course: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all text-lg font-medium"
                    placeholder="e.g. Web3 Engineering"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} /> Issue Date
                    </label>
                    <input 
                    type="date"
                    value={formData.date || new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all text-lg font-mono tracking-tighter"
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-dark font-black text-xl py-6 rounded-2xl mt-4 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(0,242,254,0.3)] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group uppercase tracking-tight"
            >
                {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck className="group-hover:rotate-12 transition-transform" />}
                Anchor to TrustChain
            </button>
          </div>

          {/* Live Preview Card */}
          <div className="w-full xl:w-[400px] shrink-0 sticky top-12">
             <div className="text-xs font-bold text-white/20 uppercase tracking-[0.3em] mb-4 text-center">Live Identity Preview</div>
             <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="glass-card p-10 rounded-[3rem] border-primary/20 bg-gradient-to-br from-white/5 to-primary/5 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-6 opacity-20"><ShieldCheck size={40} className="text-primary"/></div>
                <div className="space-y-8 relative z-10 text-center">
                    <div className="w-24 h-24 rounded-3xl bg-primary/20 mx-auto flex items-center justify-center border-2 border-primary/30">
                        <PlusCircle size={40} className="text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-black tracking-tight">{formData.name || 'Student Name'}</h4>
                        <p className="text-[10px] font-mono text-white/30 truncate">{formData.wallet || '0xWallet_Address'}</p>
                    </div>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1">Authenticated Course</p>
                        <p className="text-xl font-black italic">{formData.course || 'Select a Course'}</p>
                    </div>
                </div>
             </motion.div>
          </div>
        </form>

        <AnimatePresence>
          {status && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-10 p-6 rounded-2xl flex items-center gap-4 border ${
                status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {status.type === 'success' ? <CheckCircle className="shrink-0" size={24}/> : <AlertCircle className="shrink-0" size={24}/>}
              <span className="font-bold text-lg">{status.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-10 opacity-30">
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em]"><ShieldCheck size={16} /> IPFS Pinned</div>
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em]"><Activity size={16} /> Heartbeat Active</div>
        <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em]"><Sparkles size={16} /> AI Calibrated</div>
      </div>
    </div>
  )
}

export default AdminPanel
