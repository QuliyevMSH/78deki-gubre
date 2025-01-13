import { useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Package, Users, MessageSquare } from "lucide-react";
import { SidebarLink } from "./navigation/SidebarLink";

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-screen w-[240px] bg-blue-600 text-white p-6 flex flex-col">
      <div className="mb-8 flex items-center gap-2">
        <img src="/lovable-uploads/0e1e6550-b588-485a-bf15-83042085c242.png" alt="Logo" className="w-8 h-8" />
        <h2 className="text-2xl font-bold">GübrəEvi</h2>
      </div>

      <nav className="space-y-2 flex-1">
        <SidebarLink
          icon={<LayoutDashboard />}
          href="/admin"
          label="Axtarış"
          isActive={location.pathname === "/admin"}
        />
        <SidebarLink
          icon={<PlusCircle />}
          href="/admin/add"
          label="Əlavə et"
          isActive={location.pathname === "/admin/add"}
        />
        <SidebarLink
          icon={<Package />}
          href="/admin/products"
          label="Məhsullar"
          isActive={location.pathname === "/admin/products"}
        />
        <SidebarLink
          icon={<Users />}
          href="/admin/users"
          label="İstifadəçilər"
          isActive={location.pathname === "/admin/users"}
        />
        <SidebarLink
          icon={<MessageSquare />}
          href="/admin/comments"
          label="Rəylər"
          isActive={location.pathname === "/admin/comments"}
        />
      </nav>
    </div>
  );
};
