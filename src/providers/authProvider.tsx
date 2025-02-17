import { useState } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../context/authContext";
import type { LoginFormValues } from "src/types";

type AuthProviderProps = {
  children: React.ReactNode;
};

type LoginResponse = {
  accessToken: string | undefined;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await fetch(import.meta.env.VITE_LOGIN_API, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const token = (await response.json()) as LoginResponse;

      if (!token.accessToken) {
        throw new Error("400 Bad Request");
      }

      setAccessToken(token.accessToken);
      await navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setAccessToken("");
  };

  const value = {
    accessToken,
    handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
