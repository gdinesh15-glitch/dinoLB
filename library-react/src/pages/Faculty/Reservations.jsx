import React, { useState, useEffect } from 'react';
import { Bookmark, BookOpen, Clock, Trash2, Loader2, Info, CheckCircle } from 'lucide-react';
import { Card, Badge } from '../../components/SharedUI';
import api from '../../api/axios';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faculty/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error('Failed to fetch reservations');
    }
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Terminate this reservation protocol?')) return;
    setCanceling(id);
    try {
      await api.delete(`/faculty/reserve/${id}`);
      alert('✅ Reservation canceled successfully.');
      fetchReservations();
    } catch (err) {
      alert('Cancellation failed');
    }
    setCanceling(null);
  };

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Reservation Registry</h1>
        <p className="text-xs font-medium text-slate-500">View and manage your current book reservations and pickup schedule.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
           <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
           <p className="text-[10px] font-black text-white uppercase tracking-widest">Accessing Registry Records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map(res => (
            <div key={res._id} style={cardStyle} className="rounded-3xl p-6 flex flex-col group hover:border-slate-700 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                     <Bookmark className="w-5 h-5" />
                  </div>
                  <Badge type="primary">RESERVED</Badge>
               </div>
               
               <div className="flex-1 space-y-1 mb-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight line-clamp-2">{res.book?.title}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{res.book?.author}</p>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                     <span className="text-slate-500 uppercase tracking-widest">Pickup Deadline</span>
                     <span className="text-white">{new Date(res.dueDate).toLocaleDateString()}</span>
                  </div>
                  <button 
                    disabled={canceling === res._id}
                    onClick={() => handleCancel(res._id)}
                    className="w-full h-10 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    {canceling === res._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Cancel Protocol
                  </button>
               </div>
            </div>
          ))}
          {reservations.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4 opacity-30 border-2 border-dashed border-slate-800 rounded-[3rem]">
               <Info className="w-12 h-12 text-slate-500 mx-auto" />
               <p className="text-xs font-black text-white uppercase tracking-widest">No active reservations in the registry</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reservations;
