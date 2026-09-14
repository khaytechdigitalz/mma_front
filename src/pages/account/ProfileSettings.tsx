// src/pages/account/ProfileSettings.tsx
import { useEffect, useRef, useState } from "react";
import { Loader2, Camera, User } from "lucide-react";
import { toast } from "sonner";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { fetchProfile, updateProfile, updateProfileAvatar, type CustomerProfile } from "@/api/customer";
import { cn, getImageSrc } from "@/lib/utils";

const inputClass =
  "border-gray-tertiary/32 h-12 w-full rounded-lg border px-4 text-sm focus:outline-0 focus:ring-1 focus:ring-primary-main bg-white text-gray-primary";

export function ProfileSettings() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    let cancelled = false;
    fetchProfile()
      .then((res) => {
        if (!cancelled && res?.data) {
          setProfile(res.data);
          setForm({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
          });
        }
      })
      .catch((err) => console.error("Failed to load profile", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      toast.success(res?.message || "Profile updated successfully");
      if (res?.data) setProfile(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const res = await updateProfileAvatar(file);
      toast.success("Profile photo updated");
      if (res?.data) setProfile(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update photo.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile Settings" }]} title="Profile Settings" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="profile" customer={profile || undefined} />

            <div className="max-w-2xl">
              <div className="mb-6">
                <h3 className="text-gray-primary text-lg font-bold">Profile Details</h3>
                <p className="text-gray-secondary text-xs mt-0.5">Update your personal information and profile picture</p>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-xs animate-pulse space-y-6">
                  {/* Avatar skeleton */}
                  <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                    <div className="size-20 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="space-y-2">
                      <div className="h-5 w-36 bg-gray-200 rounded"></div>
                      <div className="h-4 w-48 bg-gray-100 rounded"></div>
                    </div>
                  </div>

                  {/* Form fields skeleton */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
                      </div>
                    ))}
                    <div className="h-11 w-32 bg-gray-200 rounded-lg mt-6"></div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-xs">
                  <div className="mb-8 flex items-center gap-5 pb-6 border-b border-gray-100">
                    <div className="relative">
                      <div className="bg-primary-lighter size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-gray-100">
                        {profile?.avatar ? (
                          <img
                            src={getImageSrc(profile.avatar)}
                            alt={profile?.name || "Profile"}
                            className="size-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/placeholder.png";
                            }}
                          />
                        ) : (
                          <PlaceholderImage label={profile?.name || "Profile"} className="size-full" tone="primary" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="bg-primary-main hover:bg-primary-dark absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full text-white shadow-md cursor-pointer disabled:opacity-60 transition-colors"
                        aria-label="Change profile photo"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Camera className="size-3.5" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div>
                      <p className="text-gray-primary text-base font-bold flex items-center gap-1.5">
                        <User className="size-4 text-primary-main" /> {profile?.name || "User"}
                      </p>
                      <p className="text-gray-tertiary text-sm">{profile?.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-gray-secondary mb-1.5 block text-sm font-medium">Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Full name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-gray-secondary block text-sm font-medium">Email Address</label>
                        <span className="text-xs text-gray-tertiary italic">Email cannot be changed</span>
                      </div>
                      <input
                        required
                        type="email"
                        disabled
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="Email"
                        className={cn(inputClass, "opacity-75 cursor-not-allowed bg-gray-50")}
                      />
                    </div>
                    <div>
                      <label className="text-gray-secondary mb-1.5 block text-sm font-medium">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="Phone number"
                        className={inputClass}
                      />
                    </div>
                    <div className="pt-2">
                      <Button type="submit" disabled={saving}>
                        {saving ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="size-4 animate-spin" /> Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}