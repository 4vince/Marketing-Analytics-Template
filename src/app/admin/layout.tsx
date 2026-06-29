// Admin layout — requires authentication (redirects to sign-in), renders sidebar and page content.
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className="flex min-h-screen bg-brand-pitch">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 min-w-0 bg-brand-pitch">{children}</main>
    </div>
  );
}
