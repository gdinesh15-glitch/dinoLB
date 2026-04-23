import React, { useState, useEffect } from 'react';
import { Send, X, Info, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const RequestBook = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    bookId: location.state?.bookId || '',
    preferredDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  useEffect(() => {
    if (location.state?.bookId) {
      setFormData(prev => ({ ...prev, bookId: location.state.bookId }));
    }
  }, [location.state]);

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData({
      bookId: '',
      preferredDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bookId) {
      setToast({ show: true, message: 'Please enter a Book ID.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      return;
    }

    const submitRequest = async () => {
      const { pushNotif, DB } = await import('../../utils/db');
      const user = JSON.parse(localStorage.getItem('session') || '{}');
      
      pushNotif('fa-bookmark', 'rgba(110,231,183,.15)', '#6ee7b7', `Book request submitted by ${user.name || 'Student'}: ID ${formData.bookId}`, 'success');
      
      const queue = DB.get('hold_queue') || [];
      DB.set('hold_queue', [...queue, { 
        id: 'HQ' + Date.now(), 
        userId: user.id, 
        bookId: formData.bookId, 
        requestDate: new Date().toISOString(), 
        status: 'Pending' 
      }]);

      setToast({ show: true, message: 'Book request submitted successfully!', type: 'success' });
      setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
        handleClear();
      }, 3000);
    };

    submitRequest();
  };

  return (
    <div className="space-y-8 animate-in pb-8">
      <div className="flex flex-col mb-4">
        <div className="flex items-center space-x-3 text-white mb-2">
          <i className="fas fa-hand-paper text-emerald-500 text-2xl"></i>
          <h2 className="text-2xl font-bold tracking-tight">Request a Book</h2>
        </div>
      </div>

      <div className="bg-[#15232d] border border-cyan-500/20 rounded-2xl p-6 flex items-center shadow-md relative overflow-hidden group">
        <div className="bg-cyan-500/20 p-2 rounded-full flex items-center justify-center mr-4 relative z-10 flex-shrink-0 w-8 h-8">
          <Info className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-white mb-0.5 tracking-tight">How It Works</h3>
          <p className="text-xs font-medium text-slate-400">
            Enter the Book ID and submit a request. The librarian will review and approve your request.
          </p>
        </div>
      </div>

      <div className="bg-[#1b1924] border border-white/5 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Book ID *</label>
              <input 
                type="text" 
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                placeholder="e.g. BK001"
                className="w-full bg-[#13111a] border border-white/5 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 font-medium shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Preferred Date</label>
              <input 
                type="date" 
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full bg-[#13111a] border border-white/5 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-medium shadow-inner"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Reason / Purpose</label>
            <textarea 
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Why do you need this book?"
              rows="3"
              className="w-full bg-[#13111a] border border-white/5 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 font-medium shadow-inner resize-none"
            ></textarea>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <button type="submit" className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#44c7f4] to-[#2fd6aa] hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 border border-white/10">
              <Send className="h-4 w-4" />
              <span>Submit Request</span>
            </button>
            <button type="button" onClick={handleClear} className="flex items-center justify-center space-x-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 px-6 py-2.5 rounded-xl text-sm font-bold border border-white/5 transition-all active:scale-95">
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </form>
      </div>

      {toast.show && (
        <div className={`fixed bottom-8 right-8 border shadow-2xl rounded-xl px-4 py-3 flex items-center space-x-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'error' ? 'bg-[#2a1318] border-rose-500/30' : 'bg-[#1a2318] border-emerald-500/30'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${toast.type === 'error' ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}>
            {toast.type === 'error' ? <X className="h-4 w-4 text-rose-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          </div>
          <span className={`text-sm font-bold tracking-wide ${toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default RequestBook;
