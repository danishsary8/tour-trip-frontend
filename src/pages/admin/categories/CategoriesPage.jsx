import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "./hooks/useCategories";
import CategoryFilters from "./components/CategoryFilters";
import CategoryTable from "./components/CategoryTable";
import Pagination from "./components/Pagination";
import CategoryFormModal from "./components/CategoryFormModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { PlusIcon, AlertTriangleIcon } from "./components/icons";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const {
    categories,
    isLoading,
    error,
    retry,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    clearFilters,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();

  const [formModal, setFormModal] = useState({ isOpen: false, category: null });
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    category: null,
  });

  function openCreateCategoryPage() {
    navigate("/admin/categories/create");
  }

  function openEditModal(category) {
    setFormModal({ isOpen: true, category });
  }

  function closeFormModal() {
    setFormModal({ isOpen: false, category: null });
  }

  async function handleFormSubmit(values) {
    if (formModal.category) {
      await editCategory(formModal.category.id, values);
    } else {
      await addCategory(values);
    }
    closeFormModal();
  }

  function openDeleteDialog(category) {
    setDeleteDialog({ isOpen: true, category });
  }

  function closeDeleteDialog() {
    setDeleteDialog({ isOpen: false, category: null });
  }

  async function handleConfirmDelete(id) {
    await removeCategory(id);
    closeDeleteDialog();
  }

  return (
    <div className="p-6 space-y-6">
      {/* ─── Page header ─── */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl tracking-tight">Manage Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Organize your tours into categories admins and customers can browse by.</p>
      </div>

      {/* ─── Main card ─── */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex-col gap-4 px-5 py-5 border-b border-slate-100 flex sm:px-6">
          <div className="flex-col gap-4 flex sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Category Information</h2>
              <p className="mt-0.5 text-sm text-slate-500">Manage tour categories</p>
            </div>
            <button
              type="button"
              onClick={openCreateCategoryPage}
              className="gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-teal-600 shadow-sm w-fit inline-flex items-center hover:bg-teal-700 transition-colors duration-150 shrink-0"
            >
              <PlusIcon width={17} height={17} />
              Add New Category
            </button>
          </div>

          <CategoryFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {error ? (
          <div className="flex-col gap-3 px-5 py-16 justify-center text-center flex items-center">
            <div className="justify-center w-12 h-12 rounded-full bg-rose-50 flex items-center">
              <AlertTriangleIcon width={22} height={22} className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                Couldn't load categories
              </p>
              <p className="text-sm text-slate-400 mt-0.5">{error}</p>
            </div>
            <button
              type="button"
              onClick={retry}
              className="mt-1 px-4 py-2 text-sm font-medium text-white rounded-xl bg-slate-800 hover:bg-slate-900 transition-colors duration-150"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <CategoryTable
              categories={categories}
              isLoading={isLoading}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onEdit={openEditModal}
              onDelete={openDeleteDialog}
            />
            {!isLoading && (
              <Pagination
                currentPage={1}
                totalPages={1}
                onPageChange={() => { }}
                totalCount={categories.length}
                pageSize={categories.length || 1}
              />
            )}
          </>
        )}
      </div>

      <CategoryFormModal
        key={formModal.category?.id ?? "new"}
        isOpen={formModal.isOpen}
        category={formModal.category}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        category={deleteDialog.category}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
