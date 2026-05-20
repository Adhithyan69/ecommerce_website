import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Download, Printer } from 'lucide-react';

const MOCK_INVOICE = {
  id: 'INV-2026-08832',
  date: 'March 15, 2026',
  orderId: 'AG-8832',
  status: 'Paid',
  company: {
    name: 'NextGen Dropship Ltd',
    address: '456 Business Park, CA 90210',
    gstin: '29ABCDE1234F1Z5',
    email: 'billing@nextgen.com'
  },
  customer: {
    name: 'John Doe',
    address: '123 Tech Avenue, Apt 4B, San Francisco, CA 94105',
    phone: '+1 234 567 8900'
  },
  items: [
    { name: 'Sony WH-1000XM5 Wireless Headphones', hsn: '85183000', qty: 1, rate: 84.74, gstRate: 18 },
    { name: 'Smart LED Light Strip 32.8ft', hsn: '85395000', qty: 1, rate: 21.19, gstRate: 18 }
  ]
};

const Invoice = () => {
  const { orderId } = useParams();
  
  // Calculate totals
  const subtotal = MOCK_INVOICE.items.reduce((acc, item) => acc + (item.rate * item.qty), 0);
  const gstTotal = MOCK_INVOICE.items.reduce((acc, item) => acc + (item.rate * item.qty * item.gstRate / 100), 0);
  const shipping = 10.00;
  const grandTotal = subtotal + gstTotal + shipping;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-custom py-12 pb-24 bg-gray-50 dark:bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Actions Header - Hidden on Print */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-8 print:hidden">
          <Link to={`/user/orders/${orderId}`} className="text-sm text-gray-500 hover:text-accent flex items-center gap-1 self-start">
            <ChevronLeft size={16} /> Back to Order
          </Link>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="btn bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
              <Printer size={18} /> Print
            </button>
            <button onClick={handlePrint} className="btn btn-primary flex items-center gap-2 shadow-sm">
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Page Container */}
        <div id="invoice-content" className="bg-white dark:bg-dark-card rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-dark-border print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-dark-border pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-accent tracking-tighter mb-1">NextGen</h1>
              <p className="text-gray-500 text-sm">{MOCK_INVOICE.company.name}</p>
              <p className="text-gray-500 text-sm mt-1">GSTIN: <span className="font-semibold">{MOCK_INVOICE.company.gstin}</span></p>
            </div>
            <div className="mt-6 md:mt-0 text-left md:text-right">
              <h2 className="text-4xl font-light text-gray-200 dark:text-gray-800 uppercase tracking-widest mb-2">Invoice</h2>
              <p className="text-gray-900 dark:text-white font-bold">{MOCK_INVOICE.id}</p>
              <p className="text-sm text-gray-500 mt-1">Date: {MOCK_INVOICE.date}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Billed To</p>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{MOCK_INVOICE.customer.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 whitespace-pre-line leading-relaxed">{MOCK_INVOICE.customer.address}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{MOCK_INVOICE.customer.phone}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Order Details</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID: <span className="font-semibold text-gray-900 dark:text-white">{MOCK_INVOICE.orderId}</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Status: <span className="font-bold text-emerald-600">{MOCK_INVOICE.status}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-dark-border">
                  <th className="py-4 text-xs uppercase tracking-wider text-gray-500 font-bold w-1/2">Item Description</th>
                  <th className="py-4 text-xs uppercase tracking-wider text-gray-500 font-bold text-center">HSN</th>
                  <th className="py-4 text-xs uppercase tracking-wider text-gray-500 font-bold text-center">Qty</th>
                  <th className="py-4 text-xs uppercase tracking-wider text-gray-500 font-bold text-right">Rate</th>
                  <th className="py-4 text-xs uppercase tracking-wider text-gray-500 font-bold text-right">GST %</th>
                  <th className="py-4 text-xs uppercase tracking-wider text-gray-500 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {MOCK_INVOICE.items.map((item, index) => {
                  const amount = item.rate * item.qty;
                  return (
                    <tr key={index}>
                      <td className="py-5">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                      </td>
                      <td className="py-5 text-center text-sm text-gray-600 dark:text-gray-400">{item.hsn}</td>
                      <td className="py-5 text-center text-sm text-gray-600 dark:text-gray-400">{item.qty}</td>
                      <td className="py-5 text-right text-sm text-gray-600 dark:text-gray-400">${item.rate.toFixed(2)}</td>
                      <td className="py-5 text-right text-sm text-gray-600 dark:text-gray-400">{item.gstRate}%</td>
                      <td className="py-5 text-right text-sm font-semibold text-gray-900 dark:text-white">${amount.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex flex-col md:flex-row justify-between items-start pt-8 border-t border-gray-100 dark:border-dark-border">
            <div className="w-full md:w-1/2 mb-6 md:mb-0 pr-8">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3">Terms & Conditions</p>
              <p className="text-xs text-gray-500 leading-relaxed text-justify">
                Goods once sold cannot be returned without a valid return request. This is a computer-generated invoice and does not require a physical signature. Returns are accepted within 30 days of delivery subject to our standard return policy.
              </p>
            </div>
            
            <div className="w-full md:w-1/3 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Taxable Amount</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Total GST</span>
                <span>${gstTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping Charges</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-dark-border flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Grand Total</span>
                <span className="text-2xl font-bold text-accent">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Invoice;
