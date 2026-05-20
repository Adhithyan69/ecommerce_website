import React, { useState, useEffect } from 'react';
import { Save, Upload, Store, Phone, Mail, MapPin } from 'lucide-react';
import { sellerStoreAPI } from '../services/sellerAPI';
import useSellerStore from '../store/useSellerStore';

const SellerStore = () => {
  const { setStore } = useSellerStore();
  const [form, setForm] = useState({ name: '', logo: '', banner: '', description: '', gst: '', currency: 'INR', phone: '', email: '', address: '', shippingPreference: 'auto', autoForward: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { sellerStoreAPI.getStore().then(s => { setForm(s); setLoading(false); }); }, []);

  const handleSave = async () => {
    setSaving(true);
    const updated = await sellerStoreAPI.updateStore(form);
    setStore(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const FIELDS = [
    { section: 'Store Identity', fields: [
      { label: 'Store Name', key: 'name', placeholder: 'My Awesome Store' },
      { label: 'Store Description', key: 'description', placeholder: 'Tell customers about your store...', textarea: true },
      { label: 'Logo URL', key: 'logo', placeholder: 'https://...' },
      { label: 'Banner URL', key: 'banner', placeholder: 'https://...' },
    ]},
    { section: 'Contact Information', fields: [
      { label: 'Business Phone', key: 'phone', placeholder: '+91 99999 00000', icon: <Phone size={14} /> },
      { label: 'Business Email', key: 'email', placeholder: 'store@example.com', icon: <Mail size={14} /> },
      { label: 'Business Address', key: 'address', placeholder: 'City, State', icon: <MapPin size={14} /> },
    ]},
    { section: 'Business Details', fields: [
      { label: 'GST Number (Optional)', key: 'gst', placeholder: 'GST29ABCDE1234F1Z5' },
      { label: 'Default Currency', key: 'currency', select: ['INR', 'USD', 'EUR'] },
    ]},
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure your store profile and preferences</p>
        </div>
        <button onClick={handleSave} disabled={saving || loading} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
          <Save size={16} /> {saving ? 'Saving...' : saved ? 'Saved! ✓' : 'Save Changes'}
        </button>
      </div>

      {/* Preview */}
      {form.name && (
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-lg font-bold">{form.name.charAt(0)}</div>
          <div>
            <div className="font-bold text-white">{form.name}</div>
            <div className="text-xs text-slate-400">{form.description?.slice(0, 60) || 'Your store description'}</div>
          </div>
          <Store size={20} className="ml-auto text-emerald-400" />
        </div>
      )}

      <div className="space-y-6">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-48 skeleton rounded-2xl" />) :
          FIELDS.map(section => (
            <div key={section.section} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
              <h2 className="font-bold text-white">{section.section}</h2>
              {section.fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  {f.select ? (
                    <select value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all">
                      {f.select.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : f.textarea ? (
                    <textarea value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} rows={3} placeholder={f.placeholder} className="w-full bg-slate-700/60 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 resize-none transition-all" />
                  ) : (
                    <div className="relative">
                      {f.icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{f.icon}</span>}
                      <input value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className={`w-full bg-slate-700/60 border border-slate-600/50 rounded-xl py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all ${f.icon ? 'pl-9 pr-4' : 'px-4'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

        {/* Shipping Preferences */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4">Shipping & Automation</h2>
          <div className="space-y-3">
            {[['auto', 'Auto Forward Orders', 'Automatically forward orders to supplier'], ['manual', 'Manual Approval', 'Review each order before forwarding']].map(([v, label, desc]) => (
              <label key={v} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.shippingPreference === v ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500'}`}>
                <input type="radio" name="pref" value={v} checked={form.shippingPreference === v} onChange={e => set('shippingPreference', e.target.value)} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.shippingPreference === v ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'}`}>
                  {form.shippingPreference === v && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div><div className="text-sm font-medium text-white">{label}</div><div className="text-xs text-slate-400">{desc}</div></div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStore;
