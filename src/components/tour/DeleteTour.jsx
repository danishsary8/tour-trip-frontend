import React from "react";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteTour() {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDelete = () => {
        console.log("Delete Tour ID:", id);

        // TODO: API Delete Tour
        // await axios.delete(`/api/tours/${id}`);

        alert("Tour deleted successfully!");

        navigate("/admin/masters/tours");
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/admin/masters/tours")}
                    className="p-2 rounded-lg hover:bg-gray-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Delete Tour
                    </h1>

                    <p className="text-gray-500">
                        Delete tour from the system
                    </p>
                </div>
            </div>

            {/* Delete Card */}
            <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-8 text-center">

                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Delete this tour?
                </h2>

                <p className="text-gray-500 mb-2">
                    Are you sure you want to delete this tour?
                </p>

                <p className="text-sm text-gray-400 mb-8">
                    Tour ID: <span className="font-medium text-gray-600">{id}</span>
                </p>

                <div className="flex justify-center gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/admin/masters/tours")}
                        className="px-5 py-3 border rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Tour
                    </button>

                </div>
            </div>
        </div>
    );
}