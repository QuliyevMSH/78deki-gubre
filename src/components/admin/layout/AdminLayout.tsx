import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <AdminSidebar />
        <div className="pl-[240px] p-8">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};