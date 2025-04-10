import { Blob } from "buffer";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  AuthError,
  UnprocessablePiramidaFileError,
  UnprocessableSimsFileError,
} from "../../utils/customErrors";

import odpyRequest from "./odpyRequest";

const server = setupServer();

const mockToken = "test";
const mockFormData = new FormData();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("odpyRequest", () => {
  it("returns blob", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("file", { status: 200 });
      }),
    );

    const blob = await odpyRequest(mockToken, mockFormData);

    expect(blob).toBeInstanceOf(Blob);
  });

  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    try {
      await odpyRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("401 You are not authenticated.");
    }
  });

  it("throws AuthError if the response status is 403", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("Token is not valid.", { status: 403 });
      }),
    );

    try {
      await odpyRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("403 Token is not valid.");
    }
  });

  it(`throws UnprocessableSimsFileError if the response status is 422
      and file from the Sims is invalid`, async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json(
          {
            file: "simsFile",
            message:
              "The xlsx table headers do not match the default export headers from Sims.",
          },
          { status: 422 },
        );
      }),
    );

    try {
      await odpyRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableSimsFileError);

      if (error instanceof UnprocessableSimsFileError)
        expect(error.message).toBe(
          "422 The xlsx table headers do not match the default export headers from Sims.",
        );
    }
  });

  it(`throws UnprocessablePiramidaFileError if the response status is 422
      and file from the Piramida 2 is invalid`, async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json(
          {
            file: "piramidaFile",
            message: `The xlsx table headers do not match the headers of the report
                      on readings from Pyramida 2 with a range of 4 days.`,
          },
          { status: 422 },
        );
      }),
    );

    try {
      await odpyRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessablePiramidaFileError);

      if (error instanceof UnprocessablePiramidaFileError)
        expect(error.message).toBe(
          `422 The xlsx table headers do not match the headers of the report
           on readings from Pyramida 2 with a range of 4 days.`,
        );
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await odpyRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });
});
