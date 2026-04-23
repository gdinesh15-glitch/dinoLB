import React, { useState, useEffect } from 'react';
import { DB, genId, addActivity } from '../../utils/db';
import { Plus, X, Trash2, Search, BookOpen, Download, ExternalLink, Activity, Layers, Database } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

import bookService from '../../api/services/bookService';

const CatalogManager = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isbnLoading, setIsbnLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const res = await bookService.getAllBooks();
    if (res.success) setBooks(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleIsbnFetch = async () => {
    const isbn = formData.isbn;
    if (!isbn) { alert('Enter an ISBN first'); return; }
    setIsbnLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const data = await res.json();
      const key = `ISBN:${isbn}`;
      if (data[key]) {
        const bk = data[key];
        setFormData(prev => ({ 
          ...prev, 
          title: bk.title || prev.title, 
          author: bk.authors?.[0]?.name || prev.author, 
          publisher: bk.publishers?.[0]?.name || prev.publisher, 
          year: bk.publish_date ? parseInt(bk.publish_date) || new Date().getFullYear() : prev.year, 
          cover_image_url: bk.cover?.medium || '' 
        }));
        alert('✅ Book metadata fetched from ISBN!');
      } else { alert('ISBN not found.'); }
    } catch { alert('Failed to fetch ISBN data.'); }
    setIsbnLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      assetId: fd.get('id'),
      title: fd.get('title'),
      author: fd.get('author'),
      category: fd.get('category'),
      isbn: fd.get('isbn'),
      publisher: fd.get('publisher'),
      totalCopies: parseInt(fd.get('qty') || '1'),
      availableCopies: parseInt(fd.get('qty') || '1'),
      shelfLocation: fd.get('shelf') || 'TBD',
      edition: fd.get('edition') || '1st Edition',
      subject: fd.get('subject') || ''
    };

    const res = await bookService.addBook(payload);
    if (res.success) {
      alert(`✅ "${payload.title}" added to catalog!`);
      fetchBooks();
      setShowForm(false);
      setFormData({});
    } else {
      alert(res.error || 'Failed to add book');
    }
  };

  const deleteBook = async (b) => {
    if (!window.confirm(`Remove "${b.title}" from catalog?`)) return;
    const res = await bookService.deleteBook(b._id);
    if (res.success) fetchBooks();
    else alert(res.error || 'Delete failed');
  };

  const filtered = books.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in opacity-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Inventory Control</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Full-lifecycle management of institutional assets</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => { setShowForm(!showForm); setFormData({}); }}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel Entry' : 'Index New Asset'}
        </Button>
      </div>

      {/* ISBN & Form */}
      {showForm && (
        <Card className="border-t-4 border-t-indigo-500 shadow-2xl">
          <div className="mb-10 text-center border-b border-[var(--border-color)] pb-10">
             <h3 className="text-xl font-bold uppercase tracking-tight text-[var(--text-primary)] mb-6 flex items-center justify-center gap-3">
                <Database className="h-6 w-6 text-indigo-500" /> Catalog Indexing Protocol
             </h3>
             <div className="max-w-md mx-auto flex gap-2">
                <Input 
                  placeholder="Enter ISBN (e.g. 978...)" 
                  value={formData.isbn || ''} 
                  onChange={e => setFormData(p => ({ ...p, isbn: e.target.value }))}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleIsbnFetch} disabled={isbnLoading}>
                  {isbnLoading ? 'Syncing...' : 'Fetch Metadata'}
                </Button>
             </div>
          </div>

          <form key={formData.title || 'new'} onSubmit={handleAdd} className="space-y-8">
            <input type="hidden" name="isbn" value={formData.isbn || ''} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Input label="Registry ID" name="id" placeholder="BK-2026-###" />
              <Input label="Title Specification" name="title" required defaultValue={formData.title || ''} />
              <Input label="Author/Creator" name="author" required defaultValue={formData.author || ''} />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Asset Category</label>
                <select className="pro-input bg-transparent" name="category" required>
                  {['Java','Python','AI/ML','Data Structures','Web Development','Architecture','Mathematics','C','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <Input label="Genre Tag" name="genre" defaultValue={formData.genre || ''} />
              <Input label="Publisher House" name="publisher" defaultValue={formData.publisher || ''} />
              <Input label="Chronological Node (Year)" name="year" type="number" defaultValue={formData.year || new Date().getFullYear()} />
              <Input label="Volume Quantity" name="qty" type="number" defaultValue="1" min="1" />
              <Input label="Physical Coordinates (Shelf)" name="shelf" placeholder="e.g. B-12" />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Asset Modality</label>
                <select className="pro-input bg-transparent" name="is_digital">
                  <option value="false">Physical Index</option>
                  <option value="true">Digital / E-Resource</option>
                </select>
              </div>
              
              <Input label="Digital Endpoint (URL)" name="digital_url" placeholder="https://cdn.vemu.edu/assets/..." className="lg:col-span-2" />
            </div>

            <div className="flex justify-end space-x-4 pt-10 border-t border-[var(--border-color)]">
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setFormData({}); }}>Abort</Button>
              <Button type="submit" className="px-12">Commit to Repository</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Search & Grid */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="w-full md:w-96">
          <Input 
            icon={Search} 
            placeholder="Search Registry by Title, Author, or ISBN..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
           Tracking {filtered.length} Unique Titles
        </div>
      </div>

      <Card className="p-0 border-none overflow-visible shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Title</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Creator</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Domain</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Modality</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Vol.</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avail.</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(b => (
                <tr key={b._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-5 px-8">
                     <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                        {b.assetId}
                     </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[var(--text-primary)] leading-tight group-hover:text-indigo-600 transition-colors">{b.title}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">ISBN: {b.isbn || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 font-bold text-xs text-[var(--text-secondary)]">{b.author}</td>
                  <td className="py-5 px-8">
                    <Badge type="primary" className="text-[9px] lowercase italic">{b.category}</Badge>
                  </td>
                  <td className="py-5 px-8 font-bold text-xs text-[var(--text-secondary)]">{b.shelfLocation}</td>
                  <td className="py-5 px-8 font-black text-xs">{b.totalCopies}</td>
                  <td className="py-5 px-8">
                     <span className={`text-[10px] font-black ${b.availableCopies > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {b.availableCopies}
                     </span>
                  </td>
                  <td className="py-5 px-8">
                    <button onClick={() => deleteBook(b)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-950/30 dark:hover:bg-rose-600 shadow-sm">
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CatalogManager;
