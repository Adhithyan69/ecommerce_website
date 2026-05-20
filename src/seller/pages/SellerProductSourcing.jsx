import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Download, CheckCircle, ExternalLink, Tag, Truck } from 'lucide-react';
import { supplierAPI } from '../services/sellerAPI';
import useSellerStore from '../store/useSellerStore';

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Gaming', 'Health', 'Home', 'Office'];
const SUPPLIERS = ['All', 'AliExpress', 'CJ Dropshipping'];

const SellerProductSourcing = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [supplier, setSupplier] = useState('All');
  const [importing, setImporting] = useState(null);
  const [imported, setImported] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addProduct } = useSellerStore();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      supplierAPI.getProducts({ query: search, category, supplier }).then(r => { setProducts(r.products); setLoading(false); });
    }, 300);
    return () => clearTimeout(t);
  }, [search, category, supplier]);

  const handleImport = async (product) => {
    setImporting(product.id);
    const imported_product = await supplierAPI.importProduct(product);
    addProduct(imported_product);
    setImported(s => new Set([...s, product.id]));
    setImporting(null);
  };

  const handleImportAndEdit = async (product) => {
    setImporting(product.id);
    const imported_product = await supplierAPI.importProduct(product);
    addProduct(imported_product);
    navigate('/seller/products/new', { state: { prefill: { ...imported_product, costPrice: product.supplierPrice, sellingPrice: product.suggestedPrice } } });
  };

  const SUPPLIER_COLORS = { 'AliExpress': 'text-orange-400 bg-orange-500/10', 'CJ Dropshipping': 'text-blue-400 bg-blue-500/10' };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Find Products</h1>
          <p className="text-slate-400 text-sm mt-1">Browse supplier catalog and import products to your store</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium">
          <CheckCircle size={14} />
          {imported.size} imported this session
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${category === c ? 'bg-emerald-600 text-white' : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white'}`}>{c}</button>
          ))}
          <select value={supplier} onChange={e => setSupplier(e.target.value)} className="px-3 py-2 rounded-xl text-xs bg-slate-800/60 border border-slate-700/50 text-slate-400 focus:outline-none focus:border-emerald-500/50">
            {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? [...Array(6)].map((_, i) => (
          <div key={i} className="skeleton rounded-2xl h-80" />
        )) : products.map(p => {
          const isImported = imported.has(p.id) || p.imported;
          const margin = (((p.suggestedPrice - p.supplierPrice) / p.suggestedPrice) * 100).toFixed(0);
          return (
            <div key={p.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group flex flex-col">
              {/* Image */}
              <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(p)}>
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${SUPPLIER_COLORS[p.supplier]}`}>{p.supplier}</span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400">{margin}% margin</span>
                </div>
                {isImported && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                    <CheckCircle size={14} className="text-white" />
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <Tag size={10} className="text-slate-500" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">{p.category}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2 leading-snug line-clamp-2 flex-1">{p.name}</h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <Star size={11} fill="currentColor" className="text-yellow-400" />
                  <span className="text-xs text-slate-400">{p.rating} ({p.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <Truck size={11} className="text-slate-500" />
                  <span className="text-[10px] text-slate-500">Ships in {p.shipsIn}</span>
                </div>

                {/* Pricing */}
                <div className="bg-slate-700/40 rounded-xl p-2.5 mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Supplier Cost</span>
                    <span className="font-bold text-rose-400">₹{p.supplierPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Suggested Price</span>
                    <span className="font-bold text-emerald-400">₹{p.suggestedPrice}</span>
                  </div>
                </div>

                {/* Actions */}
                {isImported ? (
                  <div className="flex items-center justify-center gap-2 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold">
                    <CheckCircle size={13} /> Imported
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => handleImport(p)} disabled={importing === p.id} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-all">
                      {importing === p.id ? '...' : '⚡ Import'}
                    </button>
                    <button onClick={() => setSelectedProduct(p)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                      <ExternalLink size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-52 object-cover" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${SUPPLIER_COLORS[selectedProduct.supplier]}`}>{selectedProduct.supplier}</span>
                <span className="text-[10px] text-slate-500 uppercase">{selectedProduct.category}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-3">{selectedProduct.name}</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-700/40 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Supplier Cost</div><div className="font-bold text-rose-400 text-lg">₹{selectedProduct.supplierPrice}</div></div>
                <div className="bg-slate-700/40 rounded-xl p-3"><div className="text-xs text-slate-400 mb-1">Suggested Price</div><div className="font-bold text-emerald-400 text-lg">₹{selectedProduct.suggestedPrice}</div></div>
              </div>
              {selectedProduct.variants?.length > 0 && (
                <div className="mb-4"><p className="text-xs text-slate-400 mb-2">Variants</p><div className="flex gap-2 flex-wrap">{selectedProduct.variants.map(v => <span key={v} className="px-3 py-1 bg-slate-700 text-white text-xs rounded-lg">{v}</span>)}</div></div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setSelectedProduct(null); handleImportAndEdit(selectedProduct); }} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all">
                  Import & Set Price
                </button>
                <button onClick={() => { setSelectedProduct(null); handleImport(selectedProduct); }} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold text-sm transition-all">
                  Quick Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductSourcing;
