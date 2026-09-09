// src/pages/account/SecuritySettings.tsx
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, ShieldCheck, ShieldOff, X, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import {
  changePassword,
  fetchTwoFactorStatus,
  enableTwoFactor,
  confirmTwoFactor,
  disableTwoFactor,
} from "@/api/customer";

const inputClass =
  "border-gray-tertiary/32 h-12 w-full rounded-lg border px-4 pr-11 text-sm focus:outline-0 focus:ring-1 focus:ring-primary-main";

function PasswordField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        required
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        className={inputClass}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-gray-tertiary hover:text-gray-secondary absolute top-1/2 right-4 -translate-y-1/2"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function SecuritySettings() {
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(true);
  const [setupOpen, setSetupOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [settingUp, setSettingUp] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [confirming, setConfirming] = useState(false);

  const [disableOpen, setDisableOpen] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    fetchTwoFactorStatus()
      .then((res) => setTwoFAEnabled(!!res?.data?.enabled))
      .catch((err) => console.error("Failed to load 2FA status", err))
      .finally(() => setTwoFALoading(false));
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success(res?.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const startTwoFactorSetup = async () => {
    setSettingUp(true);
    try {
      const res = await enableTwoFactor();
      setQrCode(res?.data?.qr_code || null);
      setSecret(res?.data?.secret || null);
      setSetupOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to start 2FA setup.");
    } finally {
      setSettingUp(false);
    }
  };

  const handleConfirmTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirming(true);
    try {
      const res = await confirmTwoFactor(confirmCode);
      toast.success(res?.message || "Two-factor authentication enabled");
      setTwoFAEnabled(true);
      setSetupOpen(false);
      setConfirmCode("");
      setQrCode(null);
      setSecret(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid code. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  const handleDisableTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisabling(true);
    try {
      const res = await disableTwoFactor(disableCode);
      toast.success(res?.message || "Two-factor authentication disabled");
      setTwoFAEnabled(false);
      setDisableOpen(false);
      setDisableCode("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid code. Please try again.");
    } finally {
      setDisabling(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Security Settings" }]} title="Security Settings" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="security" />

            <div className="max-w-lg space-y-8">
              {/* Password */}
              <div className="rounded-2xl border border-gray-300 p-6">
                <h3 className="text-gray-primary mb-1 flex items-center gap-2 text-base font-bold">
                  <KeyRound className="size-4" /> Change Password
                </h3>
                <p className="text-gray-secondary mb-5 text-sm">
                  Use a strong password you don't use anywhere else.
                </p>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <PasswordField
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Current password"
                  />
                  <PasswordField value={newPassword} onChange={setNewPassword} placeholder="New password" />
                  <PasswordField
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm new password"
                  />
                  <Button type="submit" disabled={changingPassword}>
                    {changingPassword ? <Loader2 className="size-4 animate-spin" /> : "Update Password"}
                  </Button>
                </form>
              </div>

              {/* 2FA */}
              <div className="rounded-2xl border border-gray-300 p-6">
                <h3 className="text-gray-primary mb-1 flex items-center gap-2 text-base font-bold">
                  <ShieldCheck className="size-4" /> Two-Factor Authentication
                </h3>
                <p className="text-gray-secondary mb-5 text-sm">
                  Add an extra layer of security - a 6-digit code from your authenticator app will be
                  required in addition to your password when signing in.
                </p>

                {twoFALoading ? (
                  <Loader2 className="text-gray-tertiary size-5 animate-spin" />
                ) : twoFAEnabled ? (
                  <div className="flex items-center justify-between">
                    <span className="bg-success-light text-success-dark-main flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium">
                      <ShieldCheck className="size-3.5" /> Enabled
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={<ShieldOff className="size-3.5" />}
                      onClick={() => setDisableOpen(true)}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" disabled={settingUp} onClick={startTwoFactorSetup}>
                    {settingUp ? <Loader2 className="size-4 animate-spin" /> : "Enable 2FA"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Setup 2FA modal */}
      {setupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSetupOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setSetupOpen(false)}
              className="text-gray-tertiary hover:text-gray-primary absolute top-4 right-4 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-gray-primary mb-4 text-lg font-bold">Set Up Two-Factor Authentication</h3>
            <p className="text-gray-secondary mb-4 text-sm">
              Scan this QR code with an authenticator app (Google Authenticator, Authy, etc.), then enter
              the 6-digit code it generates.
            </p>
            {qrCode && (
              <div className="mb-4 flex justify-center">
                <img src={qrCode} alt="Two-factor QR code" className="size-40 rounded-lg border border-gray-200" />
              </div>
            )}
            {secret && (
              <p className="text-gray-tertiary mb-4 text-center text-xs">
                Or enter this code manually: <span className="font-mono font-semibold">{secret}</span>
              </p>
            )}
            <form onSubmit={handleConfirmTwoFactor} className="space-y-4">
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className="border-gray-tertiary/32 h-12 w-full rounded-lg border px-4 text-center text-lg tracking-[0.5em] focus:outline-0 focus:ring-1 focus:ring-primary-main"
              />
              <Button type="submit" fullWidth disabled={confirming}>
                {confirming ? <Loader2 className="size-4 animate-spin" /> : "Confirm & Enable"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Disable 2FA modal */}
      {disableOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDisableOpen(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setDisableOpen(false)}
              className="text-gray-tertiary hover:text-gray-primary absolute top-4 right-4 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-gray-primary mb-4 text-lg font-bold">Disable Two-Factor Authentication</h3>
            <p className="text-gray-secondary mb-4 text-sm">
              Enter a current 6-digit code from your authenticator app to confirm.
            </p>
            <form onSubmit={handleDisableTwoFactor} className="space-y-4">
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                className="border-gray-tertiary/32 h-12 w-full rounded-lg border px-4 text-center text-lg tracking-[0.5em] focus:outline-0 focus:ring-1 focus:ring-primary-main"
              />
              <Button type="submit" variant="danger" fullWidth disabled={disabling}>
                {disabling ? <Loader2 className="size-4 animate-spin" /> : "Disable 2FA"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
