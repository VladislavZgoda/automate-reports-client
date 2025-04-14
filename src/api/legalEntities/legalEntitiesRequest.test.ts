import { Blob } from "buffer";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  AuthError,
  UnprocessableCurrentMeterReadingsError,
  UnprocessableMeterReadingsError,
} from "../../utils/customErrors";

import legalEntitiesRequest from "./legalEntitiesRequest";

const server = setupServer();

const mockToken = "test";
const mockFormData = new FormData();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("legalEntitiesRequest", () => {
  it("returns blob", async () => {
    server.use(
      http.post("api/legal-entities/", () => {
        return HttpResponse.json("file", { status: 200 });
      }),
    );

    const blob = await legalEntitiesRequest(mockToken, mockFormData);

    expect(blob).toBeInstanceOf(Blob);
  });

  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.post("api/legal-entities/", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    try {
      await legalEntitiesRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("401 You are not authenticated.");
    }
  });

  it("throws AuthError if the response status is 403", async () => {
    server.use(
      http.post("api/legal-entities/", () => {
        return HttpResponse.json("Token is not valid.", { status: 403 });
      }),
    );

    try {
      await legalEntitiesRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);

      if (error instanceof AuthError)
        expect(error.message).toBe("403 Token is not valid.");
    }
  });

  it(`throws UnprocessableMeterReadingsError if the response status is 422
      and report New Readings is invalid`, async () => {
    const errorMessage = `The xlsx table headers do not match the default export headers
           from report New Readings in Piramida 2.`;

    server.use(
      http.post("api/legal-entities/", () => {
        return HttpResponse.json(
          {
            file: "meterReadings",
            message: errorMessage,
          },
          { status: 422 },
        );
      }),
    );

    try {
      await legalEntitiesRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableMeterReadingsError);

      if (error instanceof UnprocessableMeterReadingsError)
        expect(error.message).toBe(`422 ${errorMessage}`);
    }
  });

  it(`throws UnprocessableCurrentMeterReadingsError if the response status is 422
      and "A+ Current Timashevsk" balance group export is invalid`, async () => {
    const errorMessage = `The xlsx table headers do not match the headers of the
           "A+ Current Timashevsk" balance group export from Pyramida 2.`;

    server.use(
      http.post("api/legal-entities/", () => {
        return HttpResponse.json(
          {
            file: "currentMeterReadings",
            message: errorMessage,
          },
          { status: 422 },
        );
      }),
    );

    try {
      await legalEntitiesRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableCurrentMeterReadingsError);

      if (error instanceof UnprocessableCurrentMeterReadingsError)
        expect(error.message).toBe(`422 ${errorMessage}`);
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.post("api/legal-entities/", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await legalEntitiesRequest(mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });
});
