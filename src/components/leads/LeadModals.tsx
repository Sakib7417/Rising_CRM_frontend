"use client";

import { useState } from "react";
import { Lead } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Edit, Trash2, UserPlus, RefreshCw, ArrowRight, Eye } from "lucide-react";

interface LeadModalsProps {
  showEditModal: boolean;
  setShowEditModal: (v: boolean) => void;
  showAssignModal: boolean;
  setShowAssignModal: (v: boolean) => void;
  showViewModal: boolean;
  setShowViewModal: (v: boolean) => void;
  showIndiaMartModal: boolean;
  setShowIndiaMartModal: (v: boolean) => void;
  selectedLead: Lead | null;
  editData: any;
  setEditData: (data: any) => void;
  assignToId: string;
  setAssignToId: (id: string) => void;
  indiaMartText: string;
  setIndiaMartText: (text: string) => void;
  csvFile: File | null;
  setCsvFile: (file: File | null) => void;
  onUpdate: (e: React.FormEvent) => void;
  onAssign: () => void;
  onIndiaMartImport: () => void;
  onIndiaMartFormCreate?: (data: any) => void;
  onCSVImport: () => void;
  onConvert: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  updateMutation: any;
  assignMutation: any;
  importIndiaMartMutation: any;
  bulkImportMutation: any;
  convertMutation: any;
  toggleMutation: any;
  createMutation?: any;
  users?: any[];
}

