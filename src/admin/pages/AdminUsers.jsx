import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Shield, Eye } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import AdminModal from '../components/AdminModal';
import { adminUsersAPI } from '../services/adminAPI';

const ROLES = ['user', 'support', 'marketing', 'admin', 'superadmin'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [changingRole, setChangingRole] = useState(null);

  useEffect(() => { adminUsersAPI.getAll().then(r => { setUsers(r.users); setLoading(false); }); }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBlock = async (user) => {
    setToggling(user.id);
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    await adminUsersAPI.toggleBlock(user.id, newStatus === 'blocked');
    setUsers(us => us.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    setToggling(null);
  };

  const changeRole = async (id, role) => {
    setChangingRole(id);
    await adminUsersAPI.updateRole(id, role);
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
    setChangingRole(null);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[['Total', users.length, 'text-indigo-400'], ['Active', users.filter(u => u.status === 'active').length, 'text-emerald-400'], ['Blocked', users.filter(u => u.status === 'blocked').length, 'text-rose-400']].map(([label, v, cls]) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${cls}`}>{v}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all" />
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/40 border-b border-slate-700/50">
              <tr className="text-slate-400 text-xs">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Orders</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Spent</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {loading ? [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-10 skeleton rounded-lg" /></td></tr>
              )) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{u.phone}</td>
                  <td className="px-4 py-3 text-right text-slate-300 hidden md:table-cell">{u.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold text-white hidden md:table-cell">₹{u.spent?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} disabled={changingRole === u.id} className="bg-slate-700 border border-slate-600/50 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500/50 cursor-pointer disabled:opacity-50">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewUser(u)} className="w-8 h-8 rounded-lg bg-slate-700/60 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-all"><Eye size={13} /></button>
                      <button onClick={() => toggleBlock(u)} disabled={toggling === u.id} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 ${u.status === 'blocked' ? 'bg-emerald-600 text-white' : 'bg-slate-700/60 hover:bg-rose-600 text-slate-400 hover:text-white'}`}>
                        {u.status === 'blocked' ? <UserCheck size={13} /> : <UserX size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal open={!!viewUser} onClose={() => setViewUser(null)} title="User Profile" size="sm">
        {viewUser && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">{viewUser.name.charAt(0)}</div>
              <div>
                <div className="font-bold text-lg text-white">{viewUser.name}</div>
                <div className="text-slate-400">{viewUser.email}</div>
                <StatusBadge status={viewUser.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Phone', viewUser.phone], ['Joined', viewUser.joined], ['Orders', viewUser.orders], ['Total Spent', `₹${viewUser.spent?.toLocaleString('en-IN')}`], ['Role', viewUser.role]].map(([k, v]) => (
                <div key={k} className="bg-slate-700/40 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{k}</p>
                  <p className="font-semibold text-white capitalize">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminUsers;
