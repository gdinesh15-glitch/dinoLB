import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, Heart, Filter, Database, Layers, Info } from 'lucide-react';
import { Badge } from '../../components/SharedUI';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CatalogSearch = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => { 
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await api.get('/books');
        setBooks(res.data || []);
      } catch (err) {
        console.error('Failed to fetch catalog');
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleHoldRequest = async (bookId) => {
    // Basic implementation for request
    alert('✅ Request submitted. You will be notified when it is ready.');
  };

  const addToWishlist = (bookId) => {
    alert('❤️ Added to Wishlist!');
  };

  const categories = ['All', ...new Set(books.map(b => b.category).filter(Boolean))];
  const filtered = books.filter(b => {
    const titleMatch = b.title?.toLowerCase().includes(search.toLowerCase());
    const authorMatch = b.author?.toLowerCase().includes(search.toLowerCase());
    const isbnMatch = b.isbn?.includes(search);
    const matchesSearch = titleMatch || authorMatch || isbnMatch;
    return matchesSearch && (filter === 'All' || b.category === filter);
  });

  const cardStyle = { 
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '18px',
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Resource Catalog</h1>
          <p className="text-xs font-medium text-slate-500">Discover and request books from the central university repository.</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={cardStyle} className="p-4 flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              className="w-full bg-transparent border-none h-14 pl-14 pr-4 text-white font-bold outline-none placeholder:text-slate-600"
              placeholder="Search by Title, Author, or ISBN..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
         <div className="w-full md:w-64 relative flex items-center bg-slate-900/50 rounded-2xl border border-slate-700/50 px-4 h-14">
            <Filter className="w-4 h-4 text-indigo-400 mr-3" />
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
              className="bg-transparent text-xs font-black text-white uppercase tracking-widest w-full outline-none appearance-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>)}
            </select>
         </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
           <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-white uppercase tracking-widest">Querying Repository...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(book => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div key={book._id} style={cardStyle} className="p-6 flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                 
                 {/* Top Row: Icon & Status */}
                 <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                       <BookOpen className="w-7 h-7" />
                    </div>
                    <Badge type={isAvailable ? 'available' : 'overdue'}>
                      {isAvailable ? 'AVAILABLE' : 'OUT OF STOCK'}
                    </Badge>
                 </div>
                 
                 {/* Middle: Info */}
                 <div className="flex-1 space-y-2 mb-8">
                    <h3 className="text-lg font-black text-white leading-tight line-clamp-2">{book.title}</h3>
                    <p className="text-xs font-medium text-slate-400">{book.author}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-3">
                       {book.category && (
                         <span className="px-3 py-1 rounded-full bg-slate-800/80 text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-700">
                           {book.category}
                         </span>
                       )}
                       {book.shelfLocation && (
                         <span className="px-3 py-1 rounded-full bg-slate-800/80 text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-700">
                           Shelf: {book.shelfLocation}
                         </span>
                       )}
                    </div>
                 </div>

                 {/* Bottom: Actions */}
                 <div className="pt-5 border-t border-slate-700/50 flex items-center gap-3">
                    <button 
                      onClick={() => addToWishlist(book._id)}
                      className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all flex-shrink-0"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    
                    <button className="flex-1 h-12 rounded-xl bg-slate-800 border border-slate-700 text-xs font-black text-white hover:bg-slate-700 transition-all uppercase tracking-widest">
                      Details
                    </button>

                    <button 
                      onClick={() => handleHoldRequest(book._id)}
                      className="flex-1 h-12 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      {isAvailable ? 'Borrow' : 'Request'}
                    </button>
                 </div>
              </div>
            );
          })}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center space-y-4 opacity-40">
               <Info className="w-12 h-12 text-slate-500 mx-auto" />
               <p className="text-xs font-black text-white uppercase tracking-widest">No books match your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogSearch;
