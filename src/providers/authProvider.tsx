import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { LoginFormValues } from "src/types";
import AuthContext from "../context/authContext";
import tokenSchema from "../validation/accessToken";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface LocationState {
  from?: { pathname: string | undefined };
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState("");
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await fetch("api/login", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(values),
      });

      setStatusCode(response.status);

      if (!response.ok) {
        throw new Error(`${response.status} ${await response.json()}`);
      }

      const { accessToken } = tokenSchema.parse(await response.json());
      setAccessToken(accessToken);

      const origin = state?.from?.pathname ?? "/";
      await navigate(origin);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("api/logout", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "same-origin",
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }

    setAccessToken("");
    await navigate("/login");
  };

  const value = {
    accessToken,
    setAccessToken,
    statusCode,
    setStatusCode,
    handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
