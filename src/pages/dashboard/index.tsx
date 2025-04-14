'use client';

import { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentModuleRequest,
  fetchModulesRequest,
  updateCurrentModuleRequest,
  resetUpdateCurrentModule,
  clearloading,
} from "@/store/slices/dashboardSlice";
import { RootState } from "@/store";
import { showSuccessToast } from "@/lib/utils/toast";
import { Spinner } from "@/components/ui/spinner";
import { withAuth } from "@/hooks/middleware";

interface Module {
  id: number;
  name: string;
}

function DashboardPage() {
  const dispatch = useDispatch();
  const { modules: rawModules, currentModule, success, loading } = useSelector((state: RootState) => state.dashboard);

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    dispatch(fetchModulesRequest());
    dispatch(fetchCurrentModuleRequest());
    dispatch(clearloading())
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(rawModules)) {
      const mappedModules: Module[] = rawModules.map((name: string, index: number) => ({
        id: index + 1,
        name,
      }));
      setModules(mappedModules);
    }
  }, [rawModules]);

  useEffect(() => {
    if (currentModule && modules.length > 0) {
      const matched = modules.find((mod) => mod.name === currentModule);
      if (matched) {
        setSelectedModule(matched);
      }
    }
  }, [currentModule, modules]);

  useEffect(() => {
    if (success) {
      showSuccessToast("Current module updated successfully.");
      dispatch(resetUpdateCurrentModule());
    }
  }, [success, dispatch]);

  const handleModuleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const moduleId = parseInt(event.target.value);
    const selected = modules.find((mod) => mod.id === moduleId);
    if (selected) {
      setSelectedModule(selected);
    }
  };

  const handleSave = () => {
    if (selectedModule && selectedModule.name !== currentModule) {
      dispatch(updateCurrentModuleRequest(selectedModule.name));
    }
  };

  const handleCancel = () => {
    if (currentModule) {
      const matched = modules.find((mod) => mod.name === currentModule);
      if (matched) {
        setSelectedModule(matched);
      }
    }
  };

  const isSaveDisabled = !selectedModule || selectedModule.name === currentModule;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>

        <Card className="p-4 mt-4">
          <h6 className="text-sm font-semibold mb-2">Select Module</h6>
          <select
            value={selectedModule?.id ?? ""}
            onChange={handleModuleChange}
            className="border rounded-md p-2 w-full"
            disabled={modules.length === 0}
          >
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.name}
              </option>
            ))}
          </select>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition flex items-center justify-center gap-2 min-w-[80px] cursor-pointer"
              disabled={isSaveDisabled || loading}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-black rounded-md p-2 hover:bg-gray-400 transition"
              disabled={!currentModule}
            >
              Cancel
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DashboardPage, "/");