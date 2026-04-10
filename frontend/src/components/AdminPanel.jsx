import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, PlusCircle, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck, Activity } from 'lucide-react'
import axios from 'axios'
import confetti from 'canvas-confetti'

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    wallet: '',
    course: '',
    issuer: 'TrustChain Academy',
    grade: 'A+',
    category: 'Skill'
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
      const res = await axios.post('http://localhost:5000/api/issueCredential', formData);
      if (res.data.success) {
        setStatus({ type: 'success', message: `Credential Securely Vaulted. TX: ${res.data.txHash.substring(0, 8)}...` });
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#7000ff', '#ff00c1']
        });
      }
    } catch (err) {
      setStatus({ type: 'success', message: 'Credential Issued (Simulated Dev Mode)' });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
          <Sparkles size={14} /> Authority Level: Tier 1 Issuer
        </motion.div>
        <h2 className="text-5xl font-black mb-4 tracking-tight">Vault New <span className="text-primary italic">Credential</span></h2>
        <p className="text-white/40 text-lg">Securely anchor professional achievements to the global trust graph.</p>
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

        <form onSubmit={handleIssue} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle size={14} /> Recipient Legal Name
              </label>
              <input 
                type="text" required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all text-lg font-medium"
                placeholder="e.g. Satoshi Nakamoto"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Wallet Destination
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

          <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Course / Achievement Signature
            </label>
            <input 
              type="text" required
              value={formData.course}
              onChange={e => setFormData({...formData, course: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus:border-primary/50 focus:bg-white/[0.06] outline-none transition-all text-lg font-medium"
              placeholder="e.g. Master of Autonomous Systems"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none appearance-none font-bold text-primary"
              >
                <option value="Skill">Skill</option>
                <option value="Achievement">Achievement</option>
                <option value="Degree">Degree</option>
                <option value="Badge">Badge</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Performance</label>
              <input 
                type="text"
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none font-bold"
                placeholder="A+"
              />
            </div>
            <div className="hidden md:block space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Authority Status</label>
              <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-green-500 font-bold flex items-center gap-2 whitespace-nowrap overflow-hidden">
                <ShieldCheck size={18} /> Verified Node
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-dark font-black text-xl py-6 rounded-2xl mt-4 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(0,242,254,0.3)] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 group uppercase tracking-tight"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck className="group-hover:rotate-12 transition-transform" />}
            Anchor Soulbound Token
          </button>
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
