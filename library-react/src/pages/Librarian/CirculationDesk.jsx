import React, { useState, useEffect } from 'react';
import { DB, today, addDays, daysDiff, fmtDate, genId, addActivity, addAuditLog } from '../../utils/db';
import { BookOpen, Undo2, RefreshCw, CheckCircle, AlertTriangle, ArrowUpRight, List, Search, User, ClipboardList, Database } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const CirculationDesk = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [issued, setIssued] = useState([]);
  const [tab, setTab] = useState('issue');

  const reload = () => { setBooks(DB.get('books') || []); setUsers(DB.get('users') || []); setIssued(DB.get('issued') || []); };
  useEffect(reload, []);

  const activeLoans = issued.filter(i => i.status !== 'returned');
  const overdueLoans = activeLoans.filter(i => i.dueDate < today());

  const handleIssue = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const userId = fd.get('userId'), bookId = fd.get('bookId'), dueDate = fd.get('dueDate');
    const stu = users.find(u => u.id === userId);
    const bk = books.find(b => b.id === bookId);
    
    if (!stu) { alert('Identity mismatch: User ID not found in registry!'); return; }
    if (!bk) { alert('Resource mismatch: Book ID not found in catalog!'); return; }
    if ((bk.available || 0) < 1) { alert('Resource deprioritized: No physical copies available!'); return; }
    
    const configs = DB.get('system_config') || [];
    const maxBorrow = parseInt((configs.find(c => c.config_key === (stu.role === 'faculty' ? 'FACULTY_MAX_BORROW' : 'STUDENT_MAX_BORROW'))?.config_value) || '3');
    const userLoans = activeLoans.filter(i => i.userId === userId).length;
    
    if (userLoans >= maxBorrow) { alert(`Threshold reached: User has reached max borrow limit (${maxBorrow})`); return; }
    
    const tx = { txId: genId('TX'), userId, userName: stu.name, bookId, bookTitle: bk.title, issueDate: today(), dueDate, returnDate: null, status: 'issued', fine: 0, issuedBy: 'LIB001', ts: Date.now() };
    const updatedIssued = [...issued, tx];
    const updatedBooks = books.map(b => b.id === bookId ? { ...b, available: b.available - 1, borrow: (b.borrow || 0) + 1 } : b);
    
    DB.set('issued', updatedIssued); DB.set('books', updatedBooks);
    addActivity('fa-arrow-up', '#fdba74', `"${bk.title}" issued to ${stu.name}`, 'rgba(253,186,116,.15)');
    addAuditLog('LIB001', 'BOOK_ISSUE', tx.txId, `Issued ${bookId} to ${userId}`);
    
    reload(); alert(`✅ Transaction Initialized! TX: ${tx.txId}`); e.target.reset();
  };

  const handleReturn = (txId) => {
    const rec = issued.find(i => i.txId === txId); if (!rec) return;
    const days = daysDiff(rec.dueDate, today());
    const configs = DB.get('system_config') || [];
    const rate = parseFloat(configs.find(c => c.config_key === 'FINE_RATE_PER_DAY')?.config_value || '5');
    const fine = days > 0 ? days * rate : 0;
    
    const updatedIssued = issued.map(i => i.txId === txId ? { ...i, status: 'returned', returnDate: today(), fine } : i);
    const updatedBooks = books.map(b => b.id === rec.bookId ? { ...b, available: b.available + 1 } : b);
    
    DB.set('issued', updatedIssued); DB.set('books', updatedBooks);
    if (fine > 0) { 
        const fines = DB.get('fines') || []; 
        fines.push({ id: genId('FN'), userId: rec.userId, loanId: txId, amount: fine, status: 'Unpaid', waive_reason: null }); 
        DB.set('fines', fines); 
    }
    
    addActivity('fa-undo', '#6ee7b7', `"${rec.bookTitle}" returned by ${rec.userName}`, 'rgba(110,231,183,.15)');
    reload(); alert(`📗 Asset Recovered!${fine > 0 ? ` Penalty detected: ₹${fine}` : ' Integrity check passed.'}`);
  };

  const handleRenew = (txId) => {
    const configs = DB.get('system_config') || [];
    const period = parseInt(configs.find(c => c.config_key === 'STUDENT_LOAN_PERIOD')?.config_value || '14');
    const updatedIssued = issued.map(i => i.txId === txId ? { ...i, dueDate: addDays(today(), period) } : i);
    DB.set('issued', updatedIssued); reload(); alert('📅 Temporal lease extended!');
  };

  const tabs = [
    { k: 'issue', l: 'Issue Protocol', icon: ArrowUpRight },
    { k: 'return', l: 'Recovery Process', icon: Undo2 },
    { k: 'all', l: 'Transaction Journal', icon: List },
  ];

  const stats = [
    { label: 'Total Volume', value: books.reduce((a,b) => a+(b.qty||0),0), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
    { label: 'Available Assets', value: books.reduce((a,b) => a+(b.available||0),0), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
    { label: 'Active Loans', value: activeLoans.length, icon: ArrowUpRight, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { label: 'Critical Overdue', value: overdueLoans.length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/10' },
  ];

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Circulation Command</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Resource allocation & retrieval management</p>
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">
           Operator: <span className="text-indigo-600">LIB-01</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} delay={i + 1} className="relative group">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-all group-hover:shadow-lg`}>
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

      {/* Tabs Design */}
      <div className="flex items-center space-x-2 p-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-fit">
        {tabs.map(t => (
          <button 
            key={t.k} 
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              tab === t.k 
              ? 'bg-[var(--accent-base)] text-white shadow-lg' 
              : 'text-slate-500 hover:text-slate-300'
            }`} 
            onClick={() => setTab(t.k)}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.l}</span>
          </button>
        ))}
      </div>

      {/* Content Areas */}
      {tab === 'issue' && (
        <Card className="border-t-4 border-t-indigo-500 shadow-2xl py-12">
          <div className="max-w-4xl mx-auto space-y-12">
             <div className="text-center">
                <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
                   <ArrowUpRight className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">New Allocation Protocol</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Assigning intellectual property to verified identity</p>
             </div>

             <form onSubmit={handleIssue} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Input label="Identity Node (User ID)" name="userId" required placeholder="e.g. STU-001" icon={User} />
                  <Input label="Registry Code (Book ID)" name="bookId" required placeholder="e.g. BK-2026-042" icon={BookOpen} />
                  <Input label="Temporal Lease (Due Date)" name="dueDate" type="date" defaultValue={addDays(today(), 14)} required icon={ClipboardList} />
                </div>
                <div className="flex justify-center pt-4">
                  <Button type="submit" className="px-16 py-6 h-auto text-sm uppercase font-black tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/20">
                     Initialize Issuance
                  </Button>
                </div>
             </form>
          </div>
        </Card>
      )}

      {tab === 'return' && (
        <Card className="p-0 border-none overflow-hidden shadow-xl">
          <div className="bg-[var(--bg-secondary)] px-8 py-6 border-b border-[var(--border-color)]">
             <h3 className="font-black text-lg tracking-tight uppercase">Active Lease Stream</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Manual recovery queue for active intellectual assets</p>
          </div>
          <div className="overflow-x-auto rounded-b-2xl border border-[var(--border-color)] border-t-0">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Specification</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Finality Node</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">State</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
                {activeLoans.map(i => {
                  const isOverdue = i.dueDate < today();
                  return (
                    <tr key={i.txId} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-5 px-8">
                         <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                            {i.txId}
                         </span>
                      </td>
                      <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)]">{i.userName}</td>
                      <td className="py-5 px-8 text-xs font-bold text-[var(--text-secondary)] italic">"{i.bookTitle}"</td>
                      <td className="py-5 px-8 text-xs font-black text-slate-500">{fmtDate(i.dueDate)}</td>
                      <td className="py-5 px-8">
                        <Badge type={isOverdue ? 'overdue' : 'primary'}>
                          {isOverdue ? `CRITICAL (${daysDiff(i.dueDate, today())}d)` : 'NOMINAL'}
                        </Badge>
                      </td>
                      <td className="py-5 px-8">
                         <div className="flex space-x-2">
                           <Button 
                             variant="primary" 
                             className="py-1.5 h-auto text-[9px] px-3 shadow-none bg-emerald-600 hover:bg-emerald-500"
                             onClick={() => handleReturn(i.txId)}
                           >
                             Recover
                           </Button>
                           {!isOverdue && (
                             <Button 
                               variant="ghost" 
                               className="py-1.5 h-auto text-[9px] px-3 border-slate-200 dark:border-slate-800"
                               onClick={() => handleRenew(i.txId)}
                             >
                               Extend
                             </Button>
                           )}
                         </div>
                      </td>
                    </tr>
                  );
                })}
                {activeLoans.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                           <Database className="h-8 w-8" />
                        </div>
                        <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Zero Active Leases</h4>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">All intellectual assets are currently internalized.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'all' && (
        <Card className="p-0 border-none overflow-hidden shadow-xl">
           <div className="bg-[var(--bg-secondary)] px-8 py-6 border-b border-[var(--border-color)]">
             <h3 className="font-black text-lg tracking-tight uppercase">Master Circulation Ledger</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Complete historical record of institutional asset movements</p>
          </div>
          <div className="overflow-x-auto rounded-b-2xl border border-[var(--border-color)] border-t-0">
            <table className="w-full text-left font-sans text-sm">
              <thead>
                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity / Asset</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Issuance</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deadlines</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recovery</th>
                  <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Finality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
                {issued.map(i => (
                  <tr key={i.txId} className="group hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-4 px-8 font-black text-xs text-indigo-600">{i.txId}</td>
                    <td className="py-4 px-8">
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-[var(--text-primary)]">{i.userName}</span>
                        <span className="text-[10px] font-bold text-slate-400 italic">"{i.bookTitle}"</span>
                      </div>
                    </td>
                    <td className="py-4 px-8 text-xs font-bold text-slate-500">{fmtDate(i.issueDate)}</td>
                    <td className="py-4 px-8 text-xs font-bold text-slate-500">{fmtDate(i.dueDate)}</td>
                    <td className="py-4 px-8 text-xs font-bold text-emerald-600">{i.returnDate ? fmtDate(i.returnDate) : '--'}</td>
                    <td className="py-4 px-8">
                       <Badge type={i.status === 'returned' ? 'available' : (i.dueDate < today() ? 'overdue' : 'primary')}>
                         {i.status.toUpperCase()}
                       </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CirculationDesk;
