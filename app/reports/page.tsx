"use client";

import { useState } from "react";
import { reportService } from "@/services/report.service";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ReportsPage() {
  const [type, setType] = useState("leads");
  const [format, setFormat] = useState<"excel" | "pdf">("excel");

  const download = async () => {
    try {
      const blob = format === "excel" ? await reportService.exportExcel(type as any) : await reportService.exportPdf(type as any);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-report.${format === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download report");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Export business reports</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white">
                <option value="leads">Leads</option>
                <option value="followups">Followups</option>
                <option value="employees">Employees</option>
                <option value="sales">Sales</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-gray-900 dark:text-white"><input type="radio" value="excel" checked={format === "excel"} onChange={() => setFormat("excel")} /><span>Excel</span></label>
                <label className="flex items-center space-x-2 text-gray-900 dark:text-white"><input type="radio" value="pdf" checked={format === "pdf"} onChange={() => setFormat("pdf")} /><span>PDF</span></label>
              </div>
            </div>
            <button onClick={download} className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
