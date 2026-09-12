"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { followupService } from "@/services/followup.service";
import { leadService } from "@/services/lead.service";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Plus, X, Trash2 } from "lucide-react";
import type { Followup, Lead } from "@/types";

type Tab = "all" | "daily" | "missed" | "upcoming";

const followupTypes = [
  { value: "PHONE_CALL", label: "Phone Call" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "MEETING", label: "Meeting" },
  { value: "SITE_VISIT", label: "Site Visit" },
];

const followupStatuses = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NO_RESPONSE", label: "No Response" },
  { value: "INTERESTED", label: "Interested" },
  { value: "CALLBACK", label: "Callback" },
  { value: "CLOSED", label: "Closed" },
];

const followupOutcomes = [
  { value: "INTERESTED", label: "Interested" },
  { value: "NOT_INTERESTED", label: "Not Interested" },
  { value: "BUSY", label: "Busy" },
  { value: "CALL_LATER", label: "Call Later" },
  { value: "NO_ANSWER", label: "No Answer" },
  { value: "QUOTATION_SENT", label: "Quotation Sent" },
  { value: "DEMO_SCHEDULED", label: "Demo Scheduled" },
];

function toDateTimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function FollowupsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    leadId: "",
    followupDate: "",
    followupType: "PHONE_CALL",
    contactPerson: "",
    remarks: "",
    nextFollowupDate: "",
    outcome: "",
    followupStatus: "PENDING",
  });

  const queryClient = useQueryClient();

  const { data: followups, isLoading } = useQuery({
    queryKey: ["followups", tab],
    queryFn: () => followupService.getFollowups({ type: tab }),
  });

  const { data: leads } = useQuery({
    queryKey: ["leads-select"],
    queryFn: () => leadService.getLeads({ pageSize: 100 }),
  });

  const create = useMutation({
    mutationFn: followupService.createFollowup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups"] });
      setShowModal(false);
      setForm({
        leadId: "",
        followupDate: "",
        followupType: "PHONE_CALL",
        contactPerson: "",
        remarks: "",
        nextFollowupDate: "",
        outcome: "",
        followupStatus: "PENDING",
      });
    },
  });

  const remove = useMutation({
    mutationFn: followupService.deleteFollowup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["followups"] }),
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "daily", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "missed", label: "Missed" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.leadId || !form.followupDate) return;
    create.mutate({
      leadId: form.leadId,
      followupDate: new Date(form.followupDate).toISOString(),
      followupType: form.followupType as any,
      contactPerson: form.contactPerson || undefined,
      remarks: form.remarks,
      nextFollowupDate: form.nextFollowupDate ? new Date(form.nextFollowupDate).toISOString() : undefined,
      outcome: (form.outcome as any) || undefined,
      followupStatus: (form.followupStatus as any) || undefined,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Followups</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track every follow-up: kisse baat hui, kya baat hui, aur next date kya di.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Followup</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                tab === t.key
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            Total: {followups?.length ?? 0} follow-ups
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Person</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Next Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Outcome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remarks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : followups?.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                      No followups found
                    </td>
                  </tr>
                ) : (
                  followups?.map((f: Followup) => (
                    <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{f.lead?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{f.contactPerson || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{f.followupType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDateTime(f.followupDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{f.nextFollowupDate ? formatDateTime(f.nextFollowupDate) : "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{f.outcome || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          f.followupStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : f.followupStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {f.followupStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">{f.remarks || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{f.createdBy?.name || "-"}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => {
                            if (confirm("Delete this followup?")) remove.mutate(f.id);
                          }}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Followup</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead *</label>
                  <select
                    required
                    value={form.leadId}
                    onChange={(e) => setForm({ ...form, leadId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select lead</option>
                    {leads?.data.map((lead: Lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name} {lead.companyName ? `(${lead.companyName})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Kisse baat hui?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Followup Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.followupDate}
                    onChange={(e) => setForm({ ...form, followupDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Followup Date</label>
                  <input
                    type="datetime-local"
                    value={form.nextFollowupDate}
                    onChange={(e) => setForm({ ...form, nextFollowupDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <select
                    value={form.followupType}
                    onChange={(e) => setForm({ ...form, followupType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {followupTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={form.followupStatus}
                    onChange={(e) => setForm({ ...form, followupStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {followupStatuses.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Outcome</label>
                  <select
                    value={form.outcome}
                    onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select outcome</option>
                    {followupOutcomes.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Remarks</label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Kya baat hui?"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={create.isPending}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {create.isPending ? "Saving..." : "Save Followup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
