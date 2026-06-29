// Delete product button — shows confirmation, DELETEs via /api/products, then refreshes page.
"use client";
import { useRouter } from "next/navigation";

export default function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      body: JSON.stringify({ id: productId }),
    });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-brand-muted hover:text-primary-500 transition-colors font-medium"
    >
      Delete
    </button>
  );
}
