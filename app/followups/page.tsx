"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followupService } from "@/services/followup.service";
import { leadService } from "@/services/lead.service";
import { formatDate } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Followup } from "@/types";
import { Edit, Trash2 } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  NO_RESPONSE: "bg-gray-100 text-gray-800",
  INTERESTED: "bg-blue-100 text-blue-800",
  CALLBACK: "bg-orange-100 text-orange-800",
  CLOSED: "bg-red-100 text-red-800",
};

export default function FollowupsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"daily" | "missed" | "upcoming" | "all">("all");
  const [form, setForm] = useState<Partial<Followup>>({ leadId: "", followupDate: "", followupType: "PHONE_CALL", remarks: "", nextFollowupDate: "", followupStatus: "PENDING" });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Followup> & { id?: string }>({});
  const queryClient = useQueryClient();

  const { data: followups, isLoading } = useQuery({
    queryKey: ["followups", filter],
    queryFn: () => followupService.getFollowups(filter === "daily" ? { type: "daily" } : filter === "missed" ? { type: "missed" } : filter === "upcoming" ? { type: "upcoming" } : {}),
  });
  const { data: leads } = useQuery({ queryKey: ["leads"], queryFn: () => leadService.getLeads({}) });

  const create = useMutation({
    mutationFn: followupService.createFollowup,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["followups"] }); queryClient.invalidateQueries({ queryKey: ["leads"] }); setIsOpen(false); setForm({ leadId: "", followupDate: "", followupType: "PHONE_CALL", remarks: "", nextFollowupDate: "", followupStatus: "PENDING" }); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Followup> }) => followupService.updateFollowup(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["followups"] }); queryClient.invalidateQueries({ queryKey: ["leads"] }); setEditOpen(false); },
  });

  const remove = useMutation({
    mutationFn: followupService.deleteFollowup,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["followups"] }); queryClient.invalidateQueries({ queryKey: ["leads"] }); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Followup> = {
      ...form,
      nextFollowupDate: form.nextFollowupDate || undefined,
    };
    create.mutate(payload);
  };

  const handleEdit = (f: Followup) => {
    setEditForm({
      id: f.id,
      leadId: f.leadId,
      followupDate: f.followupDate ? f.followupDate.slice(0, 16) : "",
      followupType: f.followupType,
      followupStatus: f.followupStatus,
      remarks: f.remarks || "",
      nextFollowupDate: f.nextFollowupDate ? f.nextFollowupDate.slice(0, 16) : "",
    });
    setEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.id) {
      const { id, ...data } = editForm;
      update.mutate({
        id,
        data: {
          ...data,
          nextFollowupDate: data.nextFollowupDate ? data.nextFollowupDate : null,
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this follow-up?")) {
      remove.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Follow-ups</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and schedule lead follow-ups</p>
          </div>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700">Add Follow-up</button>
        </div>

        <div className="flex space-x-2">
          {(["all", "daily", "missed", "upcoming"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 border text-gray-700 dark:text-gray-300"}`}>{f}</button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Follow-up</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : followups?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No follow-ups found</td></tr>
              ) : (
                followups?.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{f.lead?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(f.followupDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{f.followupType}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[f.followupStatus] || ""}`}>{f.followupStatus}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(f.nextFollowupDate || f.followupDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{f.remarks || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(f)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(f.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </div>
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
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Follow-up</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <select value={form.leadId || ""} onChange={(e) => setForm({ ...form, leadId: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required>
                  <option value="">Select Lead</option>
                  {leads?.data.map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <input type="datetime-local" value={form.followupDate || ""} onChange={(e) => setForm({ ...form, followupDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <select value={form.followupType} onChange={(e) => setForm({ ...form, followupType: e.target.value as Followup["followupType"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="PHONE_CALL">Phone Call</option><option value="WHATSAPP">WhatsApp</option><option value="EMAIL">Email</option><option value="MEETING">Meeting</option><option value="SITE_VISIT">Site Visit</option>
                </select>
                <textarea value={form.remarks || ""} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Remarks" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="datetime-local" value={form.nextFollowupDate || ""} onChange={(e) => setForm({ ...form, nextFollowupDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Follow-up</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white">
                  {leads?.data.find((l: any) => l.id === editForm.leadId)?.name || "Lead"}
                </div>
                <input type="datetime-local" value={editForm.followupDate || ""} onChange={(e) => setEditForm({ ...editForm, followupDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <select value={editForm.followupType} onChange={(e) => setEditForm({ ...editForm, followupType: e.target.value as Followup["followupType"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="PHONE_CALL">Phone Call</option><option value="WHATSAPP">WhatsApp</option><option value="EMAIL">Email</option><option value="MEETING">Meeting</option><option value="SITE_VISIT">Site Visit</option>
                </select>
                <select value={editForm.followupStatus} onChange={(e) => setEditForm({ ...editForm, followupStatus: e.target.value as Followup["followupStatus"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="PENDING">Pending</option><option value="COMPLETED">Completed</option><option value="NO_RESPONSE">No Response</option><option value="INTERESTED">Interested</option><option value="CALLBACK">Callback</option><option value="CLOSED">Closed</option>
                </select>
                <textarea value={editForm.remarks || ""} onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })} placeholder="Remarks" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <input type="datetime-local" value={editForm.nextFollowupDate || ""} onChange={(e) => setEditForm({ ...editForm, nextFollowupDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" disabled={update.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">{update.isPending ? "Saving..." : "Save"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
