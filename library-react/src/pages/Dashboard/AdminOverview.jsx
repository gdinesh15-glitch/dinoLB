import React, { useState, useEffect } from 'react';
import { DB, timeAgo } from '../../utils/db';
import userService from '../../api/services/userService';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const AdminOverview = () => {
  const [stats, setStats] = useState({ librarians: 0, faculty: 0, students: 0, books: 0, issued: 0, donations: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the chart
  const activityData = [
    { name: 'Mon', usage: 400, newUsers: 24 },
    { name: 'Tue', usage: 300, newUsers: 13 },
    { name: 'Wed', usage: 550, newUsers: 45 },
    { name: 'Thu', usage: 450, newUsers: 32 },
    { name: 'Fri', usage: 700, newUsers: 60 },
    { name: 'Sat', usage: 800, newUsers: 85 },
    { name: 'Sun', usage: 600, newUsers: 40 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await userService.getStats();
      if (res.success) {
        setStats(res.data);
      }
      
      const localActivities = DB.get('activity') || [];
      setActivities(localActivities.slice(0, 6));
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="sec active" id="adminDashboardContent" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', paddingBottom: '40px' }}>
      
      {/* Hero Banner */}
      <div style={{ 
        position: 'relative', overflow: 'hidden', padding: '40px', borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(20,15,35,0.9), rgba(15,10,25,0.95))', 
        border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px'
      }}>
        {/* Decorative background glows */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'var(--portal-accent)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#8b5cf6', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            System Intelligence
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>
            VEMU Comprehensive Admin Control
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '16px', color: '#10b981', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981', animation: 'pulse 2s infinite' }}></span>
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Stats Row using native .stat-card */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="stat-card" style={{ '--sc-color': 'var(--portal-accent)', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.15)' }}><i className="fas fa-users"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.students}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-users"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#10b981', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(16,185,129, 0.15)' }}><i className="fas fa-book"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.books}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Books</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-book"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#f59e0b', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(245,158,11, 0.15)' }}><i className="fas fa-hand-holding-heart"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.issued}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Loans</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-hand-holding-heart"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#8b5cf6', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(139,92,246, 0.15)' }}><i className="fas fa-chalkboard-teacher"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.faculty}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Faculty Members</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-chalkboard-teacher"></i></div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fas fa-chart-line" style={{ color: '#3b82f6', marginRight: '12px' }}></i> Traffic & Engagement Analytics
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', fontWeight: '700', marginTop: '6px' }}>Network requests and unique sign-ins over the past 7 days</p>
          </div>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="usage" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="newUsers" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        
        {/* Quick Actions Panel */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fas fa-bolt" style={{ color: 'var(--portal-accent)', marginRight: '12px' }}></i> Quick Actions
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <Link to="/admin/add-student" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '20px', gap: '16px', color: 'var(--t1)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center', boxShadow: 'inset 0 0 0 1px transparent' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.02)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(220,38,38,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(220, 38, 38, 0.05))', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(220,38,38,0.2)' }}>
                 <i className="fas fa-user-plus"></i>
               </div>
               <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Add Student</span>
            </Link>

            <Link to="/admin/books" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '20px', gap: '16px', color: 'var(--t1)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center', boxShadow: 'inset 0 0 0 1px transparent' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = 'rgba(16,185,129,0.02)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(16,185,129,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                 <i className="fas fa-book-medical"></i>
               </div>
               <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Asset</span>
            </Link>

            <Link to="/admin/users" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '20px', gap: '16px', color: 'var(--t1)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center', boxShadow: 'inset 0 0 0 1px transparent' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.background = 'rgba(139,92,246,0.02)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(139,92,246,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(139,92,246,0.2)' }}>
                 <i className="fas fa-users-cog"></i>
               </div>
               <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manage Users</span>
            </Link>

            <Link to="/admin/reports" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: '20px', gap: '16px', color: 'var(--t1)', textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', textAlign: 'center', boxShadow: 'inset 0 0 0 1px transparent' }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = 'rgba(245,158,11,0.02)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(245,158,11,0.1)' }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(245,158,11,0.2)' }}>
                 <i className="fas fa-chart-pie"></i>
               </div>
               <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reports</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity Panel */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
               <i className="fas fa-history" style={{ color: '#ec4899', marginRight: '12px' }}></i> Activity Feed
             </h3>
             <button style={{ background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--t2)', cursor: 'pointer', padding: '8px 12px', borderRadius: '12px', transition: 'all 0.2s' }} onMouseOver={(e) => {e.currentTarget.style.background='var(--border)'; e.currentTarget.style.color='#fff'}} onMouseOut={(e) => {e.currentTarget.style.background='var(--card2)'; e.currentTarget.style.color='var(--t2)'}}><i className="fas fa-ellipsis-h"></i></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {activities.length > 0 ? activities.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '20px', background: 'var(--bg2)', borderRadius: '20px', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                   onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.background = 'var(--card)' }}
                   onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = 'var(--bg2)' }}>
                <div style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '14px', background: 'var(--card2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', fontSize: '20px' }}>
                   <i className={a.text.includes('logged') ? "fas fa-sign-in-alt" : "fas fa-check-circle"}></i>
                </div>
                <div style={{ flex: 1 }}>
                   <p style={{ fontSize: '15px', color: '#fff', fontWeight: '700', lineHeight: '1.5' }}>{a.text}</p>
                   <div style={{ fontSize: '11px', color: 'var(--t2)', display: 'flex', gap: '16px', marginTop: '8px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-user" style={{ fontSize: '10px' }}></i> {a.userId || 'System'}</span>
                      <span style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fas fa-clock" style={{ fontSize: '10px' }}></i> {timeAgo(a.ts)}</span>
                   </div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--t2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: 'var(--card2)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                 <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <i className="fas fa-inbox" style={{ fontSize: '28px', opacity: 0.5 }}></i>
                 </div>
                 <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No recent activity to report</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;
