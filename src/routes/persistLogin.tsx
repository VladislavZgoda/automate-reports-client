import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import refreshTokenRequest from "../api/refreshToken";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, setAccessToken } = useAuth();
  const { theme } = useTheme();

  const handleRefreshToken = useCallback(async () => {
    try {
      const token = await refreshTokenRequest();

      setAccessToken(token);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [setAccessToken]);

  useEffect(() => {
    if (!accessToken) {
      void handleRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, handleRefreshToken]);

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
