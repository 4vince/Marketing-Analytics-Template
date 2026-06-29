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

  const inputClass =
    "w-full bg-brand-risen border border-brand-fence rounded-xl px-4 py-2.5 text-sm text-brand-warm-white placeholder-brand-muted/50 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all";
  const labelClass = "block text-sm font-medium text-brand-muted mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5 bg-brand-clay border border-brand-fence rounded-xl p-6">
      <div>
        <label className={labelClass}>Name</label>
        <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass} placeholder="Product name" required />
      </div>
      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} resize-y min-h-[100px]`} placeholder="Describe the product..." rows={4} required />
      </div>
      <div>
        <label className={labelClass}>Price ($)</label>
        <input name="price" type="number" step="0.01" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className={inputClass} placeholder="0.00" required />
      </div>
      <div>
        <label className={labelClass}>Category</label>
        <input name="category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={inputClass} placeholder="e.g. electronics, clothing" />
      </div>
      <div>
        <label className={labelClass}>Image URLs (comma-separated)</label>
        <input name="images" value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          className={inputClass} placeholder="https://..." />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select name="status" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className={inputClass}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-primary-500 text-brand-warm-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-40 transition-all shadow-lg shadow-primary-500/20">
        {loading ? "Saving..." : initial?.id ? "Update Product" : "Save Product"}
      </button>
    </form>
  );
}
