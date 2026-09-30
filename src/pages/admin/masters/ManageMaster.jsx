import React, { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Full list of 42 sample tours matching the exact design and requirements
const INITIAL_TOURS = Array.from({ length: 42 }, (_, index) => {
    const idNum = index + 1;
    const paddedId = `T-${String(idNum).padStart(3, '0')}`;

    const categories = ['CULTURAL HERITAGE', 'ADVENTURE & NATURE', 'LOCAL EXPERIENCE', 'ADVENTURE'];
    const category = categories[index % categories.length];

    const names = [
        'Angkor Wat Sunrise Signature Experi',
        'Hidden Jungle Temples Trek',
        'Tonle Sap Floating Village Half-Day',
        'Banteay Srei Temple Tour',
        'Preah Vihear Expedition',
        'Mondulkiri Elephant Sanctuary',
        'Sihanoukville Beach Escape',
        'Ratanakiri Jungle Trek',
        'Kep Crab Market Visit',
        'Otres Beach Sunset Cruise',
        'Kampot Pepper Farm & River Tour',
        'Phnom Penh Royal Palace Walk'
    ];
    const name = `${names[index % names.length]} #${Math.floor(index / names.length) + 1}`;

    const prices = [85.00, 120.00, 45.00, 65.00, 145.00, 95.00, 110.00, 130.00, 40.00, 50.00, 55.00, 75.00];
    const price = prices[index % prices.length];

    const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Active'];
    const status = statuses[index % statuses.length];

    const thumbnails = [
        'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=120',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=120'
    ];
    const thumbnail = thumbnails[index % thumbnails.length];

    return {
        id: paddedId,
        name: name,
        category: category,
        price: price,
        status: status,
        thumbnail: thumbnail
    };
});

export default function App() {
    // const navigate = useNavigate();
    const [tours, setTours] = useState(INITIAL_TOURS);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTour, setCurrentTour] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // Form states for Add/Edit
    const [formData, setFormData] = useState({
        name: '',
        category: 'CULTURAL HERITAGE',
        price: '',
        status: 'Active',
        thumbnail: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&q=80&w=120'
    });

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Pagination calculation
    const totalPages = Math.ceil(tours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTours = tours.slice(startIndex, startIndex + itemsPerPage);

    const handleAddTour = (e) => {
        e.preventDefault();
        const newId = `T-${String(tours.length + 1).padStart(3, '0')}`;
        const newTourItem = {
            id: newId,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price) || 50.00,
            status: formData.status,
            thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&q=80&w=120'
        };
        setTours([newTourItem, ...tours]);
        setIsAddModalOpen(false);
        setFormData({ name: '', category: 'CULTURAL HERITAGE', price: '', status: 'Active', thumbnail: '' });
        showToast(`Successfully added tour ${newId}`);
        setCurrentPage(1);
    };
    const handleEditClick = (tour) => {
        navigate(`/admin/masters/tours/edit/${tour.id}`);
    };

    const handleUpdateTour = (e) => {
        e.preventDefault();
        setTours(tours.map(t => t.id === currentTour.id ? {
            ...t,
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price) || t.price,
            status: formData.status,
            thumbnail: formData.thumbnail
        } : t));
        setIsEditModalOpen(false);
        showToast(`Successfully updated tour ${currentTour.id}`);
    };

    // const handleDeleteTour = (id) => {
    //     if (window.confirm(`Are you sure you want to delete tour ${id}?`)) {
    //         setTours(tours.filter(t => t.id !== id));
    //         showToast(`Tour ${id} deleted successfully.`);
    //     }
    // };
    const handleDeleteTour = (id) => {
        navigate(`/admin/masters/tours/delete/${id}`);
    };
    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white pb-16">

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}

            {/* Header Section */}
            <header className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 xl:px-14 pt-10 pb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                            Tours & Masters
                        </h1>
                        <p className="text-base text-slate-500 mt-2">
                            Manage tour packages and related master data.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/masters/tours/create")}
                        className="inline-flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-all duration-200 text-base cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Tour
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 xl:px-14">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Table Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                    <th className="py-5 px-8">Thumbnail</th>
                                    <th className="py-5 px-8">Tour Name</th>
                                    <th className="py-5 px-8">Tour ID</th>
                                    <th className="py-5 px-8">Starting Price</th>
                                    <th className="py-5 px-8">Status</th>
                                    <th className="py-5 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {currentTours.map((tour) => (
                                    <tr
                                        key={tour.id}
                                        className="hover:bg-slate-50/85 transition-colors group"
                                    >
                                        {/* Thumbnail */}
                                        <td className="py-5 px-8 whitespace-nowrap">
                                            <img
                                                src={tour.thumbnail}
                                                alt={tour.name}
                                                className="w-16 h-12 object-cover rounded-lg shadow-sm border border-slate-200"
                                            />
                                        </td>

                                        {/* Tour Name & Category */}
                                        <td className="py-5 px-8">
                                            <div className="font-semibold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                                                {tour.name}
                                            </div>
                                            <div className="text-sm text-slate-400 tracking-wider font-medium mt-1">
                                                {tour.category}
                                            </div>
                                        </td>

                                        {/* Tour ID */}
                                        <td className="py-5 px-8 whitespace-nowrap font-medium text-base text-slate-600">
                                            {tour.id}
                                        </td>

                                        {/* Starting Price */}
                                        <td className="py-5 px-8 whitespace-nowrap font-semibold text-base text-emerald-700">
                                            ${tour.price.toFixed(2)}
                                        </td>

                                        {/* Status Badge */}
                                        <td className="py-5 px-8 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${tour.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {tour.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-5 px-8 whitespace-nowrap text-right space-x-2">
                                            <button
                                                onClick={() => handleEditClick(tour)}
                                                title="Edit Tour"
                                                className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTour(tour.id)}
                                                title="Delete Tour"
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium text-slate-700">{startIndex + 1}</span> to <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, tours.length)}</span> of <span className="font-medium text-slate-700">{tours.length}</span> results
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors cursor-pointer ${currentPage === page
                                                ? 'bg-teal-700 text-white shadow-xs'
                                                : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-1 text-slate-400">...</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Add Tour Modal */}
            {/* {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
                        <div className="px-8 py-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <h3 className="text-lg font-semibold text-slate-900">Add New Tour Package</h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddTour} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tour Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Siem Reap Heritage Adventure"
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                    >
                                        <option value="CULTURAL HERITAGE">CULTURAL HERITAGE</option>
                                        <option value="ADVENTURE & NATURE">ADVENTURE & NATURE</option>
                                        <option value="LOCAL EXPERIENCE">LOCAL EXPERIENCE</option>
                                        <option value="ADVENTURE">ADVENTURE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Starting Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="85.00"
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Thumbnail Image URL</label>
                                <input
                                    type="url"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                />
                            </div>
                            <div className="pt-4 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-colors cursor-pointer"
                                >
                                    Create Tour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}

            {/* Edit Tour Modal */}
            {/* {isEditModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-semibold text-slate-900">Edit Tour ({currentTour?.id})</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTour} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Tour Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                    >
                                        <option value="CULTURAL HERITAGE">CULTURAL HERITAGE</option>
                                        <option value="ADVENTURE & NATURE">ADVENTURE & NATURE</option>
                                        <option value="LOCAL EXPERIENCE">LOCAL EXPERIENCE</option>
                                        <option value="ADVENTURE">ADVENTURE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Starting Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Thumbnail Image URL</label>
                                <input
                                    type="url"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-700"
                                />
                            </div>
                            <div className="pt-4 flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-colors cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}

        </div>
    );
}