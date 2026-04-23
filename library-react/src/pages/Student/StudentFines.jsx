import React, { useState, useEffect } from 'react';
import { DB, addAuditLog, addActivity } from '../../utils/db';
import { Wallet, CreditCard, Receipt, IndianRupee, Database, History, CheckCircle2 } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const StudentFines = () => {
  const [fines, setFines] = useState([]);
  const userId = 'STU001';

  useEffect(() => {
    const all = DB.get('fines') || [];
    setFines(all.filter(f => f.userId === userId));
  }, []);

  const handlePay = (fineId, amount) => {
    if (!window.confirm(`Initialize secure payment capture of ₹${amount}?`)) return;
    alert('Establishing secure tunnel to payment gateway...');
    setTimeout(() => {
      const all = DB.get('fines') || [];
      const updated = all.map(f => f.id === fineId ? { ...f, status: 'Paid' } : f);
      DB.set('fines', updated);
      addAuditLog(userId, 'FINE_PAYMENT_STUDENT', fineId, `Paid ₹${amount}`);
      addActivity('fa-money-bill-wave', '#6ee7b7', `Paid fine: ₹${amount}`, 'rgba(110,231,183,.15)');
      setFines(updated.filter(f => f.userId === userId));
      alert('✅ Transaction Secured: Payment successful!');
    }, 1000);
  };

  const outstanding = fines.filter(f => f.status === 'Unpaid');
  const history = fines.filter(f => f.status !== 'Unpaid');
  const totalOutstanding = outstanding.reduce((acc, f) => acc + (f.amount || 0), 0);

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Financial Ledger</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Personal debt registry & reconciliation portal</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
           <CheckCircle2 className="w-3 h-3 mr-2" /> Clearance Status: {totalOutstanding > 0 ? 'RESTRICTED' : 'NOMINAL'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-900 dark:to-rose-950 text-white border-none shadow-2xl shadow-rose-500/20">
           <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                 <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-100 mb-1">Total Outstanding</p>
                 <h3 className="text-3xl font-black tracking-tight">₹{totalOutstanding}</h3>
              </div>
           </div>
        </Card>
      </div>

      {outstanding.length > 0 && (
        <Card className="p-0 border-none overflow-hidden shadow-xl border-t-4 border-t-rose-500">
          <div className="bg-[var(--bg-secondary)] px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
             <div className="flex items-center space-x-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg">
                   <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-black text-lg tracking-tight uppercase text-[var(--text-primary)]">Critical Debt Stream</h3>
             </div>
             <Badge type="overdue">IMMEDIATE ACTION REQUIRED</Badge>
          </div>
          <div className="overflow-x-auto rounded-b-2xl border border-[var(--border-color)] border-t-0">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Penalty ID</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resource TX ID</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quantum (Amount)</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">State</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
                {outstanding.map(f => (
                  <tr key={f.id} className="group hover:bg-rose-50/30 dark:hover:bg-rose-950/10 transition-colors">
                    <td className="py-5 px-8">
                       <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-900/30">
                          {f.id}
                       </span>
                    </td>
                    <td className="py-5 px-8 font-mono text-[10px] text-slate-400">{f.loanId}</td>
                    <td className="py-5 px-8 font-black text-sm text-rose-600">₹{f.amount}</td>
                    <td className="py-5 px-8">
                      <Badge type="overdue">UNPAID</Badge>
                    </td>
                    <td className="py-5 px-8">
                       <Button 
                         variant="primary" 
                         className="py-1.5 h-auto text-[9px] px-4 shadow-lg bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
                         onClick={() => handlePay(f.id, f.amount)}
                       >
                         <CreditCard className="w-3.5 h-3.5 mr-2" /> Remote Payment
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="bg-[var(--bg-secondary)] px-8 py-6 border-b border-[var(--border-color)] flex items-center space-x-3">
           <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
              <History className="h-5 w-5" />
           </div>
           <h3 className="font-black text-lg tracking-tight uppercase text-[var(--text-primary)]">Settlement History</h3>
        </div>
        <div className="overflow-x-auto rounded-b-2xl border border-[var(--border-color)] border-t-0">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Penalty ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quantum</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Finality State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {history.map(f => (
                <tr key={f.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-5 px-8">
                     <span className="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        {f.id}
                     </span>
                  </td>
                  <td className="py-5 px-8 font-bold text-xs text-[var(--text-secondary)]">₹{f.amount}</td>
                  <td className="py-5 px-8">
                    <Badge type={f.status === 'Paid' ? 'available' : 'primary'}>
                      {f.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-2">
                        <Database className="h-6 w-6" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Historical Journal Empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentFines;
