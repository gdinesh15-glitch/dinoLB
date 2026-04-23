import React, { useState, useEffect } from 'react';
import { 
  Plus, FilePlus, List, CheckCircle, Clock, 
  AlertTriangle, Send, Loader2, BookOpen, Trash2
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/SharedUI';
import api from '../../api/axios';

const PurchaseRequests = () => {
  const [tab, setTab] = useState('list');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', publisher: '', isbn: '', subject: '', reason: '', priority: 'Medium'
  });

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculty/recommendations');
      setRecommendations(res.data);
    } catch (err) { console.error('Failed to fetch'); }
    setLoading(false);
  };

  useEffect(() => { fetchRecommendations(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/faculty/recommend', formData);
      alert('✅ Recommendation submitted successfully!');
      setFormData({ title: '', author: '', publisher: '', isbn: '', subject: '', reason: '', priority: 'Medium' });
      setTab('list');
      fetchRecommendations();
    } catch (err) { alert('Submission failed'); }
    setSubmitting(false);
  };

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Academic Purchase Requests</h1>
          <p className="text-xs font-medium text-slate-500">Recommend new intellectual assets for the university library collection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <Card style={cardStyle} className="p-8 rounded-[3rem] border-t-4 border-t-indigo-500">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center space-y-2 mb-8">
                   <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mx-auto border border-indigo-500/20">
                      <FilePlus className="w-6 h-6" />
                   </div>
                   <h2 className="text-lg font-black text-white uppercase tracking-tight">Recommend Book</h2>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Book Title</label>
                      <input required className="w-full h-12 bg-slate-950/40 border border-slate-800 rounded-2xl px-5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Author</label>
                      <input required className="w-full h-12 bg-slate-950/40 border border-slate-800 rounded-2xl px-5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject</label>
                        <input className="w-full h-12 bg-slate-950/40 border border-slate-800 rounded-2xl px-5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Publisher</label>
                        <input className="w-full h-12 bg-slate-950/40 border border-slate-800 rounded-2xl px-5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} />
                     </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Reason for Recommendation</label>
                      <textarea required className="w-full h-24 bg-slate-950/40 border border-slate-800 rounded-2xl p-5 text-sm text-white focus:border-indigo-500/50 outline-none transition-all resize-none" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                   </div>
                </div>
                
                <div className="pt-2">
                   <button disabled={submitting} type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Request
                   </button>
                </div>
             </form>
          </Card>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-4">
             {recommendations.map(r => (
               <Card key={r._id} style={cardStyle} className="p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 group hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                     <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                        <BookOpen className="w-5 h-5" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{r.title}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{r.author} {r.publisher ? `• ${r.publisher}` : ''}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <div className="text-center min-w-[80px]">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">State</p>
                        <Badge type={r.status === 'Approved' ? 'available' : r.status === 'Rejected' ? 'overdue' : 'primary'}>{r.status.toUpperCase()}</Badge>
                     </div>
                  </div>
               </Card>
             ))}
             {recommendations.length === 0 && !loading && (
               <div className="py-20 text-center space-y-4 opacity-30 border-2 border-dashed border-slate-800 rounded-[3rem]">
                  <List className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">No requests submitted yet</p>
               </div>
             )}
             {loading && (
               <div className="py-20 flex justify-center opacity-50">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequests;
