import { Link } from "react-router-dom";

interface SidebarLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
  isActive: boolean;
}

export const SidebarLink = ({ icon, href, label, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-white/20 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};