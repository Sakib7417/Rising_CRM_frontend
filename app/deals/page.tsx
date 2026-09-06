"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealService } from "@/services/deal.service";
import { customerService } from "@/services/customer.service";
import { userService } from "@/services/user.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Deal } from "@/types";

const stageColors: Record<string, string> = {
  NEW: "bg-gray-100 text-gray-800",
  DISCUSSION: "bg-blue-100 text-blue-800",
  PROPOSAL_SENT: "bg-yellow-100 text-yellow-800",
  NEGOTIATION: "bg-orange-100 text-orange-800",
  WON: "bg-green-100 text-green-800",
  LOST: "bg-red-100 text-red-800",
};

export default function DealsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<Partial<Deal>>({ title: "", amount: 0, stage: "NEW", expectedCloseDate: "", assignedToId: "", customerId: "", notes: "" });
  const queryClient = useQueryClient();

  const { data: deals, isLoading } = useQuery({ queryKey: ["deals"], queryFn: () => dealService.getDeals() });
  const { data: customers } = useQuery({ queryKey: ["customers"], queryFn: () => customerService.getCustomers() });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => userService.getUsers() });

  const create = useMutation({
    mutationFn: dealService.createDeal,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["deals"] }); setIsOpen(false); setForm({ title: "", amount: 0, stage: "NEW", expectedCloseDate: "", assignedToId: "", customerId: "", notes: "" }); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Deal> }) => dealService.updateDeal(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["deals"] }); setIsOpen(false); setEditing(null); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) update.mutate({ id: editing.id, data: form });
    else create.mutate(form);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Sales pipeline and opportunities</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ title: "", amount: 0, stage: "NEW", expectedCloseDate: "", assignedToId: "", customerId: "", notes: "" }); setIsOpen(true); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700">Add Deal</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Close</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : deals?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No deals found</td></tr>
              ) : (
                deals?.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{d.title}</p>
                      <p className="text-sm text-gray-500">{d.notes || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{d.customer?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(d.amount)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${stageColors[d.stage] || ""}`}>{d.stage}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{d.assignedTo?.name || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(d.expectedCloseDate)}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { setEditing(d); setForm({ ...d }); setIsOpen(true); }} className="text-blue-600 hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editing ? "Edit Deal" : "Add Deal"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Deal Title" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <select value={form.customerId || ""} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                  <option value="">Select Customer</option>
                  {customers?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="number" value={form.amount || 0} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} placeholder="Amount" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as Deal["stage"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="NEW">New</option><option value="DISCUSSION">Discussion</option><option value="PROPOSAL_SENT">Proposal Sent</option><option value="NEGOTIATION">Negotiation</option><option value="WON">Won</option><option value="LOST">Lost</option>
                </select>
                <select value={form.assignedToId || ""} onChange={(e) => setForm({ ...form, assignedToId: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="">Unassigned</option>
                  {users?.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input type="date" value={form.expectedCloseDate ? form.expectedCloseDate.split("T")[0] : ""} onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <textarea value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editing ? "Update" : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
