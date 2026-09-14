// src/pages/auth/LoginOtpVerification.tsx
import { useState, useRef } from "react";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { verifyLogin2fa } from "@/api/auth";

interface LoginOtpVerificationProps {
  token: string;
  onSuccess: (token: string) => void;
  onBack: () => void;
}

export function LoginOtpVerification({ token, onSuccess, onBack }: LoginOtpVerificationProps) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const one_time_password = otpValues.join("");

    if (one_time_password.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyLogin2fa({
        token,
        one_time_password,
      });

      if (response.status) {
        toast.success(response.message || "2FA verified successfully!");
        const authToken = response.data?.token || response.token;
        if (authToken) {
          onSuccess(authToken);
        } else {
          toast.error("Authentication token missing in response.");
        }
      } else {
        toast.error(response.message || "Invalid 2FA code.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Verification failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <div className="mb-8 flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-secondary hover:text-gray-primary flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to login
        </button>
      </div>

      <span className="bg-primary-lighter text-primary-main mx-auto mb-5 flex size-16 items-center justify-center rounded-full">
        <ShieldCheck className="size-7" />
      </span>

      <h1 className="text-gray-primary mb-2 text-2xl font-bold">Two-Factor Authentication</h1>
      <p className="text-gray-secondary mb-8 text-sm">
        Enter the 6-digit verification code from your Google Authenticator or secure app.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otpValues.map((val, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 size-12 sm:size-14 rounded-xl border text-center text-lg font-bold transition-shadow focus:ring-4 focus:outline-0 bg-white text-gray-primary"
            />
          ))}
        </div>

        <Button type="submit" fullWidth disabled={loading} size="lg">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" /> Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </Button>
      </form>
    </div>
  );
}