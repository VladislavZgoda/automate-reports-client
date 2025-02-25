import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import AuthContext from "../context/authContext";
import type { LoginFormValues, LoginResponse } from "src/types";

type AuthProviderProps = {
  children: React.ReactNode;
};

type LocationState = {
  from?: { pathname: string | undefined };
};

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

      const token = (await response.json()) as LoginResponse;

      setAccessToken(token.accessToken);

      const origin = state?.from?.pathname ?? "/";
      await navigate(origin);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setAccessToken("");
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
