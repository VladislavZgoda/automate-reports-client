import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";

import App from "./App";

const server = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json({ accessToken: "token" }, { status: 200 });
  }),
);

describe("App => Home", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders Home component when the user is logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(screen.getByText("Обработка отчётов")).toBeInTheDocument();
    });
  });

  it("renders Login component when the user is not logged in", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    render(<App />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(screen.getByText("Войти")).toBeInTheDocument();
    });
  });
});
