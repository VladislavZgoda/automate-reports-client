import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";

import App from "./App";

const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJOYW1lIjoidGVzdCJ9LCJpYXQiOjE1MTYyMzkwMjJ9._Et3ivEu9mS8nI3AlT6V8DuaRuzYR5s74qtSFPM7Bh4";

const server = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json("You are not authenticated.", { status: 401 });
  }),
);

describe("App", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  it("renders Login component when the user is not logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    const h1LoginPage = await screen.findByText(/Обработка XLSX файлов/);

    expect(h1LoginPage).toBeInTheDocument();
  });

  it("renders Home component when the user is logged in", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json({ accessToken: jwtToken }, { status: 200 });
      }),
    );

    render(<App />, { wrapper: BrowserRouter });

    const h1HomePage = await screen.findByText(/Разделы меню/);

    expect(h1HomePage).toBeInTheDocument();
  });
});
