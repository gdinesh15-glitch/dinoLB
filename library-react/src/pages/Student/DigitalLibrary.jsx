import React, { useState, useEffect } from 'react';
import { DB } from '../../utils/db';
import { Search, ExternalLink, Download, Smartphone, Globe, Layers, BookOpen, Database } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const DigitalLibrary = () => {
  const [digitalItems, setDigitalItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const allBooks = DB.get('books') || [];
    setDigitalItems(allBooks.filter(b => b.is_digital));
  }, []);

  const filtered = digitalItems.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Digital Repository</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">On-demand access to virtual volumes & archives</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
           <Globe className="w-3 h-3 mr-2" /> Content Delivery Network: Active
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="w-full md:w-96">
          <Input 
            icon={Search} 
            placeholder="Search Virtual Archives..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
           Indexing {filtered.length} Digital Assets
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b, i) => (
          <Card key={b.id} delay={i + 1} className="group relative overflow-hidden flex flex-col p-8 border-t-4 border-t-indigo-500 hover:-translate-y-2 transition-all duration-300">
            <div className="mb-8">
               <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                     <Layers className="h-6 w-6" />
                  </div>
                  <Badge type="available">E-RESOURCE</Badge>
               </div>
               
               <h3 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {b.title}
               </h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Node Creator: {b.author}</p>
               <Badge type="primary" className="text-[9px] lowercase italic">{b.category}</Badge>
            </div>
            
            <div className="mt-auto pt-8 border-t border-[var(--border-color)] flex gap-2">
              <Button 
                onClick={() => window.open(b.digital_asset_url, '_blank')} 
                variant="primary"
                className="flex-1 py-1.5 h-auto text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-2" /> Launch 
              </Button>
              <Button 
                onClick={() => alert('Cipher established: Resource download initiated...')} 
                variant="secondary"
                className="px-3"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                <Smartphone className="h-10 w-10" />
             </div>
             <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Archive Void</h4>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Zero digitized assets matched your current access query</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-slate-900 border-none p-10 relative overflow-hidden text-indigo-400 shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <Database className="w-40 h-40" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10 text-white">Hybrid Library Architecture</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10 mb-8">
            Digital resources represent the high-availability layer of our repository. These assets are optimized for remote synchronous access across multi-platform endpoints.
          </p>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 relative z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Asset decryption: NOMINAL</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DigitalLibrary;
