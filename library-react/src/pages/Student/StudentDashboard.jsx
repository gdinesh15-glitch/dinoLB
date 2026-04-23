import React, { useState, useEffect } from 'react';
import { DB, today, fmtDate, daysDiff } from '../../utils/db';
import { BookMarked, Clock, IndianRupee, Bookmark, History } from 'lucide-react';

const StudentDashboard = () => {
  const [issued, setIssued] = useState([]);
  const [books, setBooks] = useState([]);
  const [activities, setActivities] = useState([]);
  const userId = 'STU001';
  const userName = 'Aditya Sharma';

  useEffect(() => {
    setIssued((DB.get('issued') || []).filter(i => i.userId === userId));
    setBooks(DB.get('books') || []);
    setActivities(DB.get('activity') || []);
  }, []);

  const activeLoans = issued.filter(i => i.status === 'issued');
  const overdueLoans = activeLoans.filter(i => i.dueDate < today());
  const configs = DB.get('system_config') || [];
  const rate = parseFloat(configs.find(c => c.config_key === 'FINE_RATE_PER_DAY')?.config_value || '5');
  const totalFine = activeLoans.reduce((acc, i) => { const d = daysDiff(i.dueDate, today()); return acc + (d > 0 ? d * rate : 0); }, 0);

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">My Issued Books</h1><p className="text-gray-500 text-sm">{fmtDate(today())} — Welcome back, {userName}</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><BookMarked className="w-6 h-6" /></div>
          <div><div className="text-2xl font-bold text-gray-900">{activeLoans.length}</div><div className="text-xs text-gray-500">Books Borrowed</div></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-red-50 rounded-lg text-red-600"><Clock className="w-6 h-6" /></div>
          <div><div className="text-2xl font-bold text-gray-900">{overdueLoans.length}</div><div className="text-xs text-gray-500">Overdue</div></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><IndianRupee className="w-6 h-6" /></div>
          <div><div className="text-2xl font-bold text-gray-900">₹{totalFine}</div><div className="text-xs text-gray-500">Current Fine</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2"><Bookmark className="w-5 h-5 text-blue-500" /><h3 className="font-bold text-gray-800">Currently Reading</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-5 font-semibold text-xs text-gray-500 uppercase">Book Title</th>
                <th className="py-4 px-5 font-semibold text-xs text-gray-500 uppercase">Due Date</th>
                <th className="py-4 px-5 font-semibold text-xs text-gray-500 uppercase">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {activeLoans.map(i => (
                  <tr key={i.txId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5 font-semibold text-sm text-gray-900">{i.bookTitle}</td>
                    <td className="py-3 px-5 text-sm text-gray-500">{fmtDate(i.dueDate)}</td>
                    <td className="py-3 px-5"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${i.dueDate < today() ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{i.dueDate < today() ? 'Overdue' : 'Active'}</span></td>
                  </tr>
                ))}
                {activeLoans.length === 0 && <tr><td colSpan="3" className="py-8 text-center text-gray-400">No books currently borrowed</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2"><History className="w-5 h-5 text-rose-500" /><h3 className="font-bold text-gray-800">Recent Activity</h3></div>
          <div className="p-5 space-y-4">
            {activities.filter(a => a.text.includes(userName.split(' ')[0])).slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <div><p className="text-sm text-gray-700">{a.text}</p><p className="text-xs text-gray-400 mt-0.5">{fmtDate(a.ts)}</p></div>
              </div>
            ))}
            {activities.length === 0 && <p className="text-center text-gray-400 py-4">No recent activity</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
