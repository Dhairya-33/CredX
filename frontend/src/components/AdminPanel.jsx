import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, PlusCircle, CheckCircle, AlertCircle, Loader2, Sparkles, ShieldCheck, Activity } from 'lucide-react'
import axios from 'axios'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'
import { QRCodeSVG } from 'qrcode.react'

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    wallet: '0xdemo',
    course: '',
    issuer: 'TrustChainX Authority',
    grade: 'A+',
    category: 'Degree',
    date: new Date().toISOString().split('T')[0]
  });
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus({ type: 'error', message: 'Speech recognition not supported.' });
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
          setFormData(prev => ({ ...prev, name: parts[0].trim(), course: parts[1].trim() }));
        }
      }
    };
    recognition.start();
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const element = document.getElementById('certificate-template');
      const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
      const imageData = canvas.toDataURL('image/png', 0.8);

      const res = await axios.post('http://localhost:5000/api/issue-certificate', {
        ...formData,
        imageData
      });

      if (res.data.success) {
        setStatus({ type: 'success', message: 'Visual Certificate Issued Successfully!' });
        confetti();
      }
    } catch (err) {
      console.error("Issuance Error:", err);
      setStatus({ type: 'error', message: err.response?.data?.error || 'Network Error: Check Payload Size/CORS' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-16 px-4 pb-32">
      {/* Hidden Certificate Template for Capture */}
      <div className="fixed left-[-9999px] top-0">
        <div 
            id="certificate-template"
            className="w-[800px] h-[600px] bg-[#050510] text-white p-20 border-[20px] border-primary/20 relative flex flex-col items-center justify-between text-center font-['Outfit']"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,254,0.1),transparent_70%)]" />
            
            <div className="space-y-4 relative z-10">
                <ShieldCheck className="w-16 h-16 text-primary mx-auto" />
                <h1 className="text-xl font-black uppercase tracking-[0.5em] text-white/40">Official TrustChainX SBT</h1>
            </div>

            <div className="space-y-6 relative z-10">
                <p className="text-lg font-medium text-white/60">This is to certify that</p>
                <h2 className="text-6xl font-black italic tracking-tighter text-white">{formData.name || 'Recipient Name'}</h2>
                <p className="text-lg font-medium text-white/60 px-20 leading-relaxed">
                    has successfully completed the course requirements and exhibited exceptional mastery in
                </p>
                <h3 className="text-4xl font-black text-primary italic uppercase tracking-tight">{formData.course || 'Course Name'}</h3>
            </div>

            <div className="grid grid-cols-3 w-full pt-10 border-t border-white/10 relative z-10">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Grade Obtained</span>
                    <span className="text-3xl font-black text-secondary">{formData.grade || 'A+'}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Issue Date</span>
                    <span className="text-xl font-bold">{formData.date}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Identity Hash</span>
                    <span className="text-[10px] font-mono text-white/20 truncate w-32">{formData.wallet}</span>
                </div>
            </div>

            <div className="absolute bottom-10 right-10 flex items-center gap-6">
                <div className="flex flex-col items-end opacity-40">
                  <p className="text-[8px] font-black uppercase tracking-widest leading-none">Scannable Verification</p>
                  <div className="w-12 h-[2px] bg-primary mt-1 mb-2" />
                  <p className="text-[6px] font-mono text-white/20">Protocol: T-ChainX.v2</p>
                </div>
                <div className="p-2 bg-white rounded-lg">
                  <QRCodeSVG 
                    value={`${window.location.origin}/?verify=${formData.wallet}`} 
                    size={60} 
                    level="H"
                    fgColor="#050510"
                  />
                </div>
            </div>
        </div>
      </div>

      <div className="mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles size={14} /> Authority Level: Network Admin
        </motion.div>
        <h2 className="text-5xl font-black mb-4 tracking-tight">Issue <span className="text-primary italic">Visual Credential</span></h2>
        <p className="text-white/40 text-lg">Generate and anchor high-resolution certificates to the blockchain.</p>
      </div>

      <div className="glass-card p-10 md:p-12 rounded-[2.5rem] border-white/10 relative">
        <button 
          onClick={handleVoiceInput}
          className={`absolute top-10 right-10 p-5 rounded-2xl transition-all duration-500 hover:scale-110 z-20 ${
            isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110' : 'bg-white/5 hover:bg-white/10 text-primary'
          }`}
        >
          <Mic size={28} />
        </button>

        <form onSubmit={handleIssue} className="flex flex-col xl:flex-row gap-16">
            <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Recipient Name</label>
                        <input 
                            type="text" required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="input-elite"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Recipient Wallet</label>
                        <input 
                            type="text" required
                            value={formData.wallet}
                            onChange={e => setFormData({...formData, wallet: e.target.value})}
                            className="input-elite font-mono"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Course Subject</label>
                        <input 
                            type="text" required
                            value={formData.course}
                            onChange={e => setFormData({...formData, course: e.target.value})}
                            className="input-elite"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Grade</label>
                            <input 
                                type="text" required
                                value={formData.grade}
                                onChange={e => setFormData({...formData, grade: e.target.value})}
                                className="input-elite text-secondary text-center"
                                placeholder="A+"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Date</label>
                            <input 
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                className="input-elite text-sm font-mono"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-dark font-black text-xl py-6 rounded-2xl hover:shadow-[0_0_50px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-4 group uppercase italic mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck className="group-hover:rotate-12 transition-transform" />}
                    {loading ? 'Generating Certificate...' : 'Issue & Upload Visual SBT'}
                </button>
            </div>

            {/* Live Card Preview */}
            <div className="w-full xl:w-[450px] space-y-6">
                <div className="text-xs font-bold text-white/20 uppercase tracking-[0.4em] text-center">Identity Snapshot</div>
                <motion.div 
                    className="relative p-1 glass-card rounded-[3.5rem] bg-gradient-to-tr from-primary/20 via-white/5 to-accent/20"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                >
                    <div className="bg-[#050510] rounded-[3.4rem] p-10 space-y-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldCheck size={40} className="text-primary" /></div>
                        
                        <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 mx-auto flex items-center justify-center">
                            <PlusCircle size={40} className="text-primary" />
                        </div>

                        <div className="space-y-2">
                             <h4 className="text-3xl font-black italic tracking-tighter">{formData.name || 'Recipient Name'}</h4>
                             <p className="text-[10px] font-mono text-white/20 truncate px-10">{formData.wallet}</p>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase text-primary tracking-widest">Course</p>
                                    <p className="text-lg font-black italic truncate">{formData.course || 'Subject'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-secondary tracking-widest">Grade</p>
                                    <p className="text-2xl font-black italic">{formData.grade}</p>
                                </div>
                            </div>
                            
                            {/* Live Verification QR Preview */}
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-3xl border border-white/10 group/qr cursor-pointer hover:bg-white/10 transition-all"
                                 onClick={() => window.open(`/?verify=${formData.wallet}`, '_blank')}>
                                <div className="p-2 bg-white rounded-xl">
                                    <QRCodeSVG 
                                        value={`${window.location.origin}/?verify=${formData.wallet}`} 
                                        size={80} 
                                        fgColor="#050510" 
                                    />
                                </div>
                                <p className="text-[8px] font-black uppercase text-primary tracking-[0.2em] group-hover/qr:animate-pulse">Click to Test Verify</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <Activity className="text-primary shrink-0" />
                    <p className="text-xs font-medium text-white/40 leading-relaxed">
                        By clicking "Issue", you are generating a unique cryptographic visual certificate and uploading its raw pixels to the IPFS network for permanent anchoring.
                    </p>
                </div>
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
