"use client";

import React, { useState } from "react";
import { X, AlertCircle, Droplets, MapPin, Building2, Phone, User, Clock } from "lucide-react";

export interface NewRequestData {
  patientName: string;
  phone: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospital: string;
  city: string;
  urgency: "immediate" | "within_12_hours" | "within_24_hours";
  requiredBy: string;
}

interface CreateBloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewRequestData) => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function CreateBloodRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBloodRequestModalProps) {
  const [formData, setFormData] = useState<NewRequestData>({
    patientName: "",
    phone: "",
    bloodGroup: "O+",
    unitsNeeded: 1,
    hospital: "",
    city: "Ahmedabad",
    urgency: "immediate",
    requiredBy: "Today, within 4 hours",
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hospital.trim() || !formData.phone.trim()) {
      return;
    }
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50/40">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-red-700 block">
              NEW REQUEST
            </span>
            <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
              Create Emergency Blood Request
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Request Published!</h3>
            <p className="text-sm text-gray-500 mt-1">
              Your emergency request is now live and donors nearby are being alerted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-128 overflow-y-auto">
            {/* Patient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Patient / Contact Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.patientName}
                    onChange={(e) =>
                      setFormData({ ...formData, patientName: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                  />
                </div>
              </div>
            </div>

            {/* Blood Group & Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Blood Group Needed
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodGroup: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 bg-white font-medium"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Units Needed
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.unitsNeeded}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unitsNeeded: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                />
              </div>
            </div>

            {/* Hospital & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Hospital Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Civil Hospital"
                    value={formData.hospital}
                    onChange={(e) =>
                      setFormData({ ...formData, hospital: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ahmedabad"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                  />
                </div>
              </div>
            </div>

            {/* Urgency & Required By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      urgency: e.target.value as NewRequestData["urgency"],
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 bg-white font-medium"
                >
                  <option value="immediate">Immediate (Within 4 hours)</option>
                  <option value="within_12_hours">Within 12 Hours</option>
                  <option value="within_24_hours">Within 24 Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Required By Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today, 6:00 PM"
                    value={formData.requiredBy}
                    onChange={(e) =>
                      setFormData({ ...formData, requiredBy: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
                  />
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2 p-3 bg-red-50/70 rounded-xl border border-red-100/70 text-xs text-red-900 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <span>
                Please ensure patient verification details and contact availability. Blood requests are shared with active nearby donors.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-xs transition-all active:scale-95"
              >
                Publish Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateBloodRequestModal;
