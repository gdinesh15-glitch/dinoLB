import React, { useState, useEffect } from 'react';
import { DB, timeAgo } from '../../utils/db';
import userService from '../../api/services/userService';
import bookService from '../../api/services/bookService';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const LibrarianOverview = () => {
  const [stats, setStats] = useState({ books: 0, activeLoans: 0, overdue: 0, holdQueue: 0 });
  const [loading, setLoading] = useState(true);

  // Mock data for the circulation chart
  const circulationData = [
    { name: 'Mon', checkouts: 120, returns: 100 },
    { name: 'Tue', checkouts: 150, returns: 130 },
    { name: 'Wed', checkouts: 180, returns: 160 },
    { name: 'Thu', checkouts: 140, returns: 145 },
    { name: 'Fri', checkouts: 250, returns: 200 },
    { name: 'Sat', checkouts: 90, returns: 110 },
    { name: 'Sun', checkouts: 40, returns: 50 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const statsRes = await userService.getStats();
      if (statsRes.success) {
        setStats({
          books: statsRes.data.books,
          activeLoans: statsRes.data.issued,
          overdue: statsRes.data.overdue || 0,
          holdQueue: statsRes.data.holdQueue || 0
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="sec active" id="librarianDashboardContent" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', paddingBottom: '40px' }}>
      
      {/* Hero Banner */}
      <div style={{ 
        position: 'relative', overflow: 'hidden', padding: '40px', borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(15,20,35,0.9), rgba(10,15,25,0.95))', 
        border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px'
      }}>
        {/* Decorative background glows */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: '#3b82f6', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#10b981', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Librarian Command Desk
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>
            Circulation & Catalog Management
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', color: '#3b82f6', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)' }}>
            <i className="fas fa-search" style={{ fontSize: '14px' }}></i>
            Quick Search Catalog
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="stat-card" style={{ '--sc-color': '#10b981', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)' }}><i className="fas fa-book-open"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.books}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Volume</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-book-open"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#6366f1', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)' }}><i className="fas fa-exchange-alt"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.activeLoans}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Circulating Items</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-exchange-alt"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#e11d48', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(225, 29, 72, 0.15)' }}><i className="fas fa-exclamation-triangle"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.overdue}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical Overdue</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-exclamation-triangle"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#f59e0b', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(245,158,11, 0.15)' }}><i className="fas fa-clock"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.holdQueue}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hold Requests</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-clock"></i></div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fas fa-chart-area" style={{ color: '#10b981', marginRight: '12px' }}></i> Circulation Velocity Analytics
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', fontWeight: '700', marginTop: '6px' }}>Checkout and Return patterns over the past 7 days</p>
          </div>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={circulationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCheckouts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--t2)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--t2)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15,10,25,0.95)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#fff' }}
                itemStyle={{ fontWeight: '800' }}
              />
              <Area type="monotone" dataKey="checkouts" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCheckouts)" activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="returns" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReturns)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* Librarian Tools Panel */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fas fa-toolbox" style={{ color: '#3b82f6', marginRight: '12px' }}></i> Librarian Utilities
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <Link to="/librarian/circulation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '20px', gap: '16px', color: 'var(--t1)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center', boxShadow: 'inset 0 0 0 1px transparent' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.02)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99,102,241,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(99,102,241,0.2)' }}>
                 <i className="fas fa-exchange-alt"></i>
               </div>
               <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Transaction</span>
            </Link>

            <Link to="/librarian/catalog" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '20px', gap: '16px', color: 'var(--t1)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center', boxShadow: 'inset 0 0 0 1px transparent' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'rgba(16,185,129,0.02)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(16,185,129,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                 <i className="fas fa-plus-circle"></i>
               </div>
               <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Index New Book</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LibrarianOverview;
