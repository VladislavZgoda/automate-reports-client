import { Blob } from "buffer";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { AuthError, UnprocessableEntityError } from "../../utils/customErrors";

import matritcaRequest from "./matritcaRequest";

const server = setupServer();

const mockToken = "test";
const mockFormData = new FormData();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("matritcaRequest", () => {
  it("returns blob", async () => {
    server.use(
      http.post("api/matritca/", () => {
        return HttpResponse.json("file", { status: 200 });
      }),
    );

    const blob = await matritcaRequest(
      "api/matritca/",
      mockToken,
      mockFormData,
    );

    expect(blob).toBeInstanceOf(Blob);
  });

  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.post("api/matritca/", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    try {
      await matritcaRequest("api/matritca/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("401 You are not authenticated.");
    }
  });

  it("throws AuthError if the response status is 403", async () => {
    server.use(
      http.post("api/matritca/", () => {
        return HttpResponse.json("Token is not valid.", { status: 403 });
      }),
    );

    try {
      await matritcaRequest("api/matritca/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("403 Token is not valid.");
    }
  });

  it("throws UnprocessableEntityError if the response status is 422", async () => {
    server.use(
      http.post("api/matritca/", () => {
        return HttpResponse.json(
          "The xlsx table headers are not the same as the default export from Sims.",
          { status: 422 },
        );
      }),
    );

    try {
      await matritcaRequest("api/matritca/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityError);

      if (error instanceof UnprocessableEntityError)
        expect(error.message).toBe(
          "422 The xlsx table headers are not the same as the default export from Sims.",
        );
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.post("api/matritca/", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await matritcaRequest("api/matritca/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });
});
