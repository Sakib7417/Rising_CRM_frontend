"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">CRM configuration and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Info</h2>
            <div className="space-y-4">
              <input placeholder="Company Name" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <input placeholder="GST / Tax ID" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <textarea placeholder="Address" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /><span>Follow-up reminders</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked /><span>Lead assignment alerts</span></label>
              <label className="flex items-center space-x-2"><input type="checkbox" /><span>Daily summary email</span></label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
