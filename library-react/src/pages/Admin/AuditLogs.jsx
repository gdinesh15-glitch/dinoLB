import React, { useState, useEffect } from 'react';
import { DB, timeAgo } from '../../utils/db';
import { ShieldCheck, Trash2, Database, Search, History } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { setLogs(DB.get('audit_logs') || []); }, []);

  const filtered = logs.filter(l => !filter || l.action.includes(filter));

  const actionTypes = {
    USER_CREATE: { badge: 'primary', label: 'USER REGISTRATION' },
    USER_UPDATE: { badge: 'primary', label: 'USER MODIFICATION' },
    USER_DELETE: { badge: 'overdue', label: 'IDENTITY DELETION' },
    USER_STATUS: { badge: 'available', label: 'STATUS TOGGLE' },
    CONFIG_UPDATE: { badge: 'primary', label: 'SYSTEM RECONFIG' },
    BOOK_ISSUE: { badge: 'available', label: 'ASSET DEPLOYED' },
    BOOK_RETURN: { badge: 'available', label: 'ASSET RECOVERY' },
    SYSTEM_SEED: { badge: 'default', label: 'SYSTEM INITIALIZATION' },
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Audit Journal</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Immutable record of system state transitions</p>
        </div>
        <Button 
          variant="secondary"
          onClick={() => { if(window.confirm('Wipe system logs?')) { DB.set('audit_logs', []); setLogs([]); } }}
          className="border-rose-100 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/20 dark:hover:bg-rose-900/20"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Purge Records
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-2 flex-wrap">
          {['', 'USER', 'CONFIG', 'BOOK', 'SYSTEM'].map(f => (
            <button 
              key={f} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-indigo-500/50'
              }`} 
              onClick={() => setFilter(f)}
            >
              {f || 'Entire Journal'}
            </button>
          ))}
        </div>
        <div className="w-full md:w-80">
          <Input 
            icon={Search} 
            placeholder="Search by Action..." 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
          />
        </div>
      </div>

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Temporal Node</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actor</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transition Type</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Entity Target</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(l => (
                <tr key={l.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                       <History className="h-3 w-3 text-slate-400" />
                       <span className="text-[10px] font-black text-slate-500 uppercase">{timeAgo(l.timestamp)}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 font-black text-xs text-indigo-600">{l.userId}</td>
                  <td className="py-5 px-8">
                    <Badge type={actionTypes[l.action]?.badge || 'default'}>
                      {actionTypes[l.action]?.label || l.action}
                    </Badge>
                  </td>
                  <td className="py-5 px-8 font-mono text-[10px] bg-slate-50 dark:bg-slate-900/40 text-[var(--text-secondary)]">{l.target}</td>
                  <td className="py-5 px-8 text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">{l.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Database className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Empty Ledger</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No system transitions found for the active filter</p>
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
            <ShieldCheck className="w-32 h-32" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Integrity Assurance</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 relative z-10">The audit journal is a semi-permanent record of all high-privilege operations within the VEMU LMS. It facilitates compliance and troubleshooting through precise temporal mapping.</p>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 relative z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Ledger Healthy: Sync Complete</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;
