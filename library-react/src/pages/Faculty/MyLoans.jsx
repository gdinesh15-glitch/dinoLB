import React, { useState, useEffect } from 'react';
import { Clock, BookOpen, Calendar, AlertCircle, RefreshCw, Loader2, IndianRupee } from 'lucide-react';
import { Card, Badge } from '../../components/SharedUI';
import api from '../../api/axios';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculty/loans');
      setLoans(res.data || []);
    } catch (err) {
      console.error('Failed to fetch loans');
    }
    setLoading(false);
  };

  useEffect(() => { fetchLoans(); }, []);

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">My Academic Loans</h1>
          <p className="text-xs font-medium text-slate-500">Track your currently borrowed assets and upcoming deadlines.</p>
        </div>
        <button onClick={fetchLoans} className="p-3 rounded-2xl bg-slate-800/50 text-slate-400 hover:text-white transition-all">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
           <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
           <p className="text-[10px] font-black text-white uppercase tracking-widest">Querying Academic Ledger...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loans.map(loan => {
            const isOverdue = new Date(loan.dueDate) < new Date();
            return (
              <div key={loan._id} style={cardStyle} className="rounded-[2.5rem] p-8 flex flex-col group transition-all hover:border-slate-700">
                 <div className="flex justify-between items-start mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-${isOverdue ? 'rose' : 'indigo'}-500/10 border border-${isOverdue ? 'rose' : 'indigo'}-500/20 flex items-center justify-center text-${isOverdue ? 'rose' : 'indigo'}-400`}>
                       <BookOpen className="w-7 h-7" />
                    </div>
                    <Badge type={isOverdue ? 'overdue' : 'primary'}>
                      {isOverdue ? 'OVERDUE' : 'ACTIVE LOAN'}
                    </Badge>
                 </div>

                 <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight">{loan.book?.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{loan.book?.author}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800/50">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Issued
                       </p>
                       <p className="text-xs font-bold text-slate-300">{new Date(loan.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due Date
                       </p>
                       <p className={`text-xs font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-300'}`}>{new Date(loan.dueDate).toLocaleDateString()}</p>
                    </div>
                 </div>

                 {isOverdue && (
                   <div className="mt-6 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <AlertCircle className="w-4 h-4 text-rose-500" />
                         <span className="text-[10px] font-black text-rose-500 uppercase">Penalty Accruing</span>
                      </div>
                      <span className="text-xs font-black text-rose-500">₹{loan.fineAmount || 0}</span>
                   </div>
                 )}
              </div>
            );
          })}
          {loans.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4 opacity-30 border-2 border-dashed border-slate-800 rounded-[3rem]">
               <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
               <p className="text-xs font-black text-white uppercase tracking-widest">No active academic loans detected</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLoans;
