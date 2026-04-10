import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Clock, ChevronRight, Share2, Download, Filter, MapPin, ShieldCheck, Activity, Sparkles, Zap, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { QRCodeSVG } from 'qrcode.react'

const UserDashboard = () => {
  const [data, setData] = useState(null)
  const [viewingAddress, setViewingAddress] = useState('0xdemo')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  
  const fetchData = async (addr) => {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:5000/api/certificates/${addr}`)
        setData(res.data)
      } catch (e) {
        setData({
          wallet: addr,
          analysis: { score: 95, verdict: 'HIGHLY_TRUSTED' },
          certificates: [
            { id: 1, courseName: 'Solidity Master Engineer', issuer: 'VeriCertX Academy', issueDate: '2025-02-12', category: 'Degree', ipfsCID: 'QmSample1' },
            { id: 2, courseName: 'AI Security Research', issuer: 'OpenAI Labs', issueDate: '2024-11-20', category: 'Achievement', ipfsCID: 'QmSample2' },
          ]
        })
      }
      setLoading(false)
  }

  useEffect(() => {
    fetchData(viewingAddress)
  }, [viewingAddress])

  if (!data) return (
    <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <span className="text-primary font-black italic tracking-widest animate-pulse uppercase">Syncing VeriCert Nodes...</span>
        </div>
    </div>
  )

  const handleDownload = async (cid, course) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TrustChainX_${course.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="pt-20 space-y-16 pb-24">
      {/* Elite User Header */}
      <div className="flex flex-col md:flex-row items-center gap-12 glass-card p-12 md:p-16 rounded-[4rem] border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 blur-[150px] -z-10 group-hover:bg-primary/10 transition-all duration-700" />
        
        <div className="relative">
          <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-white/5 p-2 group-hover:border-primary/20 transition-all duration-500 transform group-hover:rotate-6">
            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${data.wallet || data.address}`} alt="Avatar" className="w-full h-full object-cover rounded-[2.5rem] bg-gradient-to-br from-primary to-accent" />
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
              <h1 className="text-6xl font-black italic tracking-tighter">Cert <span className="text-primary">Vault</span></h1>
              <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-2 px-4 rounded-2xl border border-white/10 w-fit">
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Identity..."
                    className="bg-transparent border-none outline-none text-white/60 font-mono text-sm tracking-widest uppercase w-64"
                />
                <button 
                   onClick={() => searchQuery && setViewingAddress(searchQuery)}
                   className="p-2 px-4 bg-primary text-dark rounded-xl font-black text-xs uppercase hover:bg-white transition-colors"
                >Audit</button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-3 text-primary text-sm font-black bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl uppercase tracking-[0.2em]">
              <Sparkles size={18}/> Trust Coefficient: {data.analysis.score}
            </div>
            <div className="flex items-center gap-3 text-white/60 text-sm font-bold bg-white/5 px-6 py-3 rounded-2xl uppercase tracking-widest backdrop-blur-md">
              <ShieldCheck size={18} className="text-primary"/> Verified TrustNode
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button className="px-8 py-5 rounded-[2rem] bg-white text-dark font-black hover:bg-primary hover:text-dark transition-all flex items-center gap-3 uppercase text-sm tracking-widest shadow-xl shadow-white/5"><Share2 size={20}/> Share Protocol</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black italic flex items-center gap-4 tracking-tighter">
              <Award className="text-primary w-12 h-12" /> Trust <span className="text-primary">Inventory</span>
            </h2>
            <div className="h-[2px] flex-1 mx-8 bg-gradient-to-r from-primary/30 via-accent/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.certificates.length > 0 ? (
              data.certificates.map((cred, i) => (
                <motion.div 
                  key={cred.id || i}
                  whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="group relative rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-white/[0.05] to-[#050510] border border-white/5 hover:border-primary/40 p-10 h-[500px] flex flex-col justify-between transition-all duration-500 shadow-2xl hover:shadow-primary/5 cursor-pointer perspective-1000"
                >
                  <div className="absolute inset-0 z-0 cursor-pointer group/img" onClick={() => window.open(`https://ipfs.io/ipfs/${cred.ipfsCID}`, '_blank')}>
                      <img 
                          src={`https://ipfs.io/ipfs/${cred.ipfsCID}`} 
                          alt="Certificate"
                          className="w-full h-full object-cover opacity-10 group-hover:opacity-100 transition-all duration-700 blur-[2px] group-hover:blur-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                         <div className="bg-primary/20 backdrop-blur-md border border-primary/40 px-6 py-3 rounded-full text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <ExternalLink size={14} /> View Original
                         </div>
                      </div>
                  </div>

                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-12 z-20">
                      <a href={`/?verify=${viewingAddress}`} className="cursor-pointer block hover:scale-110 transition-transform">
                        <QRCodeSVG 
                            value={`${window.location.origin}/?verify=${viewingAddress}`} 
                            size={100} 
                            bgColor="transparent" 
                            fgColor="#00f2fe" 
                        />
                      </a>
                  </div>
  
                  <div className="space-y-8 relative z-10">
                      <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-primary">Visual Identity SBT</span>
                      </div>
                      <h3 className="text-5xl font-black leading-none group-hover:text-primary transition-colors tracking-tighter italic">{cred.courseName}</h3>
                  </div>
  
                  <div className="space-y-6 relative z-10 pt-10 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-green-400 font-black text-[10px] uppercase tracking-widest bg-green-400/10 px-4 py-2 rounded-full">
                            <ShieldCheck size={14} /> Immutable On-Chain
                        </div>
                                                 <button 
                             onClick={() => handleDownload(cred.ipfsCID, cred.courseName)}
                             className="p-3 rounded-2xl bg-white/5 hover:bg-primary hover:text-dark transition-all"
                         >
                             <Download size={18}/>
                         </button>
                      </div>
                      <div className="space-y-2">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Authority: {cred.issuer}</p>
                          <p className="text-[10px] text-white/40 font-mono italic">Block Timestamp: {new Date(cred.issueDate).toLocaleDateString()}</p>
                      </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 glass-card p-24 rounded-[4rem] border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-30">
                 <Award className="w-20 h-20 text-white/20 mb-8 animate-bounce" />
                 <h3 className="text-3xl font-black italic mb-3 tracking-tighter">Zero Trust Units Found</h3>
                 <p className="text-white/40 max-w-sm text-lg font-medium leading-relaxed">Issue a certificate via the Authority Port to generate an on-chain identity index for this wallet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-3xl font-black italic flex items-center gap-4">
            <Clock className="text-accent w-10 h-10" /> Activity <span className="text-accent">Log</span>
          </h2>
          
          <div className="glass-card p-10 rounded-[3.5rem] border-white/10 space-y-12 relative overflow-hidden">
            <div className="absolute left-[3.4rem] top-24 bottom-24 w-[2px] bg-gradient-to-b from-primary via-accent to-transparent opacity-20" />
            
            {data.certificates.map((cred, i) => (
              <div key={i} className="flex gap-8 relative group">
                <div className="w-12 h-12 rounded-2xl bg-dark border-2 border-white/10 flex items-center justify-center z-10 group-hover:border-primary transition-all duration-500">
                    <Zap className="text-white/20 group-hover:text-primary transition-colors" size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Minted in {new Date(cred.issueDate).getFullYear()}</span>
                  <h4 className="font-black text-xl italic group-hover:text-primary transition-all tracking-tight leading-tight">{cred.courseName}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Loader2 = ({className, size}) => <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>

export default UserDashboard
