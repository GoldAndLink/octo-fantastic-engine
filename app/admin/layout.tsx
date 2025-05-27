import AdminSidebar from "@/components/layout/admin/general/AdminSidebar";
import AdminTopBar from "@/components/layout/admin/general/AdminTopBar";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#FAF9F8]">
          {children}
        </main>
      </div>
    </div>
  );
}
