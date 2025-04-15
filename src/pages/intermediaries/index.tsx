import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../layout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearloading, fetchModulesRequest, updateCoordinatorAsync } from "@/store/slices/dashboardSlice";
import { showSuccessToast } from "@/lib/utils/toast";
import { Spinner } from "@/components/ui/spinner";
import { withAuth } from "@/hooks/middleware";

function IntermediarySettingsPage() {
  const dispatch = useDispatch();
  const modules = useSelector((state: RootState) => state.dashboard.modules) || [];
  const useCoordinator = useSelector((state: RootState) => state.dashboard.useCoordinator);
  const coordinator = useSelector((state: RootState) => state.dashboard.coordinator);
  const loading = useSelector((state: RootState) => state.dashboard.loading);
  const message = useSelector((state: RootState) => state.dashboard.successMessage);

  useEffect(() => {
    if (coordinator && Object.keys(coordinator).length > 0 && message) {
      showSuccessToast(message);
    }
  }, [coordinator, message]);

  const intermediaryRoles = useMemo(
    () =>
      modules?.map((module: string, index: number) => ({
        id: index + 1,
        name: module,
      })) || [],
    [modules]
  );

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [initialRoles, setInitialRoles] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchModulesRequest());
    dispatch(clearloading());
  }, [dispatch]);

  useEffect(() => {
    if (!useCoordinator) return;

    const trueRoles = intermediaryRoles
      .filter((role) => useCoordinator[role.name] === true)
      .map((role) => role.id);

    setSelectedRoles(trueRoles);
    setInitialRoles(trueRoles);
  }, [intermediaryRoles, useCoordinator]);

  const toggleCheckbox = (id: number) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((roleId) => roleId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    const formattedData = intermediaryRoles
      .filter((role) => role.name !== "CRM Management" && role.name !== "E-learning")
      .reduce<{ [key: string]: boolean }>((acc, role) => {
        const key = role.name;
        const isSelected = selectedRoles.includes(role.id);
        acc[key] = isSelected;
        return acc;
      }, {});
    dispatch(updateCoordinatorAsync(formattedData));
  };

  const handleCancel = () => {
    setSelectedRoles(initialRoles);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Manage Intermediary Roles</h1>

        <div className="border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-gray-700">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {intermediaryRoles.map((role) => {
                const isDisabled = role.name === "CRM Management" || role.name === "E-learning";
                return (
                  <tr key={role.id} className="border-t">
                    <td className="px-6 py-4 text-gray-800">{role.name}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => toggleCheckbox(role.id)}
                        className={`w-5 h-5 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isDisabled}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              !loading ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}
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
