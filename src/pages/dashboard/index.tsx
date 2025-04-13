'use client';

import { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { storage, StorageKeys } from '@/lib/utils/storage';

// Define the type for the CRM module
interface CrmModule {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const [crmModules] = useState<CrmModule[]>([
    { id: 1, name: "E-learning" },
    { id: 2, name: "Real Estate" },
    { id: 3, name: "Restaurants" },
    { id: 4, name: "CRM Management" },
  ]);

  const [selectedModule, setSelectedModule] = useState<CrmModule>(crmModules[0]);

  useEffect(() => {
    const savedModule = storage.getJson<CrmModule>(StorageKeys.SELECTED_MODULE); // Add type here
    if (savedModule) {
      const matched = crmModules.find((mod) => mod.id === savedModule.id);
      if (matched) setSelectedModule(matched);
    }
  }, [crmModules]);

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleId = parseInt(event.target.value);
    const selected = crmModules.find((mod) => mod.id === moduleId);
    if (selected) {
      setSelectedModule(selected);
    }
  };

  const handleSave = () => {
    storage.setJson(StorageKeys.SELECTED_MODULE, selectedModule);
    console.log("Saved module:", selectedModule);
  };

  const handleCancel = () => {
    setSelectedModule(crmModules[0]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>

        <Card className="p-4 mt-4">
          <h6 className="text-sm font-semibold mb-2">Select Module</h6>
          <select
            value={selectedModule.id}
            onChange={handleModuleChange}
            className="border rounded-md p-2 w-full"
          >
            {crmModules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.name}
              </option>
            ))}
          </select>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-black rounded-md p-2 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
