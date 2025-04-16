import DashboardLayout from "../layout";
import { withAuth } from "@/hooks/middleware";

const SettingsPage = () => {

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
    </DashboardLayout>
  );
};

export default withAuth(SettingsPage, "/");