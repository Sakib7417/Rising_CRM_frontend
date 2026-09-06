"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoice.service";
import { customerService } from "@/services/customer.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Invoice, Payment } from "@/types";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  UNPAID: "bg-yellow-100 text-yellow-800",
  PARTIALLY_PAID: "bg-orange-100 text-orange-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function InvoicesPage() {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPayment, setShowPayment] = useState<Invoice | null>(null);
  const [form, setForm] = useState<Partial<Invoice>>({ amount: 0, tax: 0, discount: 0, dueDate: "", notes: "" });
  const [paymentForm, setPaymentForm] = useState<Partial<Payment>>({ amount: 0, paymentMethod: "", transactionId: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({ queryKey: ["invoices"], queryFn: () => invoiceService.getInvoices() });
  const { data: customers } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.getCustomers() });

  const create = useMutation({
    mutationFn: invoiceService.createInvoice,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["invoices"] }); setShowInvoice(false); setForm({ amount: 0, tax: 0, discount: 0, dueDate: "", notes: "" }); },
  });

  const addPayment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) => invoiceService.addPayment(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["invoices"] }); setShowPayment(null); setPaymentForm({ amount: 0, paymentMethod: "", transactionId: "", notes: "" }); },
  });

  const paidAmount = (invoice: Invoice) => invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(form);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices & Payments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track invoices and customer payments</p>
          </div>
          <button onClick={() => setShowInvoice(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700">Create Invoice</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : invoices?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No invoices found</td></tr>
              ) : (
                invoices?.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{inv.customer?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(paidAmount(inv))}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[inv.status] || ""}`}>{inv.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(inv.dueDate)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setShowPayment(inv)} className="text-blue-600 hover:underline text-sm">Add Payment</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Invoice</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
                  <select value={form.customerId || ""} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                    <option value="">Select Customer</option>
                    {customers?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                  <input type="number" value={form.amount || 0} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax</label>
                  <input type="number" value={form.tax || 0} onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount</label>
                  <input type="number" value={form.discount || 0} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate ? form.dueDate.split("T")[0] : ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowInvoice(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Payment for {showPayment.invoiceNumber}</h2>
              <form onSubmit={(e) => { e.preventDefault(); addPayment.mutate({ id: showPayment.id, data: paymentForm }); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Amount</label>
                  <input type="number" value={paymentForm.amount || 0} onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <input value={paymentForm.paymentMethod || ""} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })} placeholder="Cash / UPI / Bank" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID</label>
                  <input value={paymentForm.transactionId || ""} onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowPayment(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Payment</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
