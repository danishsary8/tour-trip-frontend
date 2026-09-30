import { useEffect, useMemo, useState, useCallback } from 'react';
import * as categoryService from '../../../../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [currentPage, setCurrentPage] = useState(1);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesSearch = term === '' || category.name.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.status === 'active').length;
    const inactive = total - active;
    const totalTours = categories.reduce((sum, c) => sum + (c.toursCount || 0), 0);
    return { total, active, inactive, totalTours };
  }, [categories]);

  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all';

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
  }, []);

  const addCategory = useCallback(async (payload) => {
    const created = await categoryService.createCategory(payload);
    setCategories((prev) => [created, ...prev]);
    return created;
  }, []);

  const editCategory = useCallback(async (id, payload) => {
    const updated = await categoryService.updateCategory(id, payload);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const removeCategory = useCallback(async (id) => {
    await categoryService.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    categories: filteredCategories,
    isLoading,
    error,
    retry: loadCategories,

    searchTerm,
    setSearchTerm: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    hasActiveFilters,
    clearFilters,

    currentPage,
    setCurrentPage,
    totalFilteredCount: filteredCategories.length,

    stats,

    addCategory,
    editCategory,
    removeCategory,
  };
}
