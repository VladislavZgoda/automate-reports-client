import { act, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";

import App from "./App";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

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
    await act(async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );
      await flushPromises();
    });

    expect(screen.getByText("Обработка отчётов")).toBeTruthy();
  });
});

describe("App => Login", () => {
  beforeAll(() => serverResponse401.listen());
  afterEach(() => serverResponse401.resetHandlers());
  afterAll(() => serverResponse401.close());

  it("renders Login component when the user is not logged in", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>,
      );
      await flushPromises();
    });

    expect(screen.getByText("Войти")).toBeTruthy();
  });
});
