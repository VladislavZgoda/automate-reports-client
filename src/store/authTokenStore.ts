import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

interface AuthTokenStoreState {
  accessToken: string;
}

interface AuthTokenStoreActions {
  setAccessToken: (accessToken: AuthTokenStoreState["accessToken"]) => void;
}

type AuthTokenStore = AuthTokenStoreState & AuthTokenStoreActions;

const authTokenStore = createStore<AuthTokenStore>()(
  persist(
    (set) => ({
      accessToken: "",
      setAccessToken: (accessToken) => set({ accessToken: accessToken }),
    }),
    { name: "auth-token-store" },
  ),
);

export default authTokenStore;
