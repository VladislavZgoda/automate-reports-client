import useAuth from "../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import type { LoginResponse } from "src/types";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, setAccessToken } = useAuth();

  const handleRefreshToken = useCallback(async () => {
    try {
      const response = await fetch("/api/refresh", {
        credentials: "same-origin",
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${await response.json()}`);
      }

      const token = (await response.json()) as LoginResponse;

      setAccessToken(token.accessToken);
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
