"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dealService } from "@/services/deal.service";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Target, DollarSign, Plus, X } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Deal } from "@/types";
import { useState } from "react";

const stageColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  DISCUSSION: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  PROPOSAL_SENT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  NEGOTIATION: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  WON: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  LOST: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function DealsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    stage: "QUALIFIED",
    customerId: "",
    leadId: "",
    notes: "",
    expectedCloseDate: "",
  });

  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: () => dealService.getDeals(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => dealService.createDeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      setShowModal(false);
      setFormData({
        title: "",
        amount: "",
        stage: "QUALIFIED",
        customerId: "",
        leadId: "",
        notes: "",
        expectedCloseDate: "",
      });
      alert("Deal created successfully!");
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Failed to create deal");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    });
  };

  const totalValue = deals?.reduce((sum, deal) => sum + Number(deal.amount), 0) || 0;
  const wonDeals = deals?.filter((d) => d.stage === "WON").length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your sales pipeline</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Deals</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{deals?.length || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalValue)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Won Deals</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{wonDeals}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deal Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expected Close</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div></td></tr>
                ) : deals?.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No deals found</td></tr>
                ) : (
                  deals?.map((deal: Deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{deal.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                          <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                          {formatCurrency(Number(deal.amount))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColors[deal.stage] || stageColors.NEW}`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(deal.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
