import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import refreshTokenRequest from "../api/auth/refersh/refreshToken";
import useTheme from "../hooks/useTheme";
import authTokenStore from "../store/authTokenStore";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = authTokenStore.getState().accessToken;
  const location = useLocation();

  const { theme } = useTheme();

  const handleRefreshToken = useCallback(async () => {
    try {
      const token = await refreshTokenRequest();

      authTokenStore.getState().setAccessToken(token);
    } catch (error) {
      console.error(error);
      authTokenStore.getState().reset();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const decoded = jwtDecode(accessToken);
      const currentTime = Math.round(Date.now() / 1000);
      const isExpired = decoded.exp! <= currentTime;

      if (isExpired) {
        setIsLoading(true);
        void handleRefreshToken();
      }
    } catch (error) {
      console.error(error);
    }
  }, [accessToken, handleRefreshToken, location]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader2
            strokeWidth="3px"
            color={theme === "dark" ? "#ffffff" : "#000000"}
            className="size-96 animate-spin"
          />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
