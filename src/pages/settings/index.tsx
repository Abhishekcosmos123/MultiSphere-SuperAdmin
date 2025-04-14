import { useEffect, useState } from "react";
import DashboardLayout from "../layout";
import { Switch } from "@/components/ui/switch";
import { withAuth } from "@/hooks/middleware";
import { fetchSingleVendorRequest, updateUseProducer } from "@/store/slices/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { showSuccessToast } from "@/lib/utils/toast";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const [isProducerMode, setIsProducerMode] = useState<boolean>(false);
  const { useProducer } = useSelector((state: RootState) => state.dashboard);

  const toggleProducerMode = () => {
    const newMode = !isProducerMode;
    setIsProducerMode(newMode);
    dispatch(updateUseProducer(newMode));
  };

  useEffect(() => {
    dispatch(fetchSingleVendorRequest());
  }, [dispatch]);

  useEffect(() => {
    showSuccessToast(
      useProducer ? "Single Vendor enabled" : "Single Vendor disabled"
    );
  }, [useProducer]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex items-center space-x-4">
        <span className="text-lg">Single Vendor Mode:</span>
        <Switch
          checked={useProducer || undefined}
          onCheckedChange={toggleProducerMode}
          className="transition duration-200 ease-in-out"
        />
      </div>
    </DashboardLayout>
  );
};

export default withAuth(SettingsPage, "/");