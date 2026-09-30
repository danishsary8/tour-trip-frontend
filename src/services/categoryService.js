import { mockCategories } from '../pages/admin/categories/data/mockCategories';


const SIMULATED_DELAY_MS = 500;

/** @type {Array<object>} */
let categoriesStore = mockCategories.map((c) => ({ ...c }));
let nextId = Math.max(...categoriesStore.map((c) => c.id)) + 1;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY_MS));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** Fetch all categories. */
export async function getCategories() {
  return delay(clone(categoriesStore));
}

/** Create a new category. Returns the created record (with generated id/createdDate). */
export async function createCategory(payload) {
  const newCategory = {
    id: nextId++,
    name: payload.name?.trim() ?? '',
    description: payload.description?.trim() ?? '',
    status: payload.status ?? 'active',
    image: payload.image ?? '',
    icon: payload.icon ?? 'landmark',
    toursCount: 0,
    createdDate: new Date().toISOString().slice(0, 10),
    createdBy: 'Admin Hasani',
  };
  categoriesStore = [newCategory, ...categoriesStore];
  return delay(clone(newCategory));
}

/** Update an existing category by id. Returns the updated record. */
export async function updateCategory(id, payload) {
  let updated = null;
  categoriesStore = categoriesStore.map((category) => {
    if (category.id !== id) return category;
    updated = {
      ...category,
      name: payload.name?.trim() ?? category.name,
      description: payload.description?.trim() ?? category.description,
      status: payload.status ?? category.status,
      image: payload.image ?? category.image,
      icon: payload.icon ?? category.icon,
    };
    return updated;
  });
  if (!updated) throw new Error(`Category with id ${id} was not found`);
  return delay(clone(updated));
}

/** Delete a category by id. */
export async function deleteCategory(id) {
  categoriesStore = categoriesStore.filter((category) => category.id !== id);
  return delay({ id });
}
