"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { userService } from "@/services/user.service";
import { formatDate } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Task } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export default function TasksPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Partial<Task>>({ title: "", description: "", assignedToId: "", dueDate: "", priority: "MEDIUM", status: "PENDING" });
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({ queryKey: ["tasks"], queryFn: () => taskService.getTasks() });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => userService.getUsers() });

  const create = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["tasks"] }); setIsOpen(false); setForm({ title: "", description: "", assignedToId: "", dueDate: "", priority: "MEDIUM", status: "PENDING" }); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) => taskService.updateTask(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["tasks"] }); setIsOpen(false); setEditing(null); },
  });

  const remove = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage sales team tasks</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ title: "", description: "", assignedToId: "", dueDate: "", priority: "MEDIUM", status: "PENDING" }); setIsOpen(true); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700">Add Task</button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : tasks?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No tasks found</td></tr>
              ) : (
                tasks?.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{t.title}</p>
                      <p className="text-sm text-gray-500">{t.description || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{t.assignedTo?.name || "-"}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${priorityColors[t.priority] || ""}`}>{t.priority}</span></td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${statusColors[t.status] || ""}`}>{t.status}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(t.dueDate)}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => { setEditing(t); setForm({ ...t }); setIsOpen(true); }} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => remove.mutate(t.id)} className="text-red-600 hover:underline text-sm">Delete</button>
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
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editing ? "Edit Task" : "Add Task"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <select value={form.assignedToId || ""} onChange={(e) => setForm({ ...form, assignedToId: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="">Unassigned</option>
                  {users?.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input type="datetime-local" value={form.dueDate || ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
                </select>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
                </select>
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
