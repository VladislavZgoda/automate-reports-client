import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";

import App from "./App";

const serverResponse200 = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json({ accessToken: "token" }, { status: 200 });
  }),
);

const serverResponse401 = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json({ status: 401 });
  }),
);

describe("App => Home", () => {
  beforeAll(() => serverResponse200.listen());
  afterEach(() => serverResponse200.resetHandlers());
  afterAll(() => serverResponse200.close());

  it("renders Home component when the user is logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(screen.getByText("Обработка отчётов")).toBeInTheDocument();
    });
  });
});

describe("App => Login", () => {
  beforeAll(() => serverResponse401.listen());
  afterEach(() => serverResponse401.resetHandlers());
  afterAll(() => serverResponse401.close());

  it("renders Login component when the user is not logged in", async () => {
    render(<App />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(screen.getByText("Войти")).toBeInTheDocument();
    });
  });
});
