import React from 'react'
import {
  Search,
  MapPin,
  Landmark,
  Coins,
  ChevronDown,
} from "lucide-react";

const SearchPanel = () => {
   return (
    <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 translate-y-1/2 sm:px-6">
      <div className="flex w-full max-w-4xl flex-col rounded-2xl bg-white/95 p-1 shadow-xl shadow-gray-900/20 backdrop-blur sm:flex-row sm:items-stretch">

        <label className="group flex items-center gap-3 rounded-xl border border-transparent px-4 py-3 transition hover:border-indigo-600 hover:ring-2 hover:ring-indigo-600/10 lg:flex-1">
          <Search className="h-5 w-5 text-indigo-600" />

          <div className="flex-1">
            <span className="block text-xs font-semibold text-gray-400">
              Destination
            </span>

            <input
              placeholder="Search destination..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400 sm:text-base"
            />
          </div>
        </label>

        <button className="flex items-center gap-3 border-t border-gray-200 px-4 py-3 text-left transition hover:bg-gray-50 lg:flex-1 lg:border-l lg:border-t-0">
          <MapPin className="h-5 w-5 text-indigo-600" />

          <div className="flex-1">
            <span className="block text-xs font-semibold text-gray-400">
              Location
            </span>

            <span className="block truncate text-sm font-medium text-gray-800">
              All Destinations
            </span>
          </div>

          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="flex items-center gap-3 border-t border-gray-200 px-4 py-3 text-left transition hover:bg-gray-50 lg:flex-1 lg:border-l lg:border-t-0">
          <Landmark className="h-5 w-5 text-indigo-600" />

          <div className="flex-1">
            <span className="block text-xs font-semibold text-gray-400">
              Category
            </span>

            <span>All Categories</span>
          </div>

          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="flex items-center gap-3 border-t border-gray-200 px-4 py-3 text-left transition hover:bg-gray-50 lg:flex-1 lg:border-l lg:border-t-0">
          <Coins className="h-5 w-5 text-indigo-600" />

          <div className="flex-1">
            <span className="block text-xs font-semibold text-gray-400">
              Price
            </span>

            <span>Price Range</span>
          </div>

          <ChevronDown className="h-4 w-4" />
        </button>

        <button className="mt-2 flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 lg:ml-2 lg:mt-0">
          <Search className="mr-2 inline h-4 w-4" />
          Search
        </button>

      </div>
    </div>
  );
}

export default SearchPanel
