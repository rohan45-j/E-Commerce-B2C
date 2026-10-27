"use server";

import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { CatalogService } from "@/server/services/catalog.service";
import { productSchema } from "@/validators/catalog";

export async function createProductAction(formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const product = await CatalogService.createProduct(parsed.data);
    return { success: true, data: product };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create product",
    };
  }
}

export async function updateProductAction(id: string, formData: unknown) {
  await requireStaffOrAdmin();
  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  try {
    const product = await CatalogService.updateProduct(id, parsed.data);
    return { success: true, data: product };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update product",
    };
  }
}

export async function deleteProductAction(id: string) {
  await requireStaffOrAdmin();
  try {
    await CatalogService.deleteProduct(id);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete product",
    };
  }
}

export async function duplicateProductAction(id: string) {
  await requireStaffOrAdmin();
  try {
    const copy = await CatalogService.duplicateProduct(id);
    return { success: true, data: copy };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to duplicate product",
    };
  }
}
