import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { AuthError } from "../../../utils/customErrors";

import refreshTokenRequest from "./refreshToken";

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("refreshTokenRequest", () => {
  it("returns accessToken", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json({ accessToken: "test" }, { status: 200 });
      }),
    );

    const accessToken = await refreshTokenRequest();

    expect(accessToken).toEqual("test");
  });

  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    try {
      await refreshTokenRequest();
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("401 You are not authenticated.");
    }
  });

  it("throws AuthError if the response status is 403", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json("Token is not valid.", { status: 403 });
      }),
    );

    try {
      await refreshTokenRequest();
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("403 Token is not valid.");
    }
  });

  it("throws an error if accessToken is missing", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json({ accessToken: "" }, { status: 200 });
      }),
    );

    try {
      await refreshTokenRequest();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("Response does not contain access token.");
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.get("/api/refresh", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await refreshTokenRequest();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });
});
