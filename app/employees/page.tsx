"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { User } from "@/types";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-800",
  ADMIN: "bg-purple-100 text-purple-800",
  SALES_MANAGER: "bg-blue-100 text-blue-800",
  SALES_AGENT: "bg-green-100 text-green-800",
  EMPLOYEE: "bg-gray-100 text-gray-800",
};

export default function EmployeesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({ name: "", email: "", phone: "", role: "EMPLOYEE", targetAmount: 0, isActive: true });
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({ queryKey: ["users"], queryFn: () => userService.getUsers() });

  const create = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); setIsOpen(false); setForm({ name: "", email: "", phone: "", role: "EMPLOYEE", targetAmount: 0, isActive: true }); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userService.updateUser(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); setIsOpen(false); setEditing(null); },
  });

  const remove = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employees</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage staff and sales team</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ name: "", email: "", phone: "", role: "EMPLOYEE", targetAmount: 0, isActive: true }); setIsOpen(true); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700">Add Employee</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achieved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : users?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No employees found</td></tr>
              ) : (
                users?.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${roleColors[u.role] || ""}`}>{u.role}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(u.targetAmount || 0)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatCurrency(u.achievedAmount || 0)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => { setEditing(u); setForm({ ...u }); setIsOpen(true); }} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => remove.mutate(u.id)} className="text-red-600 hover:underline text-sm">Delete</button>
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
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editing ? "Edit Employee" : "Add Employee"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="EMPLOYEE">Employee</option><option value="SALES_AGENT">Sales Agent</option><option value="SALES_MANAGER">Sales Manager</option><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super Admin</option>
                </select>
                <input type="number" value={form.targetAmount || 0} onChange={(e) => setForm({ ...form, targetAmount: Number(e.target.value) })} placeholder="Monthly Target" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <label className="flex items-center space-x-2 text-gray-900 dark:text-white"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /><span>Active</span></label>
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
