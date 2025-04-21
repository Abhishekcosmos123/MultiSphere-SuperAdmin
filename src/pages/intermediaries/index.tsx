import DashboardLayout from "../layout";
import { withAuth } from "@/hooks/middleware";

function IntermediarySettingsPage() {
 

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Manage Access & Modes</h1>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(IntermediarySettingsPage);
