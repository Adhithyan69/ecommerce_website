import React, { useState } from 'react';
import { MessageSquare, HelpCircle, Phone, Search, FileText, Send, Paperclip, ChevronDown, ChevronRight, Package, RefreshCw, ShieldCheck, CreditCard } from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'shipping', label: 'Shipping & Delivery', icon: <Package size={18} /> },
  { id: 'returns', label: 'Returns & Refunds', icon: <RefreshCw size={18} /> },
  { id: 'account', label: 'Account & Security', icon: <ShieldCheck size={18} /> },
  { id: 'payment', label: 'Payments & Billing', icon: <CreditCard size={18} /> },
];

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Hi there! I am your Anti-Gravity virtual assistant. How can I help you today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setChatMessages([...chatMessages, { role: 'user', text: inputMsg }]);
    setInputMsg('');

    // Simulate bot thinking and reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Thanks for reaching out! A support agent will review your message shortly. Please check your Inbox later for a response.' }]);
    }, 1000);
  };

  return (
    <div className="container-custom py-12 pb-24">
      {/* Hero Header */}
      <div className="bg-accent rounded-3xl p-10 lg:p-16 text-white text-center mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">Search our knowledge base, browse FAQs, or chat with our automated support assistant to resolve your dropshipping queries fast.</p>

          <div className="max-w-xl mx-auto relative group">
            <input
              type="text"
              placeholder="E.g., Track my order, Return policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-full bg-white text-gray-900 border-none shadow-xl focus:ring-4 focus:ring-white/20 transition-shadow outline-none text-lg placeholder-gray-400"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-accent" size={24} />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Knowledge Base & FAQs */}
        <div className="w-full lg:w-3/5 space-y-10">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {FAQ_CATEGORIES.map(cat => (
                <button key={cat.id} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-accent hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-dark-bg text-accent flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Popular Articles</h2>
            <div className="space-y-4">
              {['How long does dropship delivery take?', 'What happens if my item arrives damaged?', 'How do I cancel an order before it ships?', 'Why is tracking information not updating?'].map((q, i) => (
                <div key={i} className="group border border-gray-200 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card hover:border-accent transition-colors">
                  <button className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-900 dark:text-white">
                    <span className="flex items-center gap-3"><FileText size={18} className="text-gray-400 group-hover:text-accent transition-colors" /> {q}</span>
                    <ChevronRight size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Chat Stub */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] sticky top-28">
            <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <HelpCircle size={20} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-900 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold">Support Assistant</h3>
                  <p className="text-xs text-white/70">Typically replies right away</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50 dark:bg-dark-bg flex flex-col pt-8">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shrink-0 mr-2 mt-1 shadow-sm">
                      <MessageSquare size={14} />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-tr-sm' : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 shadow-sm rounded-tl-sm'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors shadow-md"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
