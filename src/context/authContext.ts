import { createContext } from "react";
import type { LoginFormValues } from "src/types";

const AuthContext = createContext<{
  accessToken: string;
  handleLogin: (values: LoginFormValues) => Promise<void>;
  onLogout: () => void;
}>({
  accessToken: "",
  handleLogin: async () => {
    await new Promise((resolve) => resolve(undefined));
  },
  onLogout: () => null,
});

export default AuthContext;
