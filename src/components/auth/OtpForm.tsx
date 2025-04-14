import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Spinner } from "../ui/spinner";
import { resendOtpRequest } from "@/store/slices/authSlice";
import { showErrorToast, showSuccessToast } from "@/lib/utils/toast";

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => void;
}

export default function OtpForm({ email, onVerify }: OtpFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const isLoading = useSelector((state: RootState) => state.auth.loading);
  const { success, message, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (success && message) {
      showSuccessToast(message);
    } else if (authError) {
      showErrorToast(authError);
    }
  }, [success, message, authError]);
  

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    onVerify(enteredOtp);
  };

  const handleResend = () => {
    dispatch(resendOtpRequest({ email }));
    setOtp(Array(6).fill(""));
    setTimer(30);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="max-w-md w-full">
      <Card className="bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Enter OTP sent to <br />
            <span className="text-red-600">{email}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-12 border rounded-md text-center text-xl font-semibold outline-none transition-all
                    ${error ? "border-red-500" : "border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-500"}`}
                />
              ))}
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 flex justify-center items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>

            <div className="text-center text-sm">
            <p className="text-gray-500 mb-1">Didn&rsquo;t receive the OTP?</p>
              {timer > 0 ? (
                <span className="text-gray-500">Resend OTP in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-red-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