function parseIndiaMartText(text: string) {
  if (!text.trim()) return {};

  // IndiaMART column order (tab or multi-space separated):
  // Date | Phone | Name | Service Required | Location (City, State, Country) | Name (duplicate) | Email

  // Step 1: extract known-pattern fields directly from the raw string
  const raw = text.trim();

  // Extract email
  const emailMatch = raw.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract date (YYYY-MM-DD)
  const dateMatch = raw.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  const leadDate = dateMatch ? dateMatch[1] : "";

  // Extract phone — first standalone number with 10-12 digits
  const phoneMatch = raw.match(/\b(0?\d{10,11})\b/);
  const phone = phoneMatch ? phoneMatch[1].slice(-10) : "";

  // Extract location — "City, State, Country" pattern
  const locationMatch = raw.match(/([A-Za-z][^,\t]+),\s*([A-Za-z][^,\t]+),\s*(India|[A-Za-z]+)/);
  const city = locationMatch ? locationMatch[1].trim() : "";
  const state = locationMatch ? locationMatch[2].trim() : "";
  const country = locationMatch ? locationMatch[3].trim() : "India";

  // Step 2: remove all extracted parts from raw to find remaining text tokens
  let remainder = raw;
  if (leadDate) remainder = remainder.replace(leadDate, "");
  if (phone) remainder = remainder.replace(new RegExp(`0?${phone.slice(-10)}`), "");
  if (email) remainder = remainder.replace(email, "");
  if (locationMatch) remainder = remainder.replace(locationMatch[0], "");

  // Split remainder by tabs or 2+ spaces, clean up
  const tokens = remainder
    .split(/\t|\s{2,}/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  // Remove duplicates (IndiaMART repeats the name)
  const unique = tokens.filter((v, i, arr) => arr.indexOf(v) === i);

  // First token = Name, second = Service Required (product they want)
  const name = unique[0] || "";
  const serviceRequired = unique[1] || "";

  return { name, phone, email, serviceRequired, companyName: "", city, state, country, leadDate };
}

export default function LeadModals({
  showEditModal,
  setShowEditModal,
  showAssignModal,
  setShowAssignModal,
  showViewModal,
  setShowViewModal,
  showIndiaMartModal,
  setShowIndiaMartModal,
  selectedLead,
  editData,
  setEditData,
  assignToId,
  setAssignToId,
  indiaMartText,
  setIndiaMartText,
  csvFile,
  setCsvFile,
  onUpdate,
  onAssign,
  onIndiaMartImport,
  onIndiaMartFormCreate,
  onCSVImport,
  onConvert,
  onToggleActive,
  updateMutation,
  assignMutation,
  importIndiaMartMutation,
  bulkImportMutation,
  convertMutation,
  toggleMutation,
  createMutation,
  users = [],
}: LeadModalsProps) {
  const [indiaMartFormData, setIndiaMartFormData] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    email: "",
    companyName: "",
    serviceRequired: "",
    budget: "",
    leadStatus: "NEW",
    leadSource: "INDIAMART",
    city: "",
    state: "",
    country: "India",
    address: "",
    nextFollowupDate: "",
    leadDate: "",
    tags: "",
  });
  const [showIndiaMartForm, setShowIndiaMartForm] = useState(false);

  const handleParseIndiaMart = () => {
    if (!indiaMartText.trim()) return;
    const parsed = parseIndiaMartText(indiaMartText);
    setIndiaMartFormData({ ...indiaMartFormData, ...parsed });
    setShowIndiaMartForm(true);
  };

  const handleIndiaMartFormSubmit = () => {
    if (onIndiaMartFormCreate) {
      onIndiaMartFormCreate(indiaMartFormData);
    }
    setShowIndiaMartForm(false);
    setIndiaMartText("");
    setIndiaMartFormData({ name: "", phone: "", alternatePhone: "", email: "", companyName: "", serviceRequired: "", budget: "", leadStatus: "NEW", leadSource: "INDIAMART", city: "", state: "", country: "India", address: "", nextFollowupDate: "", leadDate: "", tags: "" });
  };

  return (
    <>
      {/* View Lead Modal */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Full lead information for {selectedLead.name}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Name</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Company</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.companyName || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Service Required</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.serviceRequired || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Budget</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.budget !== null ? formatCurrency(selectedLead.budget) : "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.leadStatus}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Source</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.leadSource}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.email || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Phone</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.phone || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Alternate Phone</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.alternatePhone || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Assigned To</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.assignedTo?.name || "Unassigned"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Created By</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.createdBy?.name || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Active</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.isActive ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedLead.city || selectedLead.state || selectedLead.country ? (
                        <>{[selectedLead.city, selectedLead.state, selectedLead.country].filter(Boolean).join(", ")}</>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Address</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.address || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Notes</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.notes || "-"}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Last Contact</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.lastContactDate ? formatDate(selectedLead.lastContactDate) : "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Next Followup</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.nextFollowupDate ? formatDate(selectedLead.nextFollowupDate) : "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Converted At</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedLead.convertedAt ? formatDate(selectedLead.convertedAt) : "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Created At</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(selectedLead.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Updated At</h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(selectedLead.updatedAt)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.length > 0 ? (
                    selectedLead.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">No tags</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Lead</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={onUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                  <input type="text" required value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                  <input type="tel" required value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alternate Phone</label>
                  <input type="tel" value={editData.alternatePhone || ""} onChange={(e) => setEditData({ ...editData, alternatePhone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                  <input type="text" value={editData.companyName || ""} onChange={(e) => setEditData({ ...editData, companyName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Required</label>
                  <input type="text" value={editData.serviceRequired || ""} onChange={(e) => setEditData({ ...editData, serviceRequired: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget</label>
                  <input type="number" value={editData.budget || ""} onChange={(e) => setEditData({ ...editData, budget: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead Source</label>
                  <select value={editData.leadSource || "MANUAL"} onChange={(e) => setEditData({ ...editData, leadSource: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="MANUAL">Manual</option>
                    <option value="INDIAMART">IndiaMART</option>
                    <option value="WEBSITE">Website</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select value={editData.leadStatus || "NEW"} onChange={(e) => setEditData({ ...editData, leadStatus: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Followup Date</label>
                  <input type="datetime-local" value={editData.nextFollowupDate ? editData.nextFollowupDate.slice(0, 16) : ""} onChange={(e) => setEditData({ ...editData, nextFollowupDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead Date</label>
                  <input type="date" value={editData.leadDate ? editData.leadDate.slice(0, 10) : ""} onChange={(e) => setEditData({ ...editData, leadDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                  <input type="text" value={editData.city || ""} onChange={(e) => setEditData({ ...editData, city: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                  <input type="text" value={editData.state || ""} onChange={(e) => setEditData({ ...editData, state: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                  <input type="text" value={editData.country || ""} onChange={(e) => setEditData({ ...editData, country: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                  <input type="text" value={Array.isArray(editData.tags) ? editData.tags.join(", ") : (editData.tags || "")} onChange={(e) => setEditData({ ...editData, tags: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="tag1, tag2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <textarea value={editData.address || ""} onChange={(e) => setEditData({ ...editData, address: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Full address..." />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={updateMutation.isPending} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50">{updateMutation.isPending ? "Updating..." : "Update Lead"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assign Lead</h2>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign To</label>
                <select value={assignToId} onChange={(e) => setAssignToId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={onAssign} disabled={assignMutation.isPending || !assignToId} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50">{assignMutation.isPending ? "Assigning..." : "Assign"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IndiaMart Import Modal */}
      {showIndiaMartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import from IndiaMART</h2>
              <button
                onClick={() => {
                  setShowIndiaMartModal(false);
                  setShowIndiaMartForm(false);
                  setIndiaMartText("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {!showIndiaMartForm ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste IndiaMART Lead Data</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Paste the raw IndiaMART data (date, phone, name, service, location, contact, email)</p>
                  <textarea
                    value={indiaMartText}
                    onChange={(e) => setIndiaMartText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    placeholder="2026-07-20	09161246444	Deepak Kumar	Single Leg MLM Software	Maunath Bhanjan, Uttar Pradesh, India	Deepak Kumar	deepakkumar0811995@gmail.com"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowIndiaMartModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleParseIndiaMart}
                    disabled={!indiaMartText.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">Review and edit the extracted data before importing</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={indiaMartFormData.name}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={indiaMartFormData.phone}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alternate Phone</label>
                    <input
                      type="tel"
                      value={indiaMartFormData.alternatePhone}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, alternatePhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={indiaMartFormData.email}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                    <input
                      type="text"
                      value={indiaMartFormData.companyName}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, companyName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Required</label>
                    <input
                      type="text"
                      value={indiaMartFormData.serviceRequired}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, serviceRequired: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget</label>
                    <input
                      type="number"
                      value={indiaMartFormData.budget}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, budget: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead Source *</label>
                    <select
                      value={indiaMartFormData.leadSource}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, leadSource: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="INDIAMART">IndiaMART</option>
                      <option value="MANUAL">Manual</option>
                      <option value="WEBSITE">Website</option>
                      <option value="FACEBOOK">Facebook</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="REFERRAL">Referral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={indiaMartFormData.leadStatus}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, leadStatus: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="INTERESTED">Interested</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                      <option value="NEGOTIATION">Negotiation</option>
                      <option value="WON">Won</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Followup Date</label>
                    <input
                      type="datetime-local"
                      value={indiaMartFormData.nextFollowupDate}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, nextFollowupDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead Date</label>
                    <input
                      type="date"
                      value={indiaMartFormData.leadDate}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, leadDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      value={indiaMartFormData.city}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                    <input
                      type="text"
                      value={indiaMartFormData.state}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      value={indiaMartFormData.country}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={indiaMartFormData.tags}
                      onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, tags: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="tag1, tag2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                  <textarea
                    value={indiaMartFormData.address}
                    onChange={(e) => setIndiaMartFormData({ ...indiaMartFormData, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Full address..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowIndiaMartForm(false);
                      setIndiaMartText("");
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleIndiaMartFormSubmit}
                    disabled={(createMutation?.isPending || importIndiaMartMutation.isPending) || !indiaMartFormData.name || !indiaMartFormData.phone}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                  >
                    {(createMutation?.isPending || importIndiaMartMutation.isPending) ? "Importing..." : "Import Lead"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions for selected lead */}
      {selectedLead && !showViewModal && !showEditModal && !showAssignModal && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-2 z-40">
          <button onClick={() => onConvert(selectedLead.id)} disabled={convertMutation.isPending} className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50">
            <ArrowRight className="h-4 w-4" /><span>Convert to Customer</span>
          </button>
          <button onClick={() => onToggleActive(selectedLead.id, !selectedLead.isActive)} disabled={toggleMutation.isPending} className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50">
            <RefreshCw className="h-4 w-4" /><span>{selectedLead.isActive ? "Deactivate" : "Activate"}</span>
          </button>
        </div>
      )}
    </>
  );
}
