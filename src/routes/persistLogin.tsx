import useAuth from "../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import refreshTokenRequest from "../api/refreshToken";
import { Loader2 } from "lucide-react";

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

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2
            strokeWidth="3px"
            color="#000000"
            className="animate-spin size-96"
          />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
