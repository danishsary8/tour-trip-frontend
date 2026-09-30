import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiStar,
} from "react-icons/fi";

const TourSchedules = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const tours = [
    {
      tour_id: 1,
      category_id: 1,
      destination_id: 101,
      title: "Angkor Wat Sunrise Tour",
      price: 35,
      duration: "1 Day",
      rating_avg: 4.8,
      created_at: "2026-09-01",
    },
    {
      tour_id: 2,
      category_id: 2,
      destination_id: 102,
      title: "Phnom Penh City Tour",
      price: 25,
      duration: "1 Day",
      rating_avg: 4.6,
      created_at: "2026-09-02",
    },
    {
      tour_id: 3,
      category_id: 1,
      destination_id: 103,
      title: "Siem Reap Adventure",
      price: 80,
      duration: "3 Days",
      rating_avg: 4.9,
      created_at: "2026-09-03",
    },
    {
      tour_id: 4,
      category_id: 3,
      destination_id: 104,
      title: "Koh Rong Beach Tour",
      price: 55,
      duration: "2 Days",
      rating_avg: 4.7,
      created_at: "2026-09-04",
    },
  ];
  const filteredTours = tours.filter((tour) =>
    tour.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tour Schedules</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all tour schedules
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/tour-schedules/create")}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <FiPlus size={20} />
          Add Tour Schedule
        </button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tours */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Tours</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">
            {tours.length}
          </h2>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Price</p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">$48.75</h2>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Rating</p>

          <h2 className="mt-2 flex items-center gap-1 text-2xl font-bold text-slate-800">
            4.7
            <FiStar size={20} className="fill-yellow-400 text-yellow-400" />
          </h2>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Tours</p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {tours.length}
          </h2>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              All Tour Schedules
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTours.length} schedules found
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <FiSearch
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search tour schedule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-275 text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ID
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tour
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Destination
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Duration
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Rating
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <tr
                    key={tour.tour_id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-600">
                        #{tour.tour_id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {tour.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Category #{tour.category_id}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiMapPin size={17} className="text-blue-500" />
                        Destination #{tour.destination_id}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 font-bold text-blue-600">
                        <FiDollarSign size={16} />
                        {tour.price}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiClock size={16} className="text-slate-400" />
                        {tour.duration}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <FiStar
                          size={16}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="font-semibold text-slate-700">
                          {tour.rating_avg}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {tour.created_at}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          title="View"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                        >
                          <FiEye size={17} />
                        </button>

                        {/* Edit */}
                        <button
                          title="Edit"
                          className="rounded-lg bg-yellow-50 p-2 text-yellow-600 transition hover:bg-yellow-100"
                        >
                          <FiEdit size={17} />
                        </button>

                        {/* Delete */}
                        <button
                          title="Delete"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        >
                          <FiTrash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No tour schedules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredTours.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{tours.length}</span>{" "}
            tours
          </p>

          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-50">
              Previous
            </button>

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              1
            </button>

            <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourSchedules;
