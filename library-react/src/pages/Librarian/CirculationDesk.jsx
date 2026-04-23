import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Undo2, RefreshCw, CheckCircle, 
  AlertTriangle, ArrowUpRight, List, Search, 
  User, Calendar, Database, Clock, 
  MoreVertical, ChevronRight, Activity, ShieldCheck,
  FileText, Hash
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/SharedUI';
import api from '../../api/axios';

const CirculationDesk = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [overdue, setOverdue] = useState([]);
  
  const [memberPreview, setMemberPreview] = useState(null);
  const [bookPreview, setBookPreview] = useState(null);

  const [issueData, setIssueData] = useState({ userId: '', bookId: '', dueDate: new Date(Date.now() + 14*86400000).toISOString().split('T')[0] });
  const [returnQuery, setReturnQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, transRes] = await Promise.all([
        api.get('/librarian/stats'),
        api.get('/librarian/reports?type=all')
      ]);
      setStats(statsRes.data.stats);
      setTransactions(transRes.data);
      setOverdue(transRes.data.filter(t => t.status === 'Overdue'));
    } catch (err) {
      console.error('Data sync failed');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const lookup = async () => {
      if (issueData.userId.length >= 3) {
        try {
          const res = await api.get(`/librarian/search?type=user&q=${issueData.userId}`);
          if (res.data.length > 0) setMemberPreview(res.data[0]);
          else setMemberPreview(null);
        } catch { setMemberPreview(null); }
      } else setMemberPreview(null);
    };
    lookup();
  }, [issueData.userId]);

  useEffect(() => {
    const lookup = async () => {
      if (issueData.bookId.length >= 3) {
        try {
          const res = await api.get(`/librarian/search?type=book&q=${issueData.bookId}`);
          if (res.data.length > 0) setBookPreview(res.data[0]);
          else setBookPreview(null);
        } catch { setBookPreview(null); }
      } else setBookPreview(null);
    };
    lookup();
  }, [issueData.bookId]);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/librarian/issue', issueData);
      if (res.data.success) {
        alert('✅ Book issued successfully!');
        setIssueData({ ...issueData, userId: '', bookId: '' });
        fetchData();
      }
    } catch (err) { alert(err.response?.data?.message || 'Issue failed'); }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    if (!returnQuery) return;
    try {
      const res = await api.post('/librarian/return', { userId: returnQuery.split(':')[0], bookId: returnQuery.split(':')[1] || returnQuery });
      if (res.data.success) {
        alert(`✅ Return processed! ${res.data.fine > 0 ? `Fine: ₹${res.data.fine}` : ''}`);
        setReturnQuery('');
        fetchData();
      }
    } catch (err) { alert(err.response?.data?.message || 'Return failed'); }
  };

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(24px)' 
  };

  const inputStyle = "w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl h-14 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-600";

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Circulation Desk</h1>
          <p className="text-sm font-medium text-slate-500">Manage book issuance, returns, and track active loans.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-12 px-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center gap-3 text-xs font-bold text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500" /> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
          </div>
          <div className="h-12 px-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3 text-xs font-bold text-indigo-400">
            <User className="w-4 h-4" /> Librarian Console
          </div>
        </div>
      </div>

      {/* ── Stats Overview ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Books', value: stats?.totalBooks || 0, sub: 'Unique Titles', icon: BookOpen, color: 'indigo' },
          { label: 'In Stock', value: stats?.availableBooks || 0, sub: 'Ready to Issue', icon: CheckCircle, color: 'emerald' },
          { label: 'Active Loans', value: stats?.issuedBooks || 0, sub: 'Currently Borrowed', icon: ArrowUpRight, color: 'blue' },
          { label: 'Overdue', value: stats?.overdueBooks || 0, sub: 'Needs Attention', icon: AlertTriangle, color: 'rose' },
        ].map((s, i) => (
          <div key={i} style={cardStyle} className="p-6 rounded-3xl flex items-center gap-5 group transition-all hover:border-slate-600">
             <div className={`w-14 h-14 rounded-2xl bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center text-${s.color}-400 group-hover:scale-105 transition-transform`}>
                <s.icon className="w-7 h-7" />
             </div>
             <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">{s.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{s.value}</h3>
                <p className={`text-[10px] font-bold text-${s.color}-500/80 uppercase tracking-widest mt-1`}>{s.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* ── Operations Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Issue Book Section */}
        <div style={cardStyle} className="rounded-[2.5rem] p-8 flex flex-col space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
               <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Issue New Book</h2>
              <p className="text-xs font-medium text-slate-500">Assign an asset to a verified library member.</p>
            </div>
          </div>
          
          <form onSubmit={handleIssue} className="space-y-6 flex-1">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Select Member</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    className={inputStyle}
                    placeholder="Enter Member ID (e.g. STU-001)"
                    value={issueData.userId}
                    onChange={e => setIssueData({...issueData, userId: e.target.value})}
                    required
                  />
                </div>
                {memberPreview && (
                  <div className="mt-2 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 animate-in slide-in-from-top-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/20">
                      {memberPreview.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{memberPreview.name}</p>
                      <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-widest">{memberPreview.role} • {memberPreview.department}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Select Book</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    className={inputStyle}
                    placeholder="Enter Book ID (e.g. BK0001)"
                    value={issueData.bookId}
                    onChange={e => setIssueData({...issueData, bookId: e.target.value})}
                    required
                  />
                </div>
                {bookPreview && (
                  <div className="mt-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4 animate-in slide-in-from-top-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white truncate">{bookPreview.title}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${bookPreview.availableCopies > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {bookPreview.availableCopies > 0 ? `Available: ${bookPreview.availableCopies} Units` : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Return Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    type="date"
                    className={inputStyle}
                    value={issueData.dueDate}
                    onChange={e => setIssueData({...issueData, dueDate: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 rounded-2xl bg-indigo-600 text-white text-sm font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] mt-4">
               Complete Issuance
            </button>
          </form>
        </div>

        {/* Return Book Section */}
        <div style={cardStyle} className="rounded-[2.5rem] p-8 flex flex-col space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
               <Undo2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Return Asset</h2>
              <p className="text-xs font-medium text-slate-500">Reclaim books and process overdue penalties.</p>
            </div>
          </div>
          
          <form onSubmit={handleReturn} className="space-y-8 flex-1 flex flex-col">
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-700/30 border-dashed space-y-6 text-center">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Lookup</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input 
                    className={inputStyle}
                    placeholder="Search by Member ID or Book ID..."
                    value={returnQuery}
                    onChange={e => setReturnQuery(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Scan asset barcode or enter IDs manually to retrieve active loan data from the registry.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center gap-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Late Penalty</p>
                  <p className="text-lg font-black text-white">₹5.00 / day</p>
               </div>
               <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center justify-center gap-1">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Verification</p>
                  <p className="text-lg font-black text-indigo-400">Required</p>
               </div>
            </div>

            <div className="mt-auto pt-4">
              <button type="submit" className="w-full py-5 rounded-2xl bg-emerald-600 text-white text-sm font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98]">
                 Process Return Recovery
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Lower Section ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Ledger */}
        <div className="lg:col-span-8 overflow-hidden rounded-3xl" style={cardStyle}>
          <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-black text-white uppercase tracking-wider text-sm">Recent Ledger</h3>
             </div>
             <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white transition-all">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/20 border-b border-slate-800">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Book Title & Member</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timeline</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">State</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {transactions.slice(0, 6).map((t) => (
                  <tr key={t._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex flex-col gap-1 max-w-[300px]">
                        <span className="font-black text-sm text-white group-hover:text-indigo-400 transition-colors truncate">{t.book?.title}</span>
                        <span className="text-[11px] font-bold text-slate-500">{t.user?.name} <span className="mx-1 opacity-30">•</span> {t.user?.userId}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                       <div className="flex flex-col gap-1 text-[11px] font-bold">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 uppercase tracking-tighter">Due</span>
                            <span className="text-white">{new Date(t.dueDate).toLocaleDateString()}</span>
                          </div>
                          {t.returnDate && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 uppercase tracking-tighter">Ret</span>
                              <span className="text-emerald-500">{new Date(t.returnDate).toLocaleDateString()}</span>
                            </div>
                          )}
                       </div>
                    </td>
                    <td className="py-5 px-8">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         t.status === 'Returned' ? 'bg-emerald-500/10 text-emerald-400' : 
                         t.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                       }`}>
                         {t.status}
                       </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <button className="p-2.5 rounded-xl bg-slate-800/30 text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2rem] flex flex-col h-full" style={cardStyle}>
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-white uppercase tracking-wider text-sm">Overdue Queue</h3>
               </div>
               <Badge type="overdue" className="text-[10px] px-3 py-1">{overdue.length}</Badge>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
               {overdue.map((t, i) => (
                 <div key={i} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 group hover:border-rose-500/30 transition-all">
                    <div className="flex justify-between items-start gap-4">
                       <div className="min-w-0 space-y-1">
                          <p className="text-xs font-black text-white truncate uppercase tracking-tight">{t.user?.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 truncate italic">"{t.book?.title}"</p>
                       </div>
                       <div className="text-right whitespace-nowrap">
                          <p className="text-xs font-black text-rose-500">₹{t.fineAmount || 0}</p>
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Penalty</p>
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                       <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                          <Hash className="w-3 h-3" /> {t.user?.userId}
                       </div>
                       <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                          Action <ChevronRight className="w-3.5 h-3.5" />
                       </button>
                    </div>
                 </div>
               ))}
               {overdue.length === 0 && (
                 <div className="py-20 text-center space-y-4 opacity-30">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                    <p className="text-xs font-black text-white uppercase tracking-widest">No Overdue Loans</p>
                 </div>
               )}
            </div>

            <button className="w-full mt-8 py-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all">
               Generate Overdue Report
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CirculationDesk;
