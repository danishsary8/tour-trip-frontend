
import React, { useState } from "react";
import CategoryHeader from "../../../components/admin/CategoryHeader";
import CatalogPreviewCard from "../../../components/admin/CatalogPreviewCard";
import { Calendar, Save, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CreateCategoryPage() {
  const [formData, setFormData] = useState({
    categoryCode: 'CAT-006',
    categoryName: '',
    description: '',
    activationDate: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saved data:', formData);
  };

  const handleReset = () => {
    setFormData({
      categoryCode: 'CAT-006',
      categoryName: '',
      description: '',
      activationDate: '',
      status: 'Active',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        <CategoryHeader onSave={handleSave} onCancel={handleReset} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Master Category Identifier & Identity
                  </h2>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                  Drafting ID
                </span>
              </div>

              {/* Category ID */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Category ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="categoryCode"
                    value={formData.categoryCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    readOnly
                  />
                  <button type="button" className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50">
                    Override
                  </button>
                </div>
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">
                    Description
                  </label>
                  <span className="text-xs text-gray-400">
                    {formData.description.length}/500
                  </span>
                </div>
                <textarea
                  name="description"
                  rows="4"
                  maxLength="500"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Activation Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
                  Creation & Schedule Activation Date
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="datetime-local"
                      name="activationDate"
                      value={formData.activationDate}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, activationDate: new Date().toISOString().slice(0, 16) }))}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50"
                  >
                    Set to Now
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs text-gray-400">Draft changes saved locally</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800"
                >
                  <Save className="w-4 h-4" />
                  Save Category
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <CatalogPreviewCard formData={formData} />

            {/* Status & Visibility Section */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Status & Visibility</h3>

              <div className="space-y-3">
                {['Active', 'Draft / Pending', 'Inactive'].map((statusOption) => (
                  <label
                    key={statusOption}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${formData.status === statusOption
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-gray-100 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value={statusOption}
                        checked={formData.status === statusOption}
                        onChange={handleChange}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{statusOption}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Best Practices Section */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Curator Best Practices
              </h3>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  Keep titles concise and clear.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  Ensure correct taxonomy linkage.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}