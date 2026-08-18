import { notFound } from "next/navigation";
import { getProductByIdAdmin } from "@/lib/data";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdAdmin(Number(id));
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Edit Product</h1>
      <p className="mt-1 text-sm text-stone-500">{product.name}</p>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
