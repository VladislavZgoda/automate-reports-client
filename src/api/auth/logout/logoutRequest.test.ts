import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { AuthError } from "../../../utils/customErrors";

import logoutRequest from "./logoutRequest";

const server = setupServer();

const mockToken = "test";

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("logoutRequest", () => {
  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.post("api/logout", () => {
        return HttpResponse.json("You are not authenticated.", {
          status: 401,
        });
      }),
    );

    try {
      await logoutRequest(mockToken);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("401 You are not authenticated.");
    }
  });

  it("throws AuthError if the response status is 403", async () => {
    server.use(
      http.post("api/logout", () => {
        return HttpResponse.json("Token is not valid.", {
          status: 403,
        });
      }),
    );

    try {
      await logoutRequest(mockToken);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("403 Token is not valid.");
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.post("api/logout", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await logoutRequest(mockToken);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });
});
