import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Download, Smartphone, Layers, BookOpen, FileText, BookmarkPlus, Filter, Library, FileUp, MonitorPlay } from 'lucide-react';

const DigitalLibrary = () => {
  const [digitalItems, setDigitalItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Demo data for the e-learning portal
    setDigitalItems([
      { id: '1', title: 'Data Structures and Algorithms', author: 'Dr. John Smith', category: 'Programming', type: 'PDF', desc: 'Comprehensive guide to core algorithms and data structures.' },
      { id: '2', title: 'Advanced Quantum Mechanics', author: 'Prof. Alice Green', category: 'Science', type: 'eBook', desc: 'Detailed exploration of quantum phenomena and wave mechanics.' },
      { id: '3', title: 'Machine Learning Engineering', author: 'David Chen', category: 'Programming', type: 'eBook', desc: 'Practical implementations of ML models using Python.' },
      { id: '4', title: 'IEEE Research Journal 2023', author: 'VEMU Institute', category: 'Journals', type: 'PDF', desc: 'Annual collection of published technical papers.' },
      { id: '5', title: 'Operating Systems Lecture Notes', author: 'CS Department', category: 'Notes', type: 'PDF', desc: 'Module 1 to 5 consolidated lecture notes.' },
    ]);
  }, []);

  const filtered = digitalItems.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === 'All' || b.category === filter);
  });

  const cardStyle = { 
    background: 'rgba(255,255,255,0.05)', 
    border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '18px',
    backdropFilter: 'blur(20px)' 
  };

  const statCards = [
    { label: 'Total Resources', count: digitalItems.length, icon: Library, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'PDFs', count: digitalItems.filter(d => d.type === 'PDF').length, icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { label: 'eBooks', count: digitalItems.filter(d => d.type === 'eBook').length, icon: MonitorPlay, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Recently Added', count: '12', icon: FileUp, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Digital Library</h1>
          <p className="text-xs font-medium text-slate-500">Access eBooks, PDFs and online learning materials</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} style={cardStyle} className="p-5 flex items-center space-x-4">
             <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-xl font-black text-white tracking-tight">{stat.count}</h4>
             </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div style={cardStyle} className="p-4 flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              className="w-full bg-transparent border-none h-14 pl-14 pr-4 text-white font-bold outline-none placeholder:text-slate-600"
              placeholder="Search learning materials..."
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
              {['All', 'Programming', 'Science', 'Journals', 'Notes'].map(c => (
                <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
              ))}
            </select>
         </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((resource) => (
          <div key={resource.id} style={cardStyle} className="p-6 flex flex-col group hover:-translate-y-2 transition-transform duration-300">
             
             {/* Top Row: Icon & File Type */}
             <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${resource.type === 'PDF' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                   {resource.type === 'PDF' ? <FileText className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${resource.type === 'PDF' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  {resource.type}
                </span>
             </div>
             
             {/* Middle: Info */}
             <div className="flex-1 mb-6">
                <h3 className="text-lg font-black text-white leading-tight line-clamp-2 mb-1">{resource.title}</h3>
                <p className="text-xs font-medium text-slate-400 mb-3">{resource.author}</p>
                <span className="inline-block px-2 py-1 rounded bg-slate-800/80 text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-700 mb-3">
                  {resource.category}
                </span>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{resource.desc}</p>
             </div>

             {/* Bottom: Actions */}
             <div className="pt-5 border-t border-slate-700/50 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => alert(`Opening ${resource.title}...`)}
                  className="flex-1 h-12 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Open
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => alert('Downloading file...')}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-700 transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => alert('Saved to library!')}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/30 hover:bg-sky-500/10 transition-all"
                    title="Save"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </button>
                </div>
             </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div className="col-span-full py-24 text-center space-y-4 opacity-40">
             <Smartphone className="w-12 h-12 text-slate-500 mx-auto" />
             <p className="text-xs font-black text-white uppercase tracking-widest">No digital resources found</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div style={cardStyle} className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Layers className="w-32 h-32 text-indigo-400" />
        </div>
        <h4 className="text-xl font-black uppercase tracking-tight mb-3 text-white relative z-10">Learning Resources Info</h4>
        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl relative z-10">
          Our online learning portal provides instant access to digitized course materials, technical journals, and specialized eBooks. These files are optimized for fast downloading and seamless remote reading on both mobile and desktop devices.
        </p>
      </div>

    </div>
  );
};

export default DigitalLibrary;
