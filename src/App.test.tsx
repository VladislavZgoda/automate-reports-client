import { act, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router";

import App from "./App";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const server = setupServer(
  http.get("/api/refresh", () => {
    return HttpResponse.json({ accessToken: "token" }, { status: 200 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("App", () => {
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
