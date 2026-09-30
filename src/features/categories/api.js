import { createMastersApi } from "../../lib/mastersApi";

const api = createMastersApi("categories");
export const getCategories = api.list;
export const saveCategory = api.save;
export const deleteCategory = api.remove;
export const setCategoryStatus = api.setStatus;
