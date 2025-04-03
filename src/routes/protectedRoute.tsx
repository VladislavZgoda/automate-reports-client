import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "../hooks/useAuthStore";

export default function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
