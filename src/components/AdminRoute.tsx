import { Navigate } from "react-router-dom";
import { useAdminGuard } from "./admin/auth/AdminGuard";
import { LoadingSpinner } from "./admin/auth/LoadingSpinner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading } = useAdminGuard();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};