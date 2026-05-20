import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Bell, MapPin, AlertCircle, LogOut, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

// Stub Data
const INITIAL_ADDRESSES = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+1 234 567 8900',
    type: 'Home',
    street: '123 Tech Avenue, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    isDefault: true
  },
  {
    id: 2,
    name: 'John Doe',
    phone: '+1 234 567 8900',
    type: 'Work',
    street: '456 Startup Blvd, Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    isDefault: false
  }
];

const Addresses = () => {
  const { user, logout } = useAuthStore();
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', type: 'Home', street: '', city: '', state: '', zip: '', isDefault: false
  });

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => addr.id === editingId ? { ...addr, ...formData } : addr));
      setEditingId(null);
    } else {
      const newAddr = { ...formData, id: Date.now() };
      if (newAddr.isDefault || addresses.length === 0) {
        newAddr.isDefault = true;
        setAddresses([newAddr, ...addresses.map(a => ({ ...a, isDefault: false }))]);
      } else {
        setAddresses([...addresses, newAddr]);
      }
    }
    setIsAdding(false);
    setFormData({ name: '', phone: '', type: 'Home', street: '', city: '', state: '', zip: '', isDefault: false });
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setIsAdding(true);
  };

  return (
    <div className="container-custom py-12 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 sticky top-28">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent to-purple-600 p-[2px] mb-3">
                <div className="w-full h-full rounded-full bg-white dark:bg-dark-card flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-accent">{(user?.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{user?.displayName || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <nav className="space-y-2">
              <Link to="/user/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <User size={18} /> My Dashboard
              </Link>
              <Link to="/user/orders" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <Package size={18} /> Orders
              </Link>
              <Link to="/user/addresses" className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 text-accent font-medium transition-colors">
                <MapPin size={18} /> Saved Addresses
              </Link>
              <Link to="/user/complaints" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <AlertCircle size={18} /> Complaints
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <Heart size={18} /> Wishlist
              </Link>
              <div className="h-px bg-gray-100 dark:bg-dark-border my-2"></div>
              <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 space-y-6">
          <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Addresses</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your delivery addresses</p>
              </div>
              {!isAdding && (
                <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', phone: '', type: 'Home', street: '', city: '', state: '', zip: '', isDefault: false }); }} className="btn btn-primary flex items-center gap-2">
                  <Plus size={18} /> Add New
                </button>
              )}
            </div>

            {isAdding ? (
              <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-dark-bg p-6 rounded-xl border border-gray-200 dark:border-dark-border animate-fade-in">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input required type="text" className="input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input required type="text" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                    <input required type="text" className="input" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                    <input required type="text" className="input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Province</label>
                    <input required type="text" className="input" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP / Postal Code</label>
                    <input required type="text" className="input" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address Type</label>
                    <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {!formData.isDefault && (
                     <div className="md:col-span-2 flex items-center gap-2 mt-2">
                       <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 text-accent rounded focus:ring-accent" />
                       <label htmlFor="isDefault" className="text-sm text-gray-700 dark:text-gray-300">Set as default delivery address</label>
                     </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors font-medium">Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Save Address'}</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`p-5 rounded-xl border-2 transition-all ${addr.isDefault ? 'border-accent bg-accent/5' : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg hover:border-gray-300 dark:hover:border-gray-600'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{addr.type}</span>
                        {addr.isDefault && <span className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded"><CheckCircle size={12} /> Default</span>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(addr)} className="text-gray-400 hover:text-accent transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(addr.id)} className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{addr.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                      {addr.street}<br/>
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">{addr.phone}</p>
                    
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} className="mt-4 text-sm text-accent hover:underline font-medium">Set as default</button>
                    )}
                  </div>
                ))}
                
                {addresses.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-dark-bg rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <MapPin size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                    <p>No saved addresses yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
