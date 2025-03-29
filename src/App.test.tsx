import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";

import App from "./App";

const server = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json({ accessToken: "token" }, { status: 200 });
  }),
);

describe("App", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("renders Home component when the user is logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    const h1HomePage = await screen.findByText(/Разделы меню/);

    expect(h1HomePage).toBeInTheDocument();
  });

  it("renders Login component when the user is not logged in", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    render(<App />, { wrapper: BrowserRouter });

    const h1LoginPage = await screen.findByText(/Обработка XLSX файлов/);

    expect(h1LoginPage).toBeInTheDocument();
  });
});
