import { createContext } from "react";
import type { LoginFormValues } from "src/types";

const AuthContext = createContext<{
  accessToken: string;
  setAccessToken: (value: string) => void;
  statusCode: number | null;
  setStatusCode: (value: number | null) => void;
  handleLogin: (values: LoginFormValues) => Promise<void>;
  onLogout: () => void;
}>({
  accessToken: "",
  setAccessToken: () => null,
  statusCode: null,
  setStatusCode: () => null,
  handleLogin: async () => {
    await new Promise((resolve) => resolve(undefined));
  },
  onLogout: () => null,
});

export default AuthContext;
