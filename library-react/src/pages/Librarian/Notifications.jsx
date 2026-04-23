import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle, AlertTriangle, Info, Clock, 
  Trash2, Filter, MoreVertical, CheckCheck, 
  MessageSquare, RefreshCw, BookOpen, RotateCcw
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'overdue', 
      title: 'Overdue Book Alert', 
      message: 'Book "The Complete Reference - Java" is overdue for student STU001.', 
      time: '2 mins ago', 
      read: false,
      priority: 'high'
    },
    { 
      id: 2, 
      type: 'stock', 
      title: 'Low Stock Notification', 
      message: 'Only 2 copies left for "Data Structures using C++".', 
      time: '1 hour ago', 
      read: false,
      priority: 'medium'
    },
    { 
      id: 3, 
      type: 'return', 
      title: 'New Book Return', 
      message: 'Student STU005 has returned "Operating Systems".', 
      time: '3 hours ago', 
      read: true,
      priority: 'low'
    },
    { 
      id: 4, 
      type: 'reservation', 
      title: 'New Reservation', 
      message: 'Faculty FAC002 has reserved "Artificial Intelligence".', 
      time: '5 hours ago', 
      read: true,
      priority: 'medium'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'stock': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'return': return <RotateCcw className="w-4 h-4 text-emerald-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const cardStyle = { 
    background: 'rgba(15,23,42,0.6)', 
    border: '1px solid rgba(51,65,85,0.4)', 
    backdropFilter: 'blur(16px)' 
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Notifications</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-70">
            Real-time alerts & service reminders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 transition-all"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        <button 
          onClick={() => setFilter('all')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${filter === 'all' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          All Alerts ({notifications.length})
          {filter === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${filter === 'unread' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Unread ({notifications.filter(n => !n.read).length})
          {filter === 'unread' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <div 
              key={n.id} 
              style={cardStyle}
              className={`p-5 rounded-2xl flex gap-4 group transition-all hover:scale-[1.01] hover:border-slate-700 ${!n.read ? 'border-l-4 border-l-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.05)]' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.read ? 'bg-indigo-500/10' : 'bg-slate-800/50'}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm font-black truncate ${!n.read ? 'text-white' : 'text-slate-400'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-tighter">
                    <Clock className="w-3 h-3 inline mr-1" /> {n.time}
                  </span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${!n.read ? 'text-slate-300' : 'text-slate-500'}`}>
                  {n.message}
                </p>
                {!n.read && (
                  <button 
                    onClick={() => markRead(n.id)}
                    className="mt-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Mark as read
                  </button>
                )}
              </div>
              <div className="flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => deleteNotification(n.id)}
                  className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center space-y-4 opacity-50">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto border border-slate-700">
               <Bell className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-widest">No notifications found</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tighter">Everything is up to date</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
