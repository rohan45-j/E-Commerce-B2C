import { CatalogService } from "@/server/services/catalog.service";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await CatalogService.getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} isEditing />;
}
