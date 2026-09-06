"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { ProductService } from "@/types";

export default function ProductsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<ProductService | null>(null);
  const [form, setForm] = useState<Partial<ProductService>>({ name: "", description: "", price: 0, taxPercent: 0, unit: "", isActive: true });
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => productService.getProducts() });

  const create = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
      setForm({ name: "", description: "", price: 0, taxPercent: 0, unit: "", isActive: true });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductService> }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsOpen(false);
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) update.mutate({ id: editing.id, data: form });
    else create.mutate(form);
  };

  const openEdit = (p: ProductService) => {
    setEditing(p);
    setForm({ ...p });
    setIsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products & Services</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your catalog and rate card</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ name: "", description: "", price: 0, taxPercent: 0, unit: "", isActive: true }); setIsOpen(true); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700"
          >
            Add Product
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center">Loading...</td></tr>
              ) : products?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No products found</td></tr>
              ) : (
                products?.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.description || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{p.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{p.taxPercent}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{p.unit || "-"}</td>
                    <td className="px-6 py-4 text-sm">{p.isActive ? <span className="text-green-600">Active</span> : <span className="text-red-600">Inactive</span>}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => remove.mutate(p.id)} className="text-red-600 hover:underline text-sm">Delete</button>
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
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editing ? "Edit Product" : "Add Product"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                  <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <input type="number" value={form.price || 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax %</label>
                  <input type="number" value={form.taxPercent || 0} onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                  <input value={form.unit || ""} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="e.g., pcs, hrs" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <label className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                  <span>Active</span>
                </label>
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
