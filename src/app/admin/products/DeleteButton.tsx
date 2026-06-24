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
    <button onClick={handleDelete} className="text-red-600 hover:text-red-800 ml-2">
      Delete
    </button>
  );
}
