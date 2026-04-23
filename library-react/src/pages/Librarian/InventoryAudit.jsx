import React, { useState, useEffect } from 'react';
import { DB, addAuditLog, addActivity } from '../../utils/db';
import { Search, ClipboardList, ScanLine, Database, CheckCircle2, AlertOctagon, Wrench, XCircle } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const InventoryAudit = () => {
  const [items, setItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  const reload = () => { setItems(DB.get('physical_items') || []); setBooks(DB.get('books') || []); };
  useEffect(reload, []);

  const updateStatus = (itemId, newStatus) => {
    const item = items.find(i => i.id === itemId);
    if (!item || !window.confirm(`Audit Conflict: Mark ${item.barcode} as ${newStatus}?`)) return;
    const updated = items.map(i => i.id === itemId ? { ...i, status: newStatus } : i);
    DB.set('physical_items', updated);
    addAuditLog('LIB001', 'INVENTORY_UPDATE', itemId, `Status → ${newStatus}`);
    addActivity('fa-boxes-stacked', '#a78bfa', `Item ${item.barcode}: ${newStatus}`, 'rgba(167,139,250,.12)');
    setItems(updated);
    alert(`✅ Audit Record Synchronized: ${newStatus}!`);
  };

  const filtered = items.filter(i => {
    const book = books.find(b => b.id === i.book_id);
    const title = book ? book.title.toLowerCase() : '';
    return i.barcode.toLowerCase().includes(search.toLowerCase()) || title.includes(search.toLowerCase());
  });

  const statusMap = { 
    Available: { badge: 'available', icon: CheckCircle2, color: 'text-emerald-500' }, 
    CheckedOut: { badge: 'primary', icon: ScanLine, color: 'text-indigo-500' }, 
    Lost: { badge: 'overdue', icon: XCircle, color: 'text-rose-500' }, 
    Damaged: { badge: 'overdue', icon: AlertOctagon, color: 'text-amber-500' }, 
    'In Repair': { badge: 'default', icon: Wrench, color: 'text-purple-500' } 
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Physical Audit</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Integrity tracking of localized physical assets</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
           <Database className="w-3 h-3 mr-2" /> Index Sync: Nominal
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="w-full md:w-96">
          <Input 
            icon={Search} 
            placeholder="Scan Barcode or Search Title..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
           Auditing {filtered.length} Disparate Assets
        </div>
      </div>

      <Card className="p-0 border-none overflow-visible shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Barcode Identifier</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Specification</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Branch Node</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current Integrity</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Audit Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(i => {
                const book = books.find(b => b.id === i.book_id);
                const st = statusMap[i.status] || { badge: 'default', icon: ClipboardList, color: 'text-slate-400' };
                return (
                  <tr key={i.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-5 px-8">
                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                          {i.barcode}
                       </span>
                    </td>
                    <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)] leading-tight group-hover:text-indigo-600 transition-colors">
                       {book ? book.title : i.book_id}
                    </td>
                    <td className="py-5 px-8">
                       <Badge type="primary" className="text-[9px] lowercase italic">{i.branch_id}</Badge>
                    </td>
                    <td className="py-5 px-8">
                       <div className="flex items-center space-x-2">
                          <st.icon className={`h-4 w-4 ${st.color}`} />
                          <Badge type={st.badge}>{i.status.toUpperCase()}</Badge>
                       </div>
                    </td>
                    <td className="py-5 px-8">
                       <select 
                         value={i.status} 
                         onChange={e => updateStatus(i.id, e.target.value)} 
                         className="pro-input py-1.5 h-auto text-[9px] font-black uppercase tracking-widest bg-transparent border-slate-200 dark:border-slate-800 focus:ring-1"
                       >
                         <option value="Available">Available</option>
                         <option value="Lost">Lost</option>
                         <option value="Damaged">Damaged</option>
                         <option value="In Repair">In Repair</option>
                         <option value="CheckedOut" disabled>CheckedOut</option>
                       </select>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <ClipboardList className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Zero Entries Found</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No physical assets matching current audit query</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-slate-900 text-white border-none p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ScanLine className="w-32 h-32" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Asset Integrity Audit</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">Regular physical auditing ensures data parity between library catalogs and actual physical inventory. All status overrides are logged for security oversight.</p>
        </Card>
      </div>
    </div>
  );
};

export default InventoryAudit;
