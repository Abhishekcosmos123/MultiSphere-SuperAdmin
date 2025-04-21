import { useState, useEffect } from "react";
import DashboardLayout from "../layout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  clearloading,
  fetchModulesRequest,
  updateCoordinatorAsync,
} from "@/store/slices/dashboardSlice";
import { showSuccessToast } from "@/lib/utils/toast";
import { Spinner } from "@/components/ui/spinner";
import { withAuth } from "@/hooks/middleware";

function IntermediarySettingsPage() {
  const dispatch = useDispatch();
  const {
    modules = [],
    coordinator,
    useCoordinator,
    useProducerr: useProducer,
    loading,
    successMessage: message,
  } = useSelector((state: RootState) => state.dashboard);

  const [selectedModule, setSelectedModule] = useState<string>("");
  const [coordinatorAccess, setCoordinatorAccess] = useState(false);
  const [vendorAccess, setVendorAccess] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);

  const isCoordinatorDisabled = ["CRM Management", "E-learning"].includes(selectedModule);

  useEffect(() => {
    dispatch(fetchModulesRequest());
    dispatch(clearloading());
  }, [dispatch]);

  useEffect(() => {
    if (modules.length > 0) {
      setSelectedModule(modules[0]);
    }
  }, [modules]);

  useEffect(() => {
    if (selectedModule) {
      setCoordinatorAccess(useCoordinator?.[selectedModule] || false);
      setVendorAccess(useProducer?.[selectedModule] || false);
    }
  }, [selectedModule, useCoordinator, useProducer]);

  useEffect(() => {
    if (coordinator && Object.keys(coordinator).length > 0 && message) {
      showSuccessToast(message);
    }
  }, [coordinator, message]);

  const handleSave = () => {
    if (!selectedModule) return;

    const payload = {
      coordinatorData: { [selectedModule]: coordinatorAccess },
      producerData: { [selectedModule]: vendorAccess },
      currentModule: selectedModule,
      jsonFile: jsonFile ?? undefined,
    };

    dispatch(updateCoordinatorAsync(payload));
  };

  const handleCancel = () => {
    if (!selectedModule) return;
    setCoordinatorAccess(useCoordinator?.[selectedModule] || false);
    setVendorAccess(useProducer?.[selectedModule] || false);
    setJsonFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/json") {
      alert("Please upload a valid .json file");
      return;
    }
    setJsonFile(file);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Intermediary Settings</h1>

        <div className="bg-white border rounded-2xl shadow-md p-6 space-y-6">
          {/* Module Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Module</label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {modules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          {/* Access Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={coordinatorAccess}
                onChange={() => setCoordinatorAccess(!coordinatorAccess)}
                className="w-5 h-5 text-blue-600"
                disabled={isCoordinatorDisabled}
              />
              <label className={`text-sm font-medium ${isCoordinatorDisabled ? "text-gray-400" : "text-gray-700"}`}>
                Coordinator Access {isCoordinatorDisabled && "(Not applicable)"}
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={vendorAccess}
                onChange={() => setVendorAccess(!vendorAccess)}
                className="w-5 h-5 text-blue-600"
              />
              <label className="text-sm font-medium text-gray-700">Single Vendor Mode</label>
            </div>
          </div>

          {/* JSON Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload JSON File</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {jsonFile && <p className="text-xs text-green-600 mt-1">Selected: {jsonFile.name}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center px-5 py-2 rounded-lg text-white transition ${!loading && jsonFile
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
              }`}
            disabled={loading || !jsonFile}
          >
            {loading && <Spinner className="w-4 h-4 mr-2" />}
            {loading ? "Saving..." : "Save"}
          </button>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(IntermediarySettingsPage);
