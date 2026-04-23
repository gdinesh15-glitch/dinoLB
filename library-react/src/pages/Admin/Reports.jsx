import React, { useState, useEffect } from 'react';
import { DB, today } from '../../utils/db';
import { BarChart3, BookOpen, Users, ArrowRightLeft, AlertCircle, IndianRupee, Clock, TrendingUp, Flame, Download, Activity } from 'lucide-react';
import { Card, Badge, Button } from '../../components/SharedUI';

const Reports = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [issued, setIssued] = useState([]);
  const [fines, setFines] = useState([]);

  useEffect(() => {
    setUsers(DB.get('users') || []); setBooks(DB.get('books') || []);
    setIssued(DB.get('issued') || []); setFines(DB.get('fines') || []);
  }, []);

  const totalFines = fines.reduce((a, f) => a + f.amount, 0);
  const unpaidFines = fines.filter(f => f.status === 'Unpaid').reduce((a, f) => a + (f.amount || 0), 0);
  const popularBooks = [...books].sort((a, b) => (b.borrow || 0) - (a.borrow || 0)).slice(0, 5);
  const activeLoans = issued.filter(i => i.status !== 'returned');
  const overdueLoans = activeLoans.filter(i => i.dueDate < today());
  const totalBooksCount = books.reduce((a, b) => a + (b.qty || 0), 0);

  const analyticsGrid = [
    { label: 'Registered Personnel', value: users.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
    { label: 'Total Volume', value: totalBooksCount, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    { label: 'Circulating Assets', value: activeLoans.length, icon: ArrowRightLeft, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
    { label: 'Critical Overdue', value: overdueLoans.length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/10' },
    { label: 'Revenue Generated', value: `₹${totalFines}`, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { label: 'Outstanding Dues', value: `₹${unpaidFines}`, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
  ];

  const categories = [...new Set(books.map(b => b.category))];

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Analytics Intelligence</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Cross-sectional performance telemetry</p>
        </div>
        <Button variant="secondary" className="h-11 px-6 shadow-none" onClick={() => {
          const exportData = {
            users: users.length,
            books: totalBooksCount,
            activeLoans: activeLoans.length,
            overdueLoans: overdueLoans.length,
            totalRevenue: totalFines,
            outstandingDues: unpaidFines,
            popularBooks: popularBooks.map(b => ({ title: b.title, loans: b.borrow })),
            timestamp: new Date().toISOString()
          };
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href", dataStr);
          downloadAnchorNode.setAttribute("download", `vemu_library_report_${new Date().toISOString().split('T')[0]}.json`);
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
        }}>
          <Download className="w-4 h-4 mr-2" /> Export Core Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsGrid.map((s, i) => (
          <Card key={i} delay={i + 1} className="relative group overflow-hidden border-b-4 border-b-transparent hover:border-b-indigo-500 transition-all">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-all group-hover:scale-110`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">{s.label}</p>
                <h3 className="text-2xl font-black tracking-tight">{s.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High-Velocity Assets */}
        <Card delay={7}>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="font-black text-lg tracking-tight uppercase">High-Velocity Assets</h3>
          </div>
          
          <div className="space-y-6">
            {popularBooks.map((b, i) => (
              <div key={b.id} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                   <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {i + 1}
                   </div>
                   <div>
                      <p className="font-black text-sm text-[var(--text-primary)] tracking-tight uppercase">{b.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.author}</p>
                   </div>
                </div>
                <Badge type="primary">{b.borrow || 0} Loans</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Thematic Segmentation */}
        <Card delay={8}>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-black text-lg tracking-tight uppercase">Thematic Segmentation</h3>
          </div>

          <div className="space-y-8">
            {categories.map(cat => {
              const count = books.filter(b => b.category === cat).length;
              const pct = Math.round((count / (books.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">{cat}</span>
                    <span className="text-[10px] font-black text-indigo-500 uppercase">{count} Titles ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
             <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20 animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time sync enabled</p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
