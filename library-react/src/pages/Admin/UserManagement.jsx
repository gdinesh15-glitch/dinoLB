import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Pencil, Trash2, X, Check, Users, Shield, GraduationCap, Library } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';
import userService from '../../api/services/userService';

const UserManagement = ({ defaultRole }) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(!!defaultRole);
  const [formRole, setFormRole] = useState(defaultRole || 'student');
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await userService.getAllUsers();
    if (res.success) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { if (defaultRole) { setFormRole(defaultRole); setShowForm(true); } }, [defaultRole]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const userId = fd.get('id');
    const name = fd.get('name');
    
    // Capitalize role correctly: student -> Student
    const formattedRole = formRole.charAt(0).toUpperCase() + formRole.slice(1).toLowerCase();
    
    const userData = {
      userId,
      name,
      email: fd.get('email'),
      role: formattedRole,
      department: fd.get('dept'),
      phone: fd.get('phone')
    };

    if (fd.get('password')) {
      userData.password = fd.get('password');
    } else if (!editUser) {
      userData.password = 'default123';
    }

    if (formRole.toLowerCase() === 'student') {
      userData.year = fd.get('year');
    }
    
    let res;
    if (editUser) {
      res = await userService.updateUser(editUser._id || editUser.id, userData);
    } else {
      res = await userService.addUser(userData);
    }

    if (res.success) {
      alert(`User "${name}" ${editUser ? 'updated' : 'initialized'}!`);
      fetchUsers();
      setShowForm(false);
      setEditUser(null);
      e.target.reset();
    } else {
      alert(res.error);
    }
  };

  const deleteUser = async (u) => {
    if (u.role.toLowerCase() === 'admin') { alert('Security Protocol: Cannot purge admin accounts.'); return; }
    if (!window.confirm(`Are you sure you want to PERMANENTLY remove "${u.name}"?`)) return;
    
    const res = await userService.deleteUser(u._id || u.id);
    if (res.success) {
      alert(`User "${u.name}" removed successfully.`);
      fetchUsers();
    } else {
      alert(res.error || 'Failed to delete user.');
    }
  };

  const toggleStatus = async (u) => {
    const res = await userService.toggleUserStatus(u.id);
    if (res.success) {
      fetchUsers();
    } else {
      alert(res.error || 'Identity state modification failed.');
    }
  };

  const startEdit = (u) => {
    setEditUser(u);
    setFormRole(u.role);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = users.filter(u => {
    if (u.role === 'admin') return false;
    if (filter !== 'all' && u.role !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleIcons = {
    librarian: Library,
    faculty: GraduationCap,
    student: Users
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Identity Management</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Directory of all authorized institutional personnel</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => { setShowForm(!showForm); setEditUser(null); }}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          {showForm ? 'Discard Action' : 'Register New Identity'}
        </Button>
      </div>

      {/* Registration Form */}
      {showForm && (
        <Card className="border-t-4 border-t-[var(--accent-base)] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-[var(--border-color)] pb-8">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-base)] shadow-inner">
                {editUser ? <Pencil className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">
                  {editUser ? `Modifying Record: ${editUser.id}` : 'Create Identity Record'}
                </h3>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Ensuring data integrity in central repository</p>
              </div>
            </div>

            <div className="flex p-1 w-fit bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
              {['student', 'faculty', 'librarian'].map(r => (
                <button 
                  key={r} 
                  type="button"
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formRole === r ? 'bg-[var(--accent-base)] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  onClick={() => setFormRole(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form key={editUser ? editUser.id : 'new'} onSubmit={handleAddUser} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Input label="Registry ID" name="id" required defaultValue={editUser?.id || ''} readOnly={!!editUser} placeholder="e.g. STU-001" className={editUser ? "opacity-50" : ""} />
              <Input label="Full Name" name="name" required defaultValue={editUser?.name || ''} placeholder="John Alexander Doe" />
              <Input label="Institutional Email" name="email" type="email" required defaultValue={editUser?.email || ''} placeholder="j.doe@vemu.edu" />
              <Input label="Phone Contact" name="phone" defaultValue={editUser?.phone || ''} placeholder="+91 98765 43210" />
              <Input label="Department" name="dept" required defaultValue={editUser?.dept || ''} placeholder="e.g. Computer Science" />
              
              {formRole === 'student' && (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Academic Horizon</label>
                  <select name="year" defaultValue={editUser?.year || '1st Year'} className="pro-input bg-transparent">
                    <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                  </select>
                </div>
              )}
              
              <Input 
                label={editUser ? "Update Access Key" : "Assign Access Key"}
                name="password" 
                type="password" 
                required={!editUser} 
                placeholder={editUser ? "••••••••" : "Default: default123"} 
              />
            </div>

            <div className="flex justify-end space-x-4 pt-8 border-t border-[var(--border-color)]">
              <Button variant="ghost" type="button" onClick={() => { setShowForm(false); setEditUser(null); }}>Abort Registration</Button>
              <Button type="submit" className="px-10">
                {editUser ? <Check className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {editUser ? 'Commit Changes' : 'Initialize Identity'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Directory Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-2 flex-wrap">
          {['all', 'librarian', 'faculty', 'student'].map(f => (
            <button 
              key={f} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-indigo-500/50'
              }`} 
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Entire Directory' : `${f}s`}
            </button>
          ))}
        </div>
        <div className="w-full md:w-80">
          <Input 
            icon={Search} 
            placeholder="Search by Name or ID..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Identity Grid / Table */}
      <Card className="p-0 border-none overflow-visible shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Name</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Designation</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Node</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current State</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(u => {
                const RoleIcon = roleIcons[u.role] || Shield;
                return (
                  <tr key={u.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-5 px-8">
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                        {u.id}
                      </span>
                    </td>
                    <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)]">{u.name}</td>
                    <td className="py-5 px-8">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-600 transition-colors">
                          <RoleIcon className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">{u.role}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">{u.email}</span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{u.dept}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <button 
                        onClick={() => toggleStatus(u)} 
                        className={`group/btn flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${
                          u.status === 'Active' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30 dark:text-rose-400'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{u.status}</span>
                      </button>
                    </td>
                    <td className="py-5 px-8">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(u)} className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all dark:bg-indigo-900/20 dark:hover:bg-indigo-600"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteUser(u)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-900/20 dark:hover:bg-rose-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Users className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Identity Not Found</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Check your query or create a new registry entry</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
