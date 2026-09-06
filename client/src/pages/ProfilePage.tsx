import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  Home,
  Briefcase,
  Building,
  Package,
  Heart,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useWishlistStore } from "../store/wishlistStore";
import { Address } from "../types";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, addAddress, deleteAddress, updateAddress } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);

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
    isDefault: false,
  });
  const [formError, setFormError] = useState("");

  if (!user) {
    navigate("/login?redirect=/profile");
    return null;
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.houseFlat || !formData.street || !formData.pincode) {
      setFormError("Please fill in all mandatory fields.");
      return;
    }

    try {
      await addAddress(formData);
      setShowAddForm(false);
      setFormError("");
      setFormData({
        fullName: user?.name || "",
        phone: user?.phone || "",
        houseFlat: "",
        street: "",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        landmark: "",
        addressType: "Home",
        isDefault: false,
      });
    } catch (err: any) {
      setFormError(err.response?.data?.error || "Failed to add address.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                {user.role === "admin" && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-600" /> Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/orders"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-4 h-4" />
              My Orders
            </Link>
            <Link
              to="/wishlist"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              Wishlist ({wishlistCount})
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors ml-auto sm:ml-0"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Address Book Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Your Delivery Addresses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your saved delivery locations for faster 1-click checkout.
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </button>
            )}
          </div>

          {/* Add Address Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddAddress}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-900">Add New Address</h3>

              {formError && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Flat, House no., Building *</label>
                  <input
                    type="text"
                    required
                    value={formData.houseFlat}
                    onChange={(e) => setFormData({ ...formData, houseFlat: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area, Street, Sector *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Town / City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Address Type */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-slate-700">Type:</span>
                {(["Home", "Work", "Other"] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setFormData({ ...formData, addressType: type })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      formData.addressType === type
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="makeDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="makeDefault" className="text-xs text-slate-600">
                  Make this my default shipping address
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses?.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  addr.isDefault
                    ? "border-indigo-600 bg-indigo-50/20 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                      {addr.addressType === "Home" ? (
                        <Home className="w-3 h-3" />
                      ) : addr.addressType === "Work" ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <Building className="w-3 h-3" />
                      )}
                      {addr.addressType}
                    </span>

                    {addr.isDefault && (
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{addr.fullName}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {addr.houseFlat}, {addr.street}
                    <br />
                    {addr.city}, {addr.state} - {addr.pincode}
                    {addr.landmark && <span className="block text-slate-400">Near: {addr.landmark}</span>}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Phone: {addr.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => updateAddress(addr.id, { isDefault: true })}
                      className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Primary Address
                    </span>
                  )}

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
