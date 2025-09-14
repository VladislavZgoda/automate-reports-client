import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { vi } from "vitest";
import authTokenStore from "./store/authTokenStore";

import App from "./App";

vi.mock(import("jwt-decode"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    jwtDecode: () => {
      return "";
    },
  };
});

describe("App", () => {
  it("renders Home component when the user is logged in", () => {
    authTokenStore.getState().setAccessToken("token");

    render(<App />, { wrapper: BrowserRouter });

    const h1HomePage = screen.getAllByText(/Экспорт Sims Client/);

    expect(h1HomePage[0].textContent).toBe("Экспорт Sims Client");

    authTokenStore.getState().reset();
  });

  it("renders Login component when the user is not logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    const h1LoginPage = await screen.findByText(/Обработка XLSX файлов/);

    expect(h1LoginPage).toBeInTheDocument();
  });
});
