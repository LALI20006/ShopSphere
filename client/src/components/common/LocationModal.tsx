import React, { useState } from "react";
import { X, MapPin, Check } from "lucide-react";
import { useLocationStore } from "../../store/locationStore";

const popularCities = [
  { name: "Mumbai", pincode: "400001" },
  { name: "New Delhi", pincode: "110001" },
  { name: "Bengaluru", pincode: "560001" },
  { name: "Hyderabad", pincode: "500001" },
  { name: "Chennai", pincode: "600001" },
  { name: "Kolkata", pincode: "700001" },
  { name: "Pune", pincode: "411001" },
  { name: "Ahmedabad", pincode: "380001" },
];

export const LocationModal: React.FC = () => {
  const { pincode, city, isModalOpen, closeModal, setLocation } = useLocationStore();
  const [inputPincode, setInputPincode] = useState("");
  const [error, setError] = useState("");

  if (!isModalOpen) return null;

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(inputPincode)) {
      setError("Please enter a valid 6-digit Indian pincode");
      return;
    }

    // Map common pincodes to cities or fallback to India
    let matchedCity = "India";
    const found = popularCities.find((c) => c.pincode.startsWith(inputPincode.slice(0, 2)));
    if (found) matchedCity = found.name;

    setLocation(inputPincode, matchedCity);
    setInputPincode("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Choose Delivery Location</h3>
            <p className="text-xs text-slate-500">Delivery options & speeds may vary for different areas</p>
          </div>
        </div>

        <form onSubmit={handleApplyPincode} className="mb-6">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Enter Indian Pincode
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 400050"
              value={inputPincode}
              onChange={(e) => {
                setInputPincode(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
            >
              Apply
            </button>
          </div>
          {error && <p className="text-xs text-rose-500 mt-1.5">{error}</p>}
        </form>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Popular Metros
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {popularCities.map((item) => {
              const isSelected = city === item.name || pincode === item.pincode;
              return (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.pincode, item.name)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold"
                      : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 text-sm"
                  }`}
                >
                  <span>{item.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
