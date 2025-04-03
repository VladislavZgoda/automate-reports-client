import { create } from "zustand";
import { combine } from "zustand/middleware";

const useAuthStore = create(
  combine({ accessToken: "" }, (set) => ({
    setAccessToken: (accessToken: string) =>
      set(() => ({ accessToken: accessToken })),

    reset: () => set({ accessToken: "" }),
  })),
);

export default useAuthStore;
