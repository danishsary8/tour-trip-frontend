import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

const initialItineraries = [''];

export default function Create() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [tourId, setTourId] = useState('');
  const [status, setStatus] = useState('Active');
  const [itineraries, setItineraries] = useState(initialItineraries);
  const [thumbnail, setThumbnail] = useState(null);

  // Handle Itinerary Days
  const handleItineraryChange = (index, value) => {
    const updated = [...itineraries];
    updated[index] = value;
    setItineraries(updated);
  };

  const addItineraryDay = () => {
    setItineraries([...itineraries, '']);
  };

  const removeItineraryDay = (index) => {
    setItineraries(itineraries.filter((_, i) => i !== index));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    formRef.current?.reset();
    setTourId('');
    setStatus('Active');
    setItineraries(initialItineraries);
    setThumbnail(null);
  };

  // Handle Cancel
  const handleCancel = () => {
    resetForm();
  };

  // Save Tour
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 font-sans text-slate-800">
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">

        {/* Header Navigation */}
        <div>
          <button type="button"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg> Back to Tours & Masters
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Add New Tour</h1>
              <p className="text-sm text-slate-500 mt-1">Create a new tour package for the Angkor Travel Portal catalog.</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Draft · Tour ID {tourId ? tourId : 'not set'}</span>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
            <p className="text-xs text-slate-500"> The essentials travelers see first.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Tour ID */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tour ID <span className="text-red-500">*</span>
              </label>

              <input type="text" name="tourId" value={tourId} onChange={(e) => setTourId(e.target.value)} placeholder="e.g. T-113"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Unique code shown in the Tours table, e.g. T-113.</p>
            </div>

            {/* Tour Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tour Name <span className="text-red-500">*</span>
              </label>

              <input type="text" name="tourName" placeholder="e.g. Angkor Wat Sunrise Signature Experience"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span></label>
              <select name="category"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white text-slate-500" >
                <option value="">Select category</option>
                <option value="cultural">Cultural</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination <span className="text-red-500">*</span></label>

              <select name="destination"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white text-slate-500"
              >
                <option value="">Select destination</option>
                <option value="siem-reap">Siem Reap</option>
                <option value="phnom-penh">Phnom Penh</option>
              </select>
            </div>

            {/* Assigned Guide */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Guide</label>
              <select name="guide" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white text-slate-700">
                <option value="unassigned">Unassigned</option>
                <option value="sokha">Nhol Samean</option>
                <option value="bopha">Key Ley</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration </label>
              <input type="text" name="duration" placeholder="e.g. Half-Day, 3 Days"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDescription"
                rows="2"
                placeholder="One or two sentences describing the experience, shown in listings."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pricing & Status</h2>
            <p className="text-xs text-slate-500">Set the price travelers pay and whether the tour is bookable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Starting Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Price <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="text" name="price" placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Shown per person, in USD.</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <div className="flex w-full max-w-xs p-1 bg-slate-100 rounded-xl border border-slate-200">

                <button type="button" onClick={() => setStatus('Active')}
                  className={`flex-1 px-3 py-2 rounded-sm text-xs font-semibold text-center transition-all duration-150 ${status === 'Active'
                    ? 'bg-white m-0.5 text-teal-700 shadow-sm ring-1 ring-teal-200'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                > Active</button>
                <button type="button" onClick={() => setStatus('Inactive')}
                  className={`flex-1 m-0.5 px-3 py-2 rounded-sm text-xs font-semibold text-center transition-all duration-150 ${status === 'Inactive'
                    ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}>Inactive</button>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Itinerary</h2>
            <p className="text-xs text-slate-500">Break the experience down day by day.</p>
          </div>

          <div className="space-y-3">

            {itineraries.map((item, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-600 border border-teal-200 text-xs font-semibold flex items-center justify-center shrink-0">
                  {index + 1}
                </div>

                <input type="text" value={item} onChange={(e) => handleItineraryChange(index, e.target.value)}
                  placeholder={`What happens on day ${index + 1}...`}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600" />
                {itineraries.length > 1 && (
                  <button type="button" onClick={() => removeItineraryDay(index)}
                    className="shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button type="button" onClick={addItineraryDay}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 transition mt-2 pt-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add another day
            </button>
          </div>
        </div>
        {/* Tour Images */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900"> Tour Images </h2>
            <p className="text-xs text-slate-500">
              The first image is used as the listing thumbnail.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Thumbnail Image</label>
            <div className="flex items-center gap-4">

              {/* Thumbnail */}
              <div className="w-30 h-30 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                {thumbnail ? (
                  <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              {/* Upload */}
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-semibold transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  {thumbnail ? 'Replace Image' : 'Upload New Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>

                <p className="text-[11px] text-slate-400 mt-2"> SVG, PNG, or JPG. Max file size 2MB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={handleCancel} className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition">
            Cancel
          </button>
          <button type="submit"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition">
            Save Tour
          </button>
        </div>
      </form>
    </div>
  );
}