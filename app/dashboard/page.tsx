"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { formatDateTime } from "@/lib/utils";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { Followup } from "@/types";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getOverview,
  });

  const { data: analytics } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: dashboardService.getAnalytics,
  });

  const [selectedFollowup, setSelectedFollowup] = useState<Followup | null>(null);

  // Sample data for charts (replace with real data from API)
  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 55000 },
    { month: "Jun", revenue: 67000 },
  ];

  const leadSourceData = [
    { name: "IndiaMART", value: 35 },
    { name: "Website", value: 25 },
    { name: "Facebook", value: 20 },
    { name: "WhatsApp", value: 15 },
    { name: "Referral", value: 5 },
  ];

  const statCards = [
    {
      title: "Total Leads",
      value: stats?.totalLeads || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Active Leads",
      value: stats?.activeLeads || 0,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Today's Followups",
      value: stats?.todayFollowups || 0,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Pending Tasks",
      value: stats?.pendingTasks || 0,
      icon: CheckSquare,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Won Deals",
      value: stats?.wonDeals || 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Monthly Revenue",
      value: `₹${((stats?.monthlyRevenue || 0) / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your CRM overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`h-12 w-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Monthly Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Lead Sources Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lead Sources
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity & Upcoming Followups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {stats?.recentActivities?.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {activity.action.replace(/_/g, " ")} {activity.user?.name ? `- ${activity.user.name}` : ""}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Followups */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upcoming Followups
            </h3>
            <div className="space-y-4">
              {stats?.upcomingFollowups?.map((followup) => (
                <div key={followup.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        Followup with {followup.lead?.companyName || followup.lead?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDateTime(followup.followupDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFollowup(followup)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedFollowup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Follow-up Details</h3>
              <button
                onClick={() => setSelectedFollowup(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Lead:</span> {selectedFollowup.lead?.companyName || selectedFollowup.lead?.name || "Unknown"}</p>
              <p><span className="font-medium">Phone:</span> {selectedFollowup.lead?.phone || "-"}</p>
              <p><span className="font-medium">Email:</span> {selectedFollowup.lead?.email || "-"}</p>
              <p><span className="font-medium">Date:</span> {formatDateTime(selectedFollowup.followupDate)}</p>
              <p><span className="font-medium">Type:</span> {selectedFollowup.followupType}</p>
              <p><span className="font-medium">Status:</span> {selectedFollowup.followupStatus}</p>
              <p><span className="font-medium">Remarks:</span> {selectedFollowup.remarks || "-"}</p>
              <p><span className="font-medium">Next Follow-up:</span> {selectedFollowup.nextFollowupDate ? formatDateTime(selectedFollowup.nextFollowupDate) : "-"}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedFollowup(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
