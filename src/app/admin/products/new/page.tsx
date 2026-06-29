// New product page — renders ProductForm in create mode (no initial data).
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-brand-warm-white mb-8">New Product</h1>
      <ProductForm />
    </div>
  );
}
