"use client";

import { Lead } from "@/types";
import { X, Edit, Trash2, UserPlus, RefreshCw, ArrowRight, Eye } from "lucide-react";

interface LeadModalsProps {
  showEditModal: boolean;
  setShowEditModal: (v: boolean) => void;
  showAssignModal: boolean;
  setShowAssignModal: (v: boolean) => void;
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
  onCSVImport: () => void;
  onConvert: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  updateMutation: any;
  assignMutation: any;
  importIndiaMartMutation: any;
  bulkImportMutation: any;
  convertMutation: any;
  toggleMutation: any;
  users?: any[];
}

export default function LeadModals({
  showEditModal,
  setShowEditModal,
  showAssignModal,
  setShowAssignModal,
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
  onCSVImport,
  onConvert,
  onToggleActive,
  updateMutation,
  assignMutation,
  importIndiaMartMutation,
  bulkImportMutation,
  convertMutation,
  toggleMutation,
  users = [],
}: LeadModalsProps) {
  return (
    <>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                  <input type="tel" required value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                  <input type="text" value={editData.company || ""} onChange={(e) => setEditData({ ...editData, company: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select value={editData.leadStatus || "NEW"} onChange={(e) => setEditData({ ...editData, leadStatus: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="NEW">New</option>
                    <option value="ACTIVE">Active</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="FOLLOW_UP">Follow Up</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="WON">Won</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import from IndiaMART</h2>
              <button onClick={() => setShowIndiaMartModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><X className="h-5 w-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paste IndiaMART Lead Data</label>
                <textarea value={indiaMartText} onChange={(e) => setIndiaMartText(e.target.value)} rows={10} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm" placeholder="Paste raw IndiaMART lead text here..." />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowIndiaMartModal(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button onClick={onIndiaMartImport} disabled={importIndiaMartMutation.isPending || !indiaMartText.trim()} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50">{importIndiaMartMutation.isPending ? "Importing..." : "Import Lead"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions for selected lead */}
      {selectedLead && !showEditModal && !showAssignModal && (
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
