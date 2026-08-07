import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

export default function ProductsAdminPage() {
  const products = [
    { id: 'SKU-01', name: 'Balancing Clay Cleanser', category: 'Cleansers', price: '$34.00', stock: 1240, orders: 489, rating: 4.9 },
    { id: 'SKU-02', name: 'Vitamin C Brightening Drops', category: 'Serums', price: '$58.00', stock: 890, orders: 742, rating: 4.8 },
    { id: 'SKU-03', name: 'Hydra Renew Serum', category: 'Serums', price: '$62.00', stock: 1540, orders: 1120, rating: 4.9 },
    { id: 'SKU-04', name: 'Mineral SPF 50 Shield', category: 'Sunscreen', price: '$42.00', stock: 2100, orders: 980, rating: 4.7 },
    { id: 'SKU-05', name: 'Ceramide Barrier Cream', category: 'Moisturizers', price: '$46.00', stock: 670, orders: 610, rating: 4.9 },
  ];

  return (
    <div className="space-y-8 bg-white dark:bg-[#090D16] min-h-full transition-colors">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-[#111827] p-8 rounded-3xl border border-slate-200 dark:border-[#374151] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-primary uppercase tracking-widest mb-1">
            <Package className="w-4 h-4" />
            <span>CLINICAL INVENTORY</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Formulation Inventory & Sales</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Stock level tracking, order fulfillment metrics, and skincare store catalog controls.</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#374151] p-6 rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-white dark:bg-[#1F2937] border-b border-slate-200 dark:border-[#374151]">
              <tr>
                <th className="p-4 rounded-l-xl">SKU Code</th>
                <th className="p-4">Formulation Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4 rounded-r-xl">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#374151]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-100 dark:hover:bg-[#1F2937]/50 transition-colors">
                  <td className="p-4 font-mono text-xs text-brand-primary font-bold">{p.id}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{p.category}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{p.price}</td>
                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.stock} units</td>
                  <td className="p-4 font-extrabold text-slate-900 dark:text-white">{p.orders} fulfilled</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <TrendingUp className="w-3 h-3" /> High Velocity
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
