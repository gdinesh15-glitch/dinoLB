import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, Receipt, IndianRupee, Database, History, CheckCircle2, AlertCircle } from 'lucide-react';

const StudentFines = () => {
  const [fines, setFines] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Dummy data to demonstrate the UI (since fines API might not be fully built yet)
  useEffect(() => {
    setFines([
      { id: 'FIN-001', bookName: 'Advanced Mathematics', dueDate: '2023-10-15', daysLate: 5, amount: 50, status: 'Pending' },
      { id: 'FIN-002', bookName: 'Physics Vol 2', dueDate: '2023-10-10', daysLate: 10, amount: 100, status: 'Pending' }
    ]);
    
    setHistory([
      { id: 'TXN-991', date: '2023-09-15', amount: 30, method: 'UPI', status: 'Paid' },
      { id: 'TXN-992', date: '2023-08-22', amount: 50, method: 'Card', status: 'Paid' }
    ]);
  }, []);

  const handlePay = (fineId, amount) => {
    if (!window.confirm(`Initialize payment of ₹${amount}?`)) return;
    
    // Move from pending to history
    const paidFine = fines.find(f => f.id === fineId);
    if (paidFine) {
      setFines(fines.filter(f => f.id !== fineId));
      setHistory([
        { id: `TXN-${Math.floor(Math.random()*1000)}`, date: new Date().toISOString().split('T')[0], amount, method: 'UPI', status: 'Paid' },
        ...history
      ]);
      alert('✅ Payment successful!');
    }
  };

  const totalPending = fines.reduce((acc, f) => acc + f.amount, 0);
  const totalPaid = history.reduce((acc, f) => acc + f.amount, 0);
  const totalFine = totalPending + totalPaid;

  const cardStyle = { 
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '18px',
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Fines & Payments</h1>
          <p className="text-xs font-medium text-slate-500">Manage your library dues and payment history.</p>
        </div>
        <div className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${totalPending > 0 ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>
           {totalPending > 0 ? <AlertCircle className="w-3 h-3 mr-2" /> : <CheckCircle2 className="w-3 h-3 mr-2" />} 
           Status: {totalPending > 0 ? 'Dues Pending' : 'Clear'}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div style={cardStyle} className="p-6 flex items-center space-x-4 border-t-4 border-t-indigo-500">
           <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
              <Wallet className="h-6 w-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Fine</p>
              <h3 className="text-3xl font-black text-white tracking-tight">₹{totalFine}</h3>
           </div>
        </div>
        <div style={cardStyle} className="p-6 flex items-center space-x-4 border-t-4 border-t-emerald-500">
           <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
              <Receipt className="h-6 w-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Paid Amount</p>
              <h3 className="text-3xl font-black text-white tracking-tight">₹{totalPaid}</h3>
           </div>
        </div>
        <div style={cardStyle} className="p-6 flex items-center space-x-4 border-t-4 border-t-rose-500">
           <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20">
              <IndianRupee className="h-6 w-6" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Amount</p>
              <h3 className="text-3xl font-black text-rose-500 tracking-tight">₹{totalPending}</h3>
           </div>
        </div>
      </div>

      {/* Pending Fines Table */}
      {fines.length > 0 && (
        <div style={cardStyle} className="overflow-hidden">
          <div className="bg-slate-900/50 px-8 py-6 border-b border-slate-700/50 flex items-center space-x-3">
             <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                <AlertCircle className="h-5 w-5" />
             </div>
             <h3 className="font-black text-lg text-white tracking-tight uppercase">Pending Fines</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="bg-slate-950/20 border-b border-slate-700/50">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fine ID</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Book Name</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Days Late</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {fines.map(f => (
                  <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-8 font-black text-xs text-slate-300">{f.id}</td>
                    <td className="py-5 px-8 font-bold text-xs text-white">{f.bookName}</td>
                    <td className="py-5 px-8 font-medium text-xs text-slate-400">{f.dueDate}</td>
                    <td className="py-5 px-8 font-black text-xs text-rose-400">{f.daysLate} days</td>
                    <td className="py-5 px-8 font-black text-sm text-rose-500">₹{f.amount}</td>
                    <td className="py-5 px-8">
                      <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-widest border border-rose-500/20">
                        {f.status}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                       <button 
                         onClick={() => handlePay(f.id, f.amount)}
                         className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                       >
                         <CreditCard className="w-3.5 h-3.5" /> Pay Now
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History Table */}
      <div style={cardStyle} className="overflow-hidden">
        <div className="bg-slate-900/50 px-8 py-6 border-b border-slate-700/50 flex items-center space-x-3">
           <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <History className="h-5 w-5" />
           </div>
           <h3 className="font-black text-lg text-white tracking-tight uppercase">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="bg-slate-950/20 border-b border-slate-700/50">
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {history.map(f => (
                <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 px-8 font-black text-xs text-slate-300">{f.id}</td>
                  <td className="py-5 px-8 font-medium text-xs text-slate-400">{f.date}</td>
                  <td className="py-5 px-8 font-black text-sm text-white">₹{f.amount}</td>
                  <td className="py-5 px-8 font-bold text-xs text-slate-400">{f.method}</td>
                  <td className="py-5 px-8">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Database className="h-10 w-10 text-slate-500 mb-4" />
                      <p className="text-xs font-black text-white uppercase tracking-widest">No payment history available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default StudentFines;
