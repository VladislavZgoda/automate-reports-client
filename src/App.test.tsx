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
  it("renders Home component when the user is logged in", async () => {
    authTokenStore.getState().setAccessToken("token");

    render(<App />, { wrapper: BrowserRouter });

    const h1HomePage = await screen.findByText(/Разделы меню/);

    expect(h1HomePage).toBeInTheDocument();

    authTokenStore.getState().reset();
  });

  it("renders Login component when the user is not logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    const h1LoginPage = await screen.findByText(/Обработка XLSX файлов/);

    expect(h1LoginPage).toBeInTheDocument();
  });
});
