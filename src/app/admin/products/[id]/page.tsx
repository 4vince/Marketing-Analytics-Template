import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit Product</h1>
      <ProductForm initial={{
        ...product,
        images: Array.isArray(product.images) ? product.images as string[] : [],
      }} />
    </div>
  );
}
