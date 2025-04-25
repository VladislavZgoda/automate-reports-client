import { Navigate, Outlet, useLocation } from "react-router";
import authTokenStore from "../store/authTokenStore";

export default function ProtectedRoute() {
  const accessToken = authTokenStore.getState().accessToken;
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
