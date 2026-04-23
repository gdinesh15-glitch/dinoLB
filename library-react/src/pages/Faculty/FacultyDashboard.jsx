import React, { useState, useEffect } from 'react';
import { DB, today, fmtDate } from '../../utils/db';
import { Users, BookMarked, BookOpen, ExternalLink } from 'lucide-react';

const FacultyDashboard = () => {
  const [reserves, setReserves] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [issued, setIssued] = useState([]);
  const userId = 'FAC001';

  useEffect(() => {
    setReserves((DB.get('course_reserves') || []).filter(r => r.facultyId === userId));
    setProcurements((DB.get('procurement_requests') || []).filter(p => p.facultyId === userId));
    setIssued((DB.get('issued') || []).filter(i => i.userId === userId));
  }, []);

  const activeReserves = reserves.filter(r => r.status === 'Active');
  const pendingProcurements = procurements.filter(p => p.status === 'Pending');

  const databases = ['IEEE Xplore', 'ScienceDirect', 'ACM Digital Library', 'SpringerLink', 'JSTOR', 'PubMed'];

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Faculty Portal</h1><p className="text-gray-500 text-sm">{fmtDate(today())} — Academic Oversight</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><BookMarked className="w-6 h-6" /></div>
          <div><div className="text-2xl font-bold text-gray-900">{issued.length}</div><div className="text-xs text-gray-500">Borrowed Items</div></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><BookOpen className="w-6 h-6" /></div>
          <div><div className="text-2xl font-bold text-gray-900">{activeReserves.length}</div><div className="text-xs text-gray-500">Course Reserves</div></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><Users className="w-6 h-6" /></div>
          <div><div className="text-2xl font-bold text-gray-900">{pendingProcurements.length}</div><div className="text-xs text-gray-500">Pending Requests</div></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50"><h3 className="font-bold text-gray-800">Research Databases</h3></div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {databases.map(db => (
              <button key={db} onClick={() => alert(`SSO Routing to ${db}...`)} className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors border border-gray-100">
                <ExternalLink className="w-3.5 h-3.5 opacity-50" /> {db}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50"><h3 className="font-bold text-gray-800">Announcements</h3></div>
          <div className="p-5 space-y-4">
            {[
              { text: 'Library orientations for Fall 2026 start next week.', color: 'bg-blue-500' },
              { text: 'New digital subscription to Nature Electronics now active.', color: 'bg-purple-500' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <span className={`w-2.5 h-2.5 rounded-full ${a.color} mt-1.5`}></span>
                <p className="text-sm text-gray-700">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
