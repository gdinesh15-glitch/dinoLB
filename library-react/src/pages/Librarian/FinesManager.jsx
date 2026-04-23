import React, { useState, useEffect } from 'react';
import { DB, addAuditLog, addActivity } from '../../utils/db';
import { Search, IndianRupee, CheckCircle, HandHeart, Receipt, Wallet, Database, MoreHorizontal } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const FinesManager = () => {
  const [fines, setFines] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const reload = () => { setFines(DB.get('fines') || []); };
  useEffect(reload, []);

  const handlePay = (fineId) => {
    const f = fines.find(x => x.id === fineId); if (!f) return;
    if (!window.confirm(`Initialize payment capture of ₹${f.amount} for Identity ${f.userId}?`)) return;
    const updated = fines.map(x => x.id === fineId ? { ...x, status: 'Paid' } : x);
    DB.set('fines', updated);
    addAuditLog('LIB001', 'FINE_PAYMENT', fineId, `Payment of ₹${f.amount} received from ${f.userId}`);
    addActivity('fa-money-bill-wave', '#6ee7b7', `Fine payment: ₹${f.amount} from ${f.userId}`, 'rgba(110,231,183,.15)');
    setFines(updated); alert('✅ Financial reconciliation complete!');
  };

  const handleWaive = (fineId) => {
    const f = fines.find(x => x.id === fineId); if (!f) return;
    const reason = window.prompt(`Enter institutional reason for waiving ₹${f.amount} fine:`);
    if (!reason) { alert('Specification of reason is mandatory for auditing.'); return; }
    const updated = fines.map(x => x.id === fineId ? { ...x, status: 'Waived', waive_reason: reason } : x);
    DB.set('fines', updated);
    addAuditLog('LIB001', 'FINE_WAIVE', fineId, `Waived ₹${f.amount}. Reason: ${reason}`);
    setFines(updated); alert('✅ Regulatory exception processed!');
  };

  const filtered = fines.filter(f => {
    if (filter !== 'all' && f.status.toLowerCase() !== filter) return false;
    if (search && !f.userId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalUnpaid = fines.filter(f => f.status === 'Unpaid').reduce((a, b) => a + (b.amount || 0), 0);

  const stats = [
    { label: 'Outstanding Balance', value: `₹${totalUnpaid}`, icon: IndianRupee, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
    { label: 'Reconciled Fines', value: fines.filter(f => f.status === 'Paid').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Policy Waivers', value: fines.filter(f => f.status === 'Waived').length, icon: HandHeart, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  ];

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Financial Oversight</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Management of institutional penalties & dues</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center">
           <Wallet className="w-3 h-3 mr-2" /> Ledger Status: Balanced
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card key={i} delay={i + 1} className="relative group overflow-hidden border-b-4 border-b-transparent hover:border-b-indigo-500 transition-all">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-all group-hover:scale-110`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">{s.label}</p>
                <h3 className="text-2xl font-black tracking-tight">{s.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-2 flex-wrap p-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          {['all', 'unpaid', 'paid', 'waived'].map(f => (
            <button 
              key={f} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
              }`} 
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="w-full md:w-80">
          <Input 
            icon={Search} 
            placeholder="Search Identity ID..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <Card className="p-0 border-none overflow-visible shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subject Node</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Loan Reference</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Fine Amount</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current State</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(f => (
                <tr key={f.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-5 px-8">
                     <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                        {f.id}
                     </span>
                  </td>
                  <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)]">{f.userId}</td>
                  <td className="py-5 px-8 font-mono text-[10px] text-slate-400 uppercase tracking-widest">{f.loanId}</td>
                  <td className={`py-5 px-8 font-black text-sm ${f.status === 'Unpaid' ? 'text-rose-600' : 'text-[var(--text-primary)]'}`}>
                    ₹{f.amount}
                  </td>
                  <td className="py-5 px-8">
                    <Badge type={f.status === 'Paid' ? 'available' : f.status === 'Unpaid' ? 'overdue' : 'primary'}>
                      {f.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-5 px-8">
                    {f.status === 'Unpaid' ? (
                      <div className="flex space-x-2">
                        <Button 
                          variant="primary" 
                          className="py-1.5 h-auto text-[9px] px-3 shadow-none bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => handlePay(f.id)}
                        >
                          Settle
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="py-1.5 h-auto text-[9px] px-3 border-slate-200 dark:border-slate-800"
                          onClick={() => handleWaive(f.id)}
                        >
                          Waive
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 opacity-50">
                        <span className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]">{f.waive_reason || 'Verified Settlement'}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Receipt className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Ledger Neutral</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No penalty entries matching contemporary filters</p>
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

export default FinesManager;
