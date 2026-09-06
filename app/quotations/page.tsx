"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotationService } from "@/services/quotation.service";
import { customerService } from "@/services/customer.service";
import { productService } from "@/services/product.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Quotation, QuotationLineItem, Customer } from "@/types";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-yellow-100 text-yellow-800",
};

export default function QuotationsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<Partial<QuotationLineItem>[]>([{ description: "", quantity: 1, unitPrice: 0, discount: 0, taxPercent: 0, productId: "" }]);
  const queryClient = useQueryClient();

  const { data: quotations, isLoading } = useQuery({ queryKey: ["quotations"], queryFn: () => quotationService.getQuotations() });
  const { data: customers } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.getCustomers() });
  const { data: products } = useQuery({ queryKey: ["products"], queryFn: () => productService.getProducts(true) });

  const create = useMutation({
    mutationFn: quotationService.createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setIsOpen(false);
      setCustomerId("");
      setItems([{ description: "", quantity: 1, unitPrice: 0, discount: 0, taxPercent: 0, productId: "" }]);
    },
  });

  const send = useMutation({
    mutationFn: quotationService.sendQuotation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quotations"] }),
  });

  const updateItem = (idx: number, field: keyof QuotationLineItem, value: any) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    if (field === "productId" && value) {
      const p = products?.find((prod) => prod.id === value);
      if (p) {
        next[idx].description = p.name;
        next[idx].unitPrice = p.price;
        next[idx].taxPercent = p.taxPercent;
      }
    }
    setItems(next);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0, discount: 0, taxPercent: 0, productId: "" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const computeTotal = (item: Partial<QuotationLineItem>) => {
    const qty = item.quantity || 0;
    const price = item.unitPrice || 0;
    const discount = item.discount || 0;
    const tax = item.taxPercent || 0;
    const base = qty * price - discount;
    return Math.max(0, base + (base * tax) / 100);
  };

  const grandTotal = items.reduce((sum, item) => sum + computeTotal(item), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lineItems = items.filter((i) => i.description && (i.unitPrice || 0) >= 0).map((i) => ({ ...i, productId: i.productId || undefined }));
    create.mutate({ customerId: customerId || undefined, lineItems } as Partial<Quotation>);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quotations</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage customer quotations</p>
          </div>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700">Create Quotation</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotation #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : quotations?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No quotations found</td></tr>
              ) : (
                quotations?.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{q.quotationNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{q.customer?.name || q.lead?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{q.lineItems?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(q.totalAmount)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[q.status] || ""}`}>{q.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(q.createdAt)}</td>
                    <td className="px-6 py-4 space-x-2">
                      {q.status === "DRAFT" && <button onClick={() => send.mutate(q.id)} className="text-blue-600 hover:underline text-sm">Send</button>}
                      {q.pdfUrl && <a href={`${process.env.NEXT_PUBLIC_API_URL || ""}${q.pdfUrl}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline text-sm">PDF</a>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-3xl my-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Quotation</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
                  <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                    <option value="">Select Customer</option>
                    {customers?.map((c: Customer) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-7 gap-2 items-end">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
                        <select value={item.productId || ""} onChange={(e) => updateItem(idx, "productId", e.target.value)} className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm">
                          <option value="">Custom</option>
                          {products?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <input value={item.description || ""} onChange={(e) => updateItem(idx, "description", e.target.value)} className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" required />
                      </div>
                      <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Qty</label><input type="number" value={item.quantity || 1} onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))} className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" /></div>
                      <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label><input type="number" value={item.unitPrice || 0} onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))} className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" /></div>
                      <div><label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tax%</label><input type="number" value={item.taxPercent || 0} onChange={(e) => updateItem(idx, "taxPercent", Number(e.target.value))} className="w-full px-2 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm" /></div>
                      <button type="button" onClick={() => removeItem(idx)} className="text-red-600 text-sm mb-2">Remove</button>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addItem} className="px-4 py-2 border rounded-lg text-sm">+ Add Item</button>
                <div className="text-right font-bold text-gray-900 dark:text-white">Grand Total: {formatCurrency(grandTotal)}</div>

                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create Quotation</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
