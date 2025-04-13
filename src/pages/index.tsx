import { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import OtpForm from "@/components/auth/OtpForm";
import { useRouter } from "next/router";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";

export default function SuperAdminLoginPage() {
    const [showOtp, setShowOtp] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleLogin = (email: string, password: string) => {
        // TODO: Integrate API
        console.log("Logging in with:", email, password);
        setEmail(email);
        showSuccessToast("OTP sent to your email");
        setShowOtp(true);
    };

    const handleOtpVerify = (otp: string) => {
        // TODO: Verify OTP via API
        console.log("Verifying OTP:", otp);
        if (otp.length === 6) {
            showSuccessToast("OTP verified");
            router.push("/dashboard");
        } else {
            showErrorToast("Invalid OTP");
        }
    };

    return (
        <AuthLayout>
            {showOtp ? (
                <OtpForm onVerify={handleOtpVerify} email={email} />
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </AuthLayout>
    );
}
