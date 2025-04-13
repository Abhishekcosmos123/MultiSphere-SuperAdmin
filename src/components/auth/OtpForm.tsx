import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Button } from "@/ui/button";

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend?: () => void;
}

export default function OtpForm({ email, onVerify, onResend }: OtpFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
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
    if (onResend) {
      onResend();
      setOtp(Array(6).fill(""));
      setTimer(60);
      inputsRef.current[0]?.focus();
    }
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

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Verify OTP
            </Button>

            <div className="text-center text-sm">
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
