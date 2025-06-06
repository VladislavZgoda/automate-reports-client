import { use } from "react";
import ThemeContext from "../context/themeContext";

export default function useTheme() {
  const context = use(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
