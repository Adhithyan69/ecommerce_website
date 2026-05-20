import React, { useState, useEffect } from 'react';
import { Shield, Plus, Mail, Check, X } from 'lucide-react';
import AdminModal from '../components/AdminModal';
import { adminRolesAPI } from '../services/adminAPI';

const ALL_PERMISSIONS = [
  { key: 'products', label: 'Products' }, { key: 'categories', label: 'Categories' },
  { key: 'orders', label: 'Orders' }, { key: 'users', label: 'Users' },
  { key: 'complaints', label: 'Support' }, { key: 'coupons', label: 'Coupons' },
  { key: 'banners', label: 'Banners' }, { key: 'reviews', label: 'Reviews' },
  { key: 'analytics:view', label: 'Analytics' }, { key: 'notifications', label: 'Notifications' },
  { key: 'orders:view', label: 'Orders (View)' }, { key: 'users:view', label: 'Users (View)' },
];

const ROLE_COLORS = { superadmin: 'bg-amber-500/15 border-amber-500/30 text-amber-400', admin: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400', support: 'bg-blue-500/15 border-blue-500/30 text-blue-400', marketing: 'bg-purple-500/15 border-purple-500/30 text-purple-400' };

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'admin' });
  const [inviting, setInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminRolesAPI.getAll().then(r => { setRoles(r.roles); setLoading(false); }); }, []);

  const hasPermission = (role, perm) => role.permissions?.includes('all') || role.permissions?.includes(perm);

  const handleInvite = async () => {
    if (!inviteForm.email) return;
    setInviting(true);
    await adminRolesAPI.inviteAdmin(inviteForm.email, inviteForm.role);
    setInviting(false);
    setInviteSent(true);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Roles & Access Control</h1>
          <p className="text-slate-400 text-sm mt-1">Manage admin permissions and invite new admins</p>
        </div>
        <button onClick={() => { setInviteModal(true); setInviteSent(false); }} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">
          <Plus size={16} /> Invite Admin
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />) :
          roles.map(r => (
            <div key={r.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold mb-3 ${ROLE_COLORS[r.slug] || ROLE_COLORS.admin}`}>
                <Shield size={12} /> {r.name}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{r.users}</div>
              <div className="text-xs text-slate-400">{r.users === 1 ? 'member' : 'members'}</div>
            </div>
          ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h2 className="font-bold text-white">Permission Matrix</h2>
          <p className="text-slate-400 text-xs mt-0.5">⚡ = Full admin access to all features</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-5 py-3 text-left text-slate-400 text-xs font-medium">Permission</th>
                {roles.map(r => (
                  <th key={r.id} className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${ROLE_COLORS[r.slug] || ROLE_COLORS.admin}`}>
                      {r.permissions?.includes('all') ? '⚡' : ''} {r.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {ALL_PERMISSIONS.map(perm => (
                <tr key={perm.key} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-3 text-slate-300 text-sm">{perm.label}</td>
                  {roles.map(r => (
                    <td key={r.id} className="px-4 py-3 text-center">
                      {hasPermission(r, perm.key) ? (
                        <Check size={16} className="text-emerald-400 mx-auto" />
                      ) : (
                        <X size={16} className="text-slate-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Admin Modal */}
      <AdminModal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite Admin" size="sm">
        {inviteSent ? (
          <div className="text-center py-6 animate-zoom-in">
            <div className="w-14 h-14 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Invitation Sent!</h3>
            <p className="text-slate-400 text-sm">An invite was sent to <span className="text-white font-semibold">{inviteForm.email}</span></p>
            <button onClick={() => setInviteModal(false)} className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Email Address</label>
              <input type="email" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@company.com" className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Role</label>
              <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all">
                <option value="admin">Admin</option>
                <option value="support">Support Agent</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setInviteModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-all">Cancel</button>
              <button onClick={handleInvite} disabled={inviting || !inviteForm.email} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                <Mail size={14} /> {inviting ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminRoles;
