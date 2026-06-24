// Product creation/editing form — fields for name, description, price, category, images, status.
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initial?: {
    id?: string;
    name: string; description: string; price: number; category: string;
    status: string; images: string[];
  };
}

export default function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price ? (initial.price / 100).toString() : "",
    category: initial?.category || "general",
    status: initial?.status || "draft",
    images: initial?.images?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/products", {
      method: initial?.id ? "PUT" : "POST",
      body: JSON.stringify({
        ...(initial?.id ? { id: initial.id } : {}),
        ...form,
        price: parseFloat(form.price),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setLoading(false);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label className="block mb-1">Name</label>
        <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <textarea name="description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2" rows={4} required />
      </div>
      <div>
        <label className="block mb-1">Price ($)</label>
        <input name="price" type="number" step="0.01" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1">Category</label>
        <input name="category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1">Image URLs (comma-separated)</label>
        <input name="images" value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select name="status" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="bg-primary-600 text-white px-6 py-2 rounded disabled:opacity-50">
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
