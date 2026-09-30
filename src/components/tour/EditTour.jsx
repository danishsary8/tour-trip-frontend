import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTour() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        tourName: "",
        category: "",
        destination: "",
        guide: "",
        duration: "",
        price: "",
        status: "Active",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Edit Tour ID:", id);
        console.log("Updated Data:", formData);

        // TODO: API Update Tour
        // await axios.put(`/api/tours/${id}`, formData);

        alert("Tour updated successfully!");

        navigate("/admin/masters/tours");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Center Container */}
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Edit Tour
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Update tour information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/masters/tours")}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tours
                    </button>

                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-sm p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Tour ID */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tour ID
                            </label>

                            <input
                                type="text"
                                value={id}
                                disabled
                                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                            />
                        </div>

                        {/* Tour Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tour Name
                            </label>

                            <input
                                type="text"
                                name="tourName"
                                value={formData.tourName}
                                onChange={handleChange}
                                placeholder="Enter tour name"
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </div>

                        {/* Category + Destination */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3"
                                >
                                    <option value="">
                                        Select Category
                                    </option>
                                    <option value="Adventure">
                                        Adventure
                                    </option>
                                    <option value="Cultural">
                                        Cultural
                                    </option>
                                    <option value="Beach">
                                        Beach
                                    </option>
                                    <option value="City Tour">
                                        City Tour
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Destination
                                </label>

                                <input
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    placeholder="Enter destination"
                                    className="w-full border rounded-lg px-4 py-3"
                                />
                            </div>

                        </div>

                        {/* Guide + Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Assigned Guide
                                </label>

                                <select
                                    name="guide"
                                    value={formData.guide}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3"
                                >
                                    <option value="">
                                        Select Guide
                                    </option>
                                    <option value="Guide 1">
                                        Guide 1
                                    </option>
                                    <option value="Guide 2">
                                        Guide 2
                                    </option>
                                    <option value="Guide 3">
                                        Guide 3
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Duration
                                </label>

                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="Example: 3 Days"
                                    className="w-full border rounded-lg px-4 py-3"
                                />
                            </div>

                        </div>

                        {/* Price + Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Starting Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full border rounded-lg px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-3"
                                >
                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Enter tour description"
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">

                            <button
                                type="button"
                                onClick={() => navigate("/admin/masters/tours")}
                                className="px-5 py-3 border rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}