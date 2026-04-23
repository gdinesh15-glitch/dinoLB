import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, Heart, Filter, Grid, List as ListIcon, Database, Layers } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';
import bookService from '../../api/services/bookService';
import { useAuth } from '../../context/AuthContext';

const CatalogSearch = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const userId = user?.userId || 'STU001';

  useEffect(() => { 
    const fetchBooks = async () => {
      setLoading(true);
      const res = await bookService.getAllBooks();
      if (res.success) {
        setBooks(res.data);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleHoldRequest = async (bookId) => {
    const book = books.find(b => b.id === bookId || b._id === bookId);
    if (!book) return;
    if (book.available > 0) { alert(`"${book.title}" is available! Visit the circulation desk.`); return; }
    // Reservation logic would go here via transactionService
    alert('Hold request feature is being migrated to backend.');
  };

  const addToWishlist = (bookId) => {
    const wishlists = DB.get('wishlists') || {};
    const mine = wishlists[userId] || [];
    if (mine.includes(bookId)) { alert('Identity Conflict: Already in wishlist!'); return; }
    wishlists[userId] = [...mine, bookId];
    DB.set('wishlists', wishlists);
    alert('❤️ Reference Added to Wishlist!');
  };

  const categories = ['All', ...new Set(books.map(b => b.category))];
  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search);
    return matchesSearch && (filter === 'All' || b.category === filter);
  });

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Resource Discovery</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Cross-domain search across the institutional repository</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
           <Database className="w-3 h-3 mr-2" /> Global Catalog Sync
        </div>
      </div>

      <Card className="p-4 border-none shadow-xl bg-[var(--bg-secondary)] flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <Input 
            icon={Search} 
            placeholder="Search by title, author, or ISBN identifier..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="border-none shadow-none bg-[var(--bg-card)]"
          />
        </div>
        <div className="flex items-center space-x-2 p-1.5 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="bg-transparent text-[10px] font-black uppercase tracking-widest py-1.5 pr-8 border-none focus:ring-0 text-[var(--text-primary)]"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((b, i) => (
          <Card key={b.id} delay={i + 1} className="group relative overflow-visible flex flex-col p-6 hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
               <div className={`p-3 rounded-2xl ${b.is_digital ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'}`}>
                  {b.is_digital ? <Layers className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
               </div>
               <Badge type={b.available > 0 ? 'available' : 'overdue'}>
                  {b.available > 0 ? `${b.available} AVAIL` : 'VOID'}
               </Badge>
            </div>
            
            <div className="flex-1 space-y-3 mb-8">
              <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-tight line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">{b.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">By {b.author}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                 <Badge type="primary" className="text-[9px] lowercase italic">{b.category}</Badge>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] self-center">Loc: {b.shelf}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
              <div className="flex space-x-1">
                <button 
                  onClick={() => addToWishlist(b.id)} 
                  className="p-2.5 rounded-xl bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white transition-all dark:bg-pink-950/20 dark:hover:bg-pink-500 shadow-sm"
                  title="Add to Wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
                {b.available === 0 && (
                  <button 
                    onClick={() => handleHoldRequest(b.id)} 
                    className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all dark:bg-indigo-950/20 dark:hover:bg-indigo-600 shadow-sm"
                    title="Reserve Volume"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button variant="ghost" className="h-auto py-2 text-[9px] font-black tracking-widest uppercase">Details</Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                <Search className="h-10 w-10" />
             </div>
             <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Spectrum Void</h4>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Zero intellectual assets matched your current search parameters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogSearch;
