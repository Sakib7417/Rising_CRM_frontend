"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { reportService } from "@/services/report.service";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Download, FileSpreadsheet, FileText, TrendingUp, Users, Target, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const { data: overview } = useQuery({
    queryKey: ["overview"],
    queryFn: dashboardService.getOverview,
  });

  const handleExport = async (type: string, format: 'excel' | 'pdf') => {
    try {
      const blob = format === 'excel' 
        ? await reportService.exportExcel(type as any)
        : await reportService.exportPdf(type as any);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-report.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const reportTypes = [
    { name: 'Leads', key: 'leads', icon: Users },
    { name: 'Followups', key: 'followups', icon: TrendingUp },
    { name: 'Employees', key: 'employees', icon: Users },
    { name: 'Sales', key: 'sales', icon: DollarSign },
    { name: 'Revenue', key: 'revenue', icon: Target },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Export and analyze your data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{(overview as any)?.totalLeads || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{(overview as any)?.totalCustomers || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency((overview as any)?.totalRevenue || 0)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Open Deals</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{(overview as any)?.openDeals || 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Export Reports</h2>
          <div className="space-y-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{report.name} Report</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Export data in Excel or PDF format</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExport(report.key, 'excel')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center space-x-2"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={() => handleExport(report.key, 'pdf')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
