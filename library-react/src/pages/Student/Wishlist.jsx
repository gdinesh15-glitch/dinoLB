import React, { useState, useEffect } from 'react';
import { DB } from '../../utils/db';
import { Heart, HeartOff, Sparkles, Database, BookOpen } from 'lucide-react';
import { Card, Badge, Button } from '../../components/SharedUI';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [books, setBooks] = useState([]);
  const userId = 'STU001';

  const reload = () => {
    const wishlists = DB.get('wishlists') || {};
    setWishlist(wishlists[userId] || []);
    setBooks(DB.get('books') || []);
  };
  useEffect(reload, []);

  const removeFromWishlist = (bookId) => {
    const wishlists = DB.get('wishlists') || {};
    wishlists[userId] = (wishlists[userId] || []).filter(id => id !== bookId);
    DB.set('wishlists', wishlists);
    reload();
  };

  const wishlistBooks = books.filter(b => wishlist.includes(b.id));

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Personal Wishlist</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Curation of intellectual assets for future study</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-pink-500 bg-pink-50 dark:bg-pink-950/30 px-4 py-2 rounded-xl border border-pink-100 dark:border-pink-900/30">
           <Heart className="w-3 h-3 mr-2" /> Depth: {wishlist.length} Monitored Items
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistBooks.map((b, i) => (
          <Card key={b.id} delay={i + 1} className="group relative overflow-visible flex flex-col p-6 hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
               <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Database className="h-6 w-6" />
               </div>
               <button 
                  onClick={() => removeFromWishlist(b.id)} 
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-950/30 dark:hover:bg-rose-600 shadow-sm border border-rose-100 dark:border-rose-900/30 flex items-center gap-2"
                >
                  <HeartOff className="w-3.5 h-3.5" /> Decommission
                </button>
            </div>
            
            <div className="flex-1 space-y-3 mb-8">
              <h3 className="font-black text-sm text-[var(--text-primary)] uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">{b.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">By {b.author}</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                 <Badge type="primary" className="text-[9px] lowercase italic">{b.category}</Badge>
                 <Badge type={b.available > 0 ? 'available' : 'overdue'}>
                    {b.available > 0 ? `${b.available} UNITS` : 'VOID'}
                 </Badge>
              </div>
            </div>

            <div className="mt-auto p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Sparkles className="w-10 h-10" />
              </div>
              <p className="text-[9px] text-indigo-600 font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                 Intelligence Node
              </p>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                Cross-referencing Domain "{b.category}": Recommended exploration of "{books.find(x => x.category === b.category && x.id !== b.id)?.title.slice(0, 30) || 'associated titles'}..."
              </p>
            </div>
          </Card>
        ))}

        {wishlistBooks.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                <Heart className="h-10 w-10" />
             </div>
             <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Zero References</h4>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Your wishlist telemetry is currently offline. Start monitoring assets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
