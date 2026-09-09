// src/pages/account/AddressBook.tsx
import { useEffect, useState } from "react";
import { MapPin, Loader2, Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type CustomerAddress,
  type CustomerAddressInput,
} from "@/api/customer";
import { cn } from "@/lib/utils";

const emptyForm: CustomerAddressInput = {
  label: "",
  full_name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  country: "",
};

const inputClass =
  "border-gray-tertiary/32 h-11 w-full rounded-lg border px-4 text-sm focus:outline-0 focus:ring-1 focus:ring-primary-main";

export function AddressBook() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CustomerAddressInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetchAddresses();
      const list = Array.isArray(res?.data) ? res.data : [];
      setAddresses(list);
    } catch (err) {
      console.error("Failed to load addresses", err);
      toast.error("Failed to load your addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (address: CustomerAddress) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      full_name: address.full_name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
        toast.success("Address updated");
      } else {
        await createAddress(form);
        toast.success("Address added");
      }
      setFormOpen(false);
      await loadAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    setDeletingId(confirmDeleteId);
    try {
      await deleteAddress(confirmDeleteId);
      toast.success("Address removed");
      await loadAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove address.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    setSettingDefaultId(id);
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      await loadAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to set default address.");
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Address Book" }]} title="Address Book" />
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
            <AccountSidebar active="addresses" />

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-gray-primary text-base font-bold">Your Addresses</h3>
                <Button size="sm" icon={<Plus className="size-4" />} onClick={openAddForm}>
                  Add New Address
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="text-gray-tertiary size-8 animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <MapPin className="text-gray-tertiary size-16" />
                  <h2 className="text-gray-primary text-lg font-bold">No saved addresses</h2>
                  <p className="text-gray-secondary text-sm">
                    Add an address to speed up checkout next time.
                  </p>
                  <Button size="sm" onClick={openAddForm}>
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={cn(
                        "relative rounded-xl border p-5",
                        addr.is_default ? "border-primary-main" : "border-gray-300",
                      )}
                    >
                      {addr.is_default && (
                        <span className="bg-primary-main absolute top-4 right-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-white">
                          <Star className="size-3 fill-white" /> Default
                        </span>
                      )}
                      <h4 className="text-gray-primary mb-1 text-sm font-bold">{addr.label}</h4>
                      <p className="text-gray-secondary text-sm">{addr.full_name}</p>
                      <p className="text-gray-secondary text-sm">
                        {addr.address}, {addr.city}, {addr.state} {addr.zip_code}, {addr.country}
                      </p>
                      <p className="text-gray-secondary text-sm">{addr.phone}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" icon={<Pencil className="size-3.5" />} onClick={() => openEditForm(addr)}>
                          Edit
                        </Button>
                        {!addr.is_default && (
                          <Button
                            size="sm"
                            variant="outline"
                            icon={
                              settingDefaultId === addr.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Star className="size-3.5" />
                              )
                            }
                            disabled={settingDefaultId === addr.id}
                            onClick={() => handleSetDefault(addr.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={
                            deletingId === addr.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )
                          }
                          disabled={deletingId === addr.id}
                          onClick={() => setConfirmDeleteId(addr.id)}
                          className="!text-error-dark hover:!text-error-dark"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Add / Edit Address Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFormOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setFormOpen(false)}
              className="text-gray-tertiary hover:text-gray-primary absolute top-4 right-4 cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-gray-primary mb-5 text-lg font-bold">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Label (e.g. Home, Work)"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="Full Name"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <input
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
              />
              <input
                required
                placeholder="Street Address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={inputClass}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="ZIP / Postal Code"
                  value={form.zip_code}
                  onChange={(e) => setForm((f) => ({ ...f, zip_code: e.target.value }))}
                  className={inputClass}
                />
                <input
                  required
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <Button type="submit" fullWidth disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : editingId ? "Save Changes" : "Add Address"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDeleteId !== null}
        title="Remove this address?"
        description="This address will be permanently removed from your account."
        confirmLabel="Delete"
        tone="danger"
        loading={deletingId !== null}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
