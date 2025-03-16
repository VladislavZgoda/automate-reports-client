import useAuth from "../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import refreshTokenRequest from "../api/refreshToken";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, setAccessToken } = useAuth();

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

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
}
