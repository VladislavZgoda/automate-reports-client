import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import refreshTokenRequest from "../api/auth/refersh/refreshToken";
import useTheme from "../hooks/useTheme";
import authTokenStore from "../store/authTokenStore";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = authTokenStore.getState().accessToken;

  const decoded = jwtDecode(accessToken);

  if (!decoded.exp) {
    throw new Error("There is something wrong with JWT token.");
  }

  const currentTime = Math.round(Date.now() / 1000);
  const isExpired = decoded.exp <= currentTime;

  if (!accessToken || isExpired) setIsLoading(true);

  const { theme } = useTheme();

  const handleRefreshToken = useCallback(async () => {
    try {
      const token = await refreshTokenRequest();

      authTokenStore.getState().setAccessToken(token);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!accessToken || isExpired) {
      void handleRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, handleRefreshToken, isExpired]);

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
