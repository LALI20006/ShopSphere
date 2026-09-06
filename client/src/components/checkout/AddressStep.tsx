import React, { useState } from "react";
import { Plus, Check, MapPin, Building, Home, Briefcase } from "lucide-react";
import { Address } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface AddressStepProps {
  selectedAddress: Address | null;
  onSelectAddress: (addr: Address) => void;
  onProceed: () => void;
}

export const AddressStep: React.FC<AddressStepProps> = ({
  selectedAddress,
  onSelectAddress,
  onProceed,
}) => {
  const { user, addAddress } = useAuthStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    houseFlat: "",
    street: "",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    landmark: "",
    addressType: "Home" as "Home" | "Work" | "Other",
    isDefault: true,
  });
  const [formError, setFormError] = useState("");

  const addresses = user?.addresses || [];

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.houseFlat || !formData.street || !formData.pincode) {
      setFormError("Please fill in all mandatory fields.");
      return;
    }

    try {
      await addAddress(formData);
      setShowAddForm(false);
      setFormError("");
      // Select the newly added address
      const updatedUser = useAuthStore.getState().user;
      if (updatedUser && updatedUser.addresses.length > 0) {
        onSelectAddress(updatedUser.addresses[updatedUser.addresses.length - 1]);
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to save address.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Select Delivery Address</h3>
          <p className="text-xs text-slate-500">Where should we deliver your order?</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* New Address Form */}
      {showAddForm && (
        <form onSubmit={handleAddNew} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 animate-fade-in space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h4 className="font-bold text-sm text-slate-900">Add New Delivery Address</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (10 Digits) *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Flat, House No., Building *</label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 301, Sunrise Tower"
                value={formData.houseFlat}
                onChange={(e) => setFormData({ ...formData, houseFlat: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Area, Street, Sector *</label>
              <input
                type="text"
                required
                placeholder="e.g. M.G. Road, Sector 14"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode (6 Digits) *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Near Metro Station"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Address Type</label>
            <div className="flex gap-2">
              {(["Home", "Work", "Other"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, addressType: type })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    formData.addressType === type
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Save and Deliver Here
          </button>
        </form>
      )}

      {/* Saved Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddress?.id === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {addr.addressType === "Work" ? (
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <Home className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span className="font-bold text-slate-900 text-sm">{addr.fullName}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {addr.addressType}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-1">
                {addr.houseFlat}, {addr.street}
              </p>
              <p className="text-xs text-slate-600 mb-1">
                {addr.city}, {addr.state} - <b>{addr.pincode}</b>
              </p>
              {addr.landmark && (
                <p className="text-[11px] text-slate-400 mb-2">Landmark: {addr.landmark}</p>
              )}
              <p className="text-xs text-slate-700 font-semibold">Phone: {addr.phone}</p>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-indigo-200 flex items-center justify-between text-indigo-600 font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" /> Selected
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedAddress && (
        <div className="pt-2">
          <button
            onClick={onProceed}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
          >
            Deliver to this Address
          </button>
        </div>
      )}
    </div>
  );
};
