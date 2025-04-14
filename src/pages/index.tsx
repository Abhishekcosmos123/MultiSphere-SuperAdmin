import { useEffect, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import OtpForm from "@/components/auth/OtpForm";
import { useRouter } from "next/router";
import { showSuccessToast, showErrorToast } from "@/lib/utils/toast";
import { useDispatch, useSelector } from "react-redux";
import {
  loginRequest,
  verifyOtpRequest,
  clearAuthMessages, 
} from "@/store/slices/authSlice";
import { RootState } from "@/store";

export default function SuperAdminLoginPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginMessage, error, otpResponse } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (loginMessage) {
      showSuccessToast(loginMessage);
      setShowOtp(true);
      dispatch(clearAuthMessages());
    }
    if (error && !showOtp) {
      showErrorToast(error);
      dispatch(clearAuthMessages());
    }
  }, [loginMessage, error, dispatch, showOtp]);

  useEffect(() => {
    if (otpResponse) {
      showSuccessToast(otpResponse.message);
      dispatch(clearAuthMessages());
      router.push("/dashboard");
    }
    if (error && showOtp) {
      showErrorToast(error);
      dispatch(clearAuthMessages());
    }
  }, [otpResponse, error, dispatch, router, showOtp]);

  const handleLogin = async (email: string, password: string) => {
    try {
      dispatch(loginRequest({ email, password }));
      setEmail(email);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleOtpVerify = (otp: string) => {
    if (otp.length === 6) {
      dispatch(verifyOtpRequest({ email, otp }));
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
