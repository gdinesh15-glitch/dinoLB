import React, { useState, useEffect } from 'react';
import { DB, genId, addActivity } from '../../utils/db';
import { 
  Plus, X, Trash2, Search, BookOpen, 
  Layers, Database, Flame
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';
import bookService from '../../api/services/bookService';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const res = await bookService.getAllBooks();
    if (res.success) {
      setBooks(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchBooks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const title = fd.get('title');
    const qty = parseInt(fd.get('qty') || '1');
    
    const newBook = { 
      isbn: fd.get('isbn') || '', 
      title, 
      author: fd.get('author'), 
      category: fd.get('category'), 
      qty, 
      shelf: fd.get('shelf') || 'TBD', 
      year: parseInt(fd.get('year')) || new Date().getFullYear(),
      is_digital: fd.get('type') === 'digital'
    };
    
    const res = await bookService.addBook(newBook);
    if (res.success) {
      alert(`✅ "${title}" registration successful!`);
      fetchBooks();
      setShowForm(false);
    } else {
      alert(res.error);
    }
  };

  const deleteBook = async (b) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete "${b.title}"?`)) return;
    const res = await bookService.deleteBook(b.id);
    if (res.success) {
      alert('Asset removed from registry.');
      fetchBooks();
    }
  };

  const filtered = books.filter(b => 
    !search || 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.id?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(books.map(b => b.category))];

  return (
    <div className="space-y-8 animate-in opacity-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Asset Repository</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Institutional book inventory and metadata</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Abort Entry' : 'Register New Asset'}
        </Button>
      </div>

      {/* Stats Mini Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="flex items-center space-x-4 border-l-4 border-l-indigo-500">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
               <Database className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400">Total Unique Titles</p>
               <h4 className="text-xl font-black">{books.length}</h4>
            </div>
         </Card>
         <Card className="flex items-center space-x-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
               <Layers className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400">Total Asset Volume</p>
               <h4 className="text-xl font-black">{books.reduce((s, b) => s + (b.qty || 0), 0)}</h4>
            </div>
         </Card>
         <Card className="flex items-center space-x-4 border-l-4 border-l-amber-500">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
               <Flame className="w-5 h-5" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase text-slate-400">Most Popular Category</p>
               <h4 className="text-xl font-black">{categories[0] || 'N/A'}</h4>
            </div>
         </Card>
      </div>

      {/* Registration Form */}
      {showForm && (
        <Card className="border-t-4 border-t-indigo-500 shadow-2xl">
          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Input label="Asset Title" name="title" required />
              <Input label="Primary Author" name="author" required />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Classification</label>
                <select className="pro-input bg-transparent" name="category" required>
                  {['Java','Python','AI/ML','Data Structures','Web Development','Mathematics','Operating Systems','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Input label="ISBN Code" name="isbn" />
              <Input label="Release Year" name="year" type="number" defaultValue={new Date().getFullYear()} />
              <Input label="Volume Quantity" name="qty" type="number" defaultValue="1" min="1" />
              <Input label="Shelf Coordinates" name="shelf" placeholder="e.g. A-01" />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Modality</label>
                <select className="pro-input bg-transparent" name="type">
                  <option value="physical">Physical Book</option>
                  <option value="digital">Digital Asset</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-10 border-t border-[var(--border-color)]">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Discard</Button>
              <Button type="submit" className="px-12">Commit Record</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Directory & Search */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="w-full md:w-96">
          <Input 
            icon={Search} 
            placeholder="Filter catalog..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Title Specification</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Classification</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Vol. / Avail.</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(b => (
                <tr key={b.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-8">
                     <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                        {b.id}
                     </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">{b.title}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{b.author}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <Badge type="primary">{b.category}</Badge>
                  </td>
                  <td className="py-5 px-8 font-black text-xs">
                     {b.qty} / <span className={b.available > 0 ? 'text-emerald-500' : 'text-rose-500'}>{b.available}</span>
                  </td>
                  <td className="py-5 px-8">
                    <button onClick={() => deleteBook(b)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-950/30 dark:hover:bg-rose-600">
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

export default Books;
