"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followupService } from "@/services/followup.service";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar, Clock, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Followup } from "@/types";
import { useState } from "react";

export default function FollowupsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "missed">("all");

  const { data: followups, isLoading } = useQuery<Followup[]>({
    queryKey: ["followups", filter],
    queryFn: () => {
      if (filter === "missed") return followupService.getMissedFollowups();
      if (filter === "upcoming") return followupService.getUpcomingFollowups();
      return followupService.getDailyFollowups();
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => followupService.updateFollowup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups"] });
    },
  });

  const todayFollowups = followups?.filter((f) => {
    const today = new Date().toDateString();
    return new Date(f.followupDate).toDateString() === today;
  }) || [];

  const upcomingFollowups = followups?.filter((f) => new Date(f.followupDate) > new Date()) || [];
  const missedFollowups = followups?.filter((f) => f.followupStatus !== "COMPLETED" && new Date(f.followupDate) < new Date()) || [];

  const displayFollowups = filter === "all" ? followups :
    filter === "today" ? todayFollowups :
    filter === "upcoming" ? upcomingFollowups :
    missedFollowups;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    NO_RESPONSE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    INTERESTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    CALLBACK: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Followups</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your scheduled followups</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{followups?.length || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{todayFollowups.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{upcomingFollowups.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Missed</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{missedFollowups.length}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {(["all", "today", "upcoming", "missed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead/Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scheduled</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center"><div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div></td></tr>
                ) : displayFollowups?.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No followups found</td></tr>
                ) : (
                  displayFollowups?.map((followup: Followup) => (
                    <tr key={followup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{followup.lead?.name || "N/A"}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{followup.lead?.companyName || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4 mr-2" />
                          {followup.remarks || "No remarks"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{formatDate(followup.followupDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[followup.followupStatus] || statusColors.PENDING}`}>
                          {followup.followupStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{followup.remarks || "-"}</td>
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
