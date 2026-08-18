import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Add Product</h1>
      <p className="mt-1 text-sm text-stone-500">Add a new piece to the FashunSënze catalogue.</p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
