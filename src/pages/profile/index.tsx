import { GetServerSideProps } from "next";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Edit, Save, LogOut, Phone, Globe, Mail, User } from "lucide-react";
import dynamic from "next/dynamic";
import cookie from "cookie";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import DashboardLayout from "../layout";
import { showSuccessToast } from "@/lib/utils/toast";
import { storage, StorageKeys } from "@/lib/utils/storage";
import { logoutRequest } from "@/store/slices/authSlice";
import { updateAdminProfileRequest } from "@/store/slices/dashboardSlice";
import { RootState } from "@/store";

const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });

import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import { withAuth } from "@/hooks/middleware";
import { Spinner } from "@/components/ui/spinner";

const ProfileField = ({ label, value, icon }: { label: string; value?: string; icon: React.ReactNode }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-800 dark:text-white">{value || "—"}</p>
    </div>
  </div>
);

const ProfilePage = ({ serverUser }: { serverUser: any }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const storeUser = useSelector((state: RootState) => state.auth.user);
  const user = useMemo(() => storeUser || serverUser, [storeUser, serverUser]);
  const { successMessage, profile, loading } = useSelector((state: RootState) => state.dashboard);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(
    user?.country_code && user?.phone ? `${user.country_code}${user.phone}` : ""
  );
  const [countryCode, setCountryCode] = useState(user?.country_code || "");
  const [contactConsent, setContactConsent] = useState(false);

  useEffect(() => {
    if (successMessage) {
      showSuccessToast(successMessage);
      setIsEditing(false);
    }
  }, [successMessage]);

  const handleSave = () => {
    if (!user || phone.length < 10) return;

    const phoneNumber = phone.replace(/^\+/, "");
    const cc = phoneNumber.slice(0, phoneNumber.length - 10);
    const mobile = phoneNumber.slice(-10);

    if (!mobile || mobile.length !== 10) return;

    dispatch(
      updateAdminProfileRequest({
        id: user.id,
        payload: {
          name,
          email,
          phone: mobile,
          country_code: `+${cc}`,
        },
      })
    );

    setCountryCode(`+${cc}`);
  };

  const handleLogout = () => {
    const token = typeof window !== "undefined" ? storage.get(StorageKeys.TOKEN) : null;
    dispatch(logoutRequest({ refreshToken: token ? String(token) : undefined }));
    storage.remove(StorageKeys.TOKEN);
    storage.remove(StorageKeys.USER);
    router.push("/");
    showSuccessToast("Logged out Successfully");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen p-4 sm:p-8 md:p-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Profile Overview
        </h1>

        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
          {isEditing ? (
            <div className="w-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="w-32 shrink-0">Name*</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="email" className="w-32 shrink-0">Email*</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="phone" className="w-32 shrink-0">Mobile Number*</Label>
                <PhoneInput
                  country={"in"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  inputClass="!w-full !pl-14 !py-2 !border-2 !border-indigo-200 focus:!border-indigo-500 rounded-md"
                  buttonClass="!bg-white dark:!bg-gray-900"
                  dropdownClass="dark:!bg-gray-800"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={contactConsent}
                  onCheckedChange={(checked) => setContactConsent(checked as boolean)}
                />
                <Label htmlFor="consent" className="text-sm">
                  I agree to be contacted via WhatsApp, phone, email, etc.
                </Label>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl mt-6 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Full Name" value={name} icon={<User size={22} className="text-indigo-600" />} />
              <ProfileField label="Email" value={email} icon={<Mail size={22} className="text-indigo-600" />} />
              <ProfileField label="Country Code" value={countryCode} icon={<Globe size={22} className="text-indigo-600" />} />
              <ProfileField label="Phone" value={phone} icon={<Phone size={22} className="text-indigo-600" />} />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={!contactConsent || loading}
                  className="bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Spinner className="mr-2" size={18} />
                  ) : (
                    <Save className="mr-2" size={18} />
                  )}
                  {loading ? "Saving..." : "Save Profile"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2" size={18} />
                  Edit Profile
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2" size={18} />
                  Log Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const serverUser = JSON.parse(cookies[StorageKeys.USER] ?? "null");

  return {
    props: {
      serverUser,
    },
  };
};

export default withAuth(ProfilePage, "/");
