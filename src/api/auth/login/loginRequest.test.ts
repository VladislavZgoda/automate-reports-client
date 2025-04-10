import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { AuthError } from "../../../utils/customErrors";

import loginRequest from "./loginRequest";

const server = setupServer();

const mockLoginCredentials = {
  login: "test",
  password: "test",
};

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("loginRequest", () => {
  it("returns accessToken", async () => {
    server.use(
      http.post("api/login", () => {
        return HttpResponse.json({ accessToken: "test" }, { status: 200 });
      }),
    );

    const accessToken = await loginRequest(mockLoginCredentials);

    expect(accessToken).toEqual("test");
  });

  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.post("api/login", () => {
        return HttpResponse.json("Login or password incorrect.", {
          status: 401,
        });
      }),
    );

    try {
      await loginRequest(mockLoginCredentials);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("401 Login or password incorrect.");
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.post("api/login", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await loginRequest(mockLoginCredentials);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });

  it("throws an error if accessToken is missing", async () => {
    server.use(
      http.post("/api/login", () => {
        return HttpResponse.json({ accessToken: "" }, { status: 200 });
      }),
    );

    try {
      await loginRequest(mockLoginCredentials);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("Response does not contain access token.");
    }
  });
});
