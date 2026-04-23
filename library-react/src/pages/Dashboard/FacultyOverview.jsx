import React, { useState, useEffect } from 'react';
import { DB } from '../../utils/db';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const FacultyOverview = () => {
  const [reserves, setReserves] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [issued, setIssued] = useState([]);

  // Mock data for Faculty engagement
  const engagementData = [
    { name: 'Mon', students: 120, downloads: 45 },
    { name: 'Tue', students: 150, downloads: 60 },
    { name: 'Wed', students: 180, downloads: 85 },
    { name: 'Thu', students: 140, downloads: 50 },
    { name: 'Fri', students: 250, downloads: 120 },
    { name: 'Sat', students: 90, downloads: 30 },
    { name: 'Sun', students: 40, downloads: 15 },
  ];

  useEffect(() => {
    const userId = 'FAC001';
    const allReserves = DB.get('course_reserves') || [];
    const allProcurements = DB.get('procurement_requests') || [];
    const allIssued = DB.get('issued') || [];

    setReserves(allReserves.filter(r => r.facultyId === userId));
    setProcurements(allProcurements.filter(p => p.facultyId === userId));
    setIssued(allIssued.filter(i => i.userId === userId));
  }, []);

  return (
    <div className="sec active" id="facultyDashboardContent" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', paddingBottom: '40px' }}>
      
      {/* Hero Banner */}
      <div style={{ 
        position: 'relative', overflow: 'hidden', padding: '40px', borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(25,15,35,0.9), rgba(15,10,25,0.95))', 
        border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px'
      }}>
        {/* Decorative background glows */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: '#8b5cf6', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#ec4899', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Faculty Research Portal
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>
            Departmental Syllabus & Resources
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '16px', color: '#8b5cf6', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)' }}>
            <i className="fas fa-graduation-cap" style={{ fontSize: '14px' }}></i>
            Fall 2026 Linked
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="stat-card" style={{ '--sc-color': '#8b5cf6', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)' }}><i className="fas fa-bookmark"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{issued.length}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Loans</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-bookmark"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#10b981', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)' }}><i className="fas fa-book-reader"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{reserves.filter(r => r.status === 'Active').length}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Reserves</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-book-reader"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#8b5cf6', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(139, 92, 246, 0.15)' }}><i className="fas fa-file-invoice"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{procurements.length}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Procurement Requests</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-file-invoice"></i></div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fas fa-chart-line" style={{ color: '#8b5cf6', marginRight: '12px' }}></i> Course Engagement Analytics
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', fontWeight: '700', marginTop: '6px' }}>Student interactions with your active course reserves</p>
          </div>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--t2)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--t2)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15,10,25,0.95)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#fff' }}
                itemStyle={{ fontWeight: '800' }}
              />
              <Area type="monotone" dataKey="students" name="Active Students" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="downloads" name="Resource Downloads" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorDownloads)" activeDot={{ r: 6, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default FacultyOverview;
