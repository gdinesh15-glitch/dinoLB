import React, { useState, useEffect } from 'react';
import { DB, fmtDate, addAuditLog } from '../../utils/db';
import { Clock, Send, X, BookOpen, Layers, Users, Database } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const HoldQueueManager = () => {
  const [holds, setHolds] = useState([]);
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState('Pending');

  const reload = () => { setHolds(DB.get('hold_queue') || []); setBooks(DB.get('books') || []); };
  useEffect(reload, []);

  const handleStatusChange = (holdId, newStatus) => {
    const updated = holds.map(x => x.id === holdId ? { ...x, status: newStatus } : x);
    DB.set('hold_queue', updated); setHolds(updated);
    addAuditLog('LIB001', 'HOLD_STATUS_CHANGE', holdId, `Status → ${newStatus}`);
    alert(`✅ Hold status updated to ${newStatus}!`);
  };

  const notifyUser = (holdId) => {
    alert(`📧 Dispatching notification to patron identity...`);
    handleStatusChange(holdId, 'Ready');
  };

  const filtered = holds.filter(h => filter === 'all' || h.status === filter);

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Reserve Intelligence</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Resource queuing & prioritization logic</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-center">
           <Layers className="w-3 h-3 mr-2" /> Depth: {holds.filter(h => h.status === 'Pending').length} Pending
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-2 flex-wrap p-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl">
          {['all', 'Pending', 'Ready', 'Fulfilled', 'Canceled'].map(f => (
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
      </div>

      <Card className="p-0 border-none overflow-visible shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hold Registry</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity node</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resource Specification</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Temporal Node</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Weight</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">State</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(h => {
                const book = books.find(b => b.id === h.bookId);
                return (
                  <tr key={h.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-5 px-8">
                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                          {h.id}
                       </span>
                    </td>
                    <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)]">{h.userId}</td>
                    <td className="py-5 px-8">
                      <div className="flex flex-col">
                        <span className="font-black text-sm text-[var(--text-primary)] leading-tight group-hover:text-indigo-600 transition-colors">{book ? book.title : h.bookId}</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Availability: {book?.available || 0}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-xs font-bold text-slate-500">{fmtDate(h.requestDate)}</td>
                    <td className="py-5 px-8">
                      <span className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center w-8 h-8 rounded-full font-black text-xs border border-indigo-100 dark:border-indigo-900/30">
                        {h.position}
                      </span>
                    </td>
                    <td className="py-5 px-8">
                      <Badge type={h.status === 'Ready' ? 'available' : h.status === 'Pending' ? 'primary' : h.status === 'Canceled' ? 'overdue' : 'default'}>
                        {h.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex space-x-2">
                        {h.status === 'Pending' && book?.available > 0 && (
                          <Button 
                            variant="primary" 
                            className="py-1.5 h-auto text-[9px] px-3 shadow-none bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => notifyUser(h.id)}
                          >
                            <Send className="w-3 h-3 mr-2" /> Dispatch
                          </Button>
                        )}
                        {h.status !== 'Fulfilled' && h.status !== 'Canceled' && (
                          <button 
                            onClick={() => handleStatusChange(h.id, 'Canceled')} 
                            className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-950/30 dark:hover:bg-rose-600 shadow-sm"
                          >
                             <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Clock className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Queue Neutral</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No active reserve weights found for the active filter</p>
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

export default HoldQueueManager;
