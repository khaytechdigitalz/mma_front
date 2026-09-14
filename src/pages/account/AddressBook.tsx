// src/pages/account/AddressBook.tsx
import { useEffect, useState } from "react";
import { MapPin, Loader2, Plus, Pencil, Trash2, Star, X, Building2 } from "lucide-react";
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

type LocalAddressInput = CustomerAddressInput & { is_default?: boolean };

const emptyForm: LocalAddressInput = {
  label: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  is_default: false,
};

const inputClass =
  "border-gray-tertiary/32 h-11 w-full rounded-lg border px-4 text-sm focus:outline-0 focus:ring-1 focus:ring-primary-main bg-white text-gray-primary";

export function AddressBook() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LocalAddressInput>(emptyForm);
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
      label: address.label || "", 
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || (address as any).postal_code || "",
      country: address.country || "",
      is_default: Boolean(address.is_default),
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
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-primary text-lg font-bold">Your Addresses</h3>
                  <p className="text-gray-secondary text-xs mt-0.5">Manage your shipping and billing locations</p>
                </div>
                <Button size="sm" icon={<Plus className="size-4" />} onClick={openAddForm}>
                  Add New Address
                </Button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 p-5 flex flex-col justify-between bg-white shadow-xs">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <div className="size-8 bg-gray-200 rounded-lg shrink-0"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </div>
                          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                        </div>

                        <div className="space-y-2 my-3 pl-1">
                          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                          <div className="h-3 w-20 bg-gray-100 rounded mt-1"></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <div className="h-8 w-14 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded-lg ml-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center rounded-2xl border border-dashed border-gray-300 p-8 bg-gray-50/50">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary-lighter text-primary-main">
                    <MapPin className="size-7" />
                  </div>
                  <div>
                    <h2 className="text-gray-primary text-base font-bold">No saved addresses</h2>
                    <p className="text-gray-secondary text-sm mt-1">
                      Add an address to speed up your checkout process next time.
                    </p>
                  </div>
                  <Button size="sm" onClick={openAddForm} className="mt-2">
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {addresses.map((addr) => {
                    const postalCode = addr.postal_code || (addr as any).postal_code;
                    return (
                      <div
                        key={addr.id}
                        className={cn(
                          "relative rounded-2xl border p-5 flex flex-col justify-between transition-all bg-white shadow-xs",
                          addr.is_default ? "border-primary-main ring-1 ring-primary-main/20 bg-primary-lighter/5" : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "flex size-8 items-center justify-center rounded-lg",
                                addr.is_default ? "bg-primary-main text-white" : "bg-gray-100 text-gray-600"
                              )}>
                                <Building2 className="size-4" />
                              </span>
                              <h4 className="text-gray-primary text-sm font-bold capitalize">{addr.label}</h4>
                            </div>
                            {addr.is_default && (
                              <span className="bg-primary-main flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white tracking-wide uppercase">
                                <Star className="size-3 fill-white" /> Default
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 my-3 pl-1">
                            <p className="text-gray-primary text-sm font-medium">{addr.address}</p>
                            <p className="text-gray-secondary text-xs leading-relaxed">
                              {addr.city}, {addr.state} {postalCode ? `(${postalCode})` : ""}
                            </p>
                            <p className="text-gray-secondary text-xs font-medium uppercase tracking-wider mt-1">{addr.country}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
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
                            className="!text-error-dark hover:!text-error-dark ml-auto"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Add / Edit Address Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setFormOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => setFormOpen(false)}
              className="text-gray-tertiary hover:text-gray-primary absolute top-4 right-4 cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <div className="mb-5">
              <h3 className="text-gray-primary text-lg font-bold">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>
              <p className="text-gray-secondary text-xs mt-0.5">Please provide your destination address details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-secondary mb-1.5">Address Label</label>
                <input
                  required
                  placeholder="e.g. Home, Office, Warehouse"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className={inputClass}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-secondary mb-1.5">Street Address</label>
                <input
                  required
                  placeholder="House number and street name"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-secondary mb-1.5">City</label>
                  <input
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-secondary mb-1.5">State / Province</label>
                  <input
                    required
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-secondary mb-1.5">Postal Code (Optional)</label>
                  <input
                    placeholder="Postal / ZIP code"
                    value={form.postal_code}
                    onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-secondary mb-1.5">Country</label>
                  <input
                    required
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 pb-2">
                <input
                  type="checkbox"
                  id="modal_is_default"
                  checked={Boolean(form.is_default)}
                  onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
                  className="size-4 rounded border-gray-300 text-primary-main focus:ring-primary-main accent-primary-main cursor-pointer"
                />
                <label htmlFor="modal_is_default" className="text-sm text-gray-primary select-none cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <Button type="submit" fullWidth disabled={saving}>
                <span className="flex items-center justify-center gap-2">
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Add Address"}
                </span>
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