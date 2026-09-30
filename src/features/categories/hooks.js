import { createMastersHooks } from "../../lib/mastersQuery";
import { deleteCategory, getCategories, saveCategory, setCategoryStatus } from "./api";

const hooks = createMastersHooks("categories", { list: getCategories, save: saveCategory, remove: deleteCategory, setStatus: setCategoryStatus });
export const useCategories = hooks.useList;
export const useSaveCategory = hooks.useSave;
export const useDeleteCategory = hooks.useDelete;
export const useCategoryStatus = hooks.useStatus;
