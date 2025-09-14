import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import {
  AuthError,
  UnprocessableCurrentMeterReadingsError,
  UnprocessableMeterReadingsError,
  UnprocessableOneZoneMetersError,
  UnprocessablePiramidaFileError,
  UnprocessableReportNineError,
  UnprocessableSimsFileError,
} from "../../utils/customErrors";

import request from "./request";

const server = setupServer();

const mockToken = "test";
const mockFormData = new FormData();

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("request", () => {
  it("returns blob", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("file", { status: 200 });
      }),
    );

    const blob = await request("api/odpy/", mockToken, mockFormData);

    expect(blob).toBeInstanceOf(globalThis.Blob);
  });

  it("throws AuthError if the response status is 401", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("You are not authenticated.", { status: 401 });
      }),
    );

    try {
      await request("api/odpy/", mockToken, mockFormData);
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
      await request("api/odpy/", mockToken, mockFormData);
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
      await request("api/odpy/", mockToken, mockFormData);
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
      await request("api/odpy/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessablePiramidaFileError);

      if (error instanceof UnprocessablePiramidaFileError)
        expect(error.message).toBe(
          `422 The xlsx table headers do not match the headers of the report
           on readings from Pyramida 2 with a range of 4 days.`,
        );
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
      await request("api/legal-entities/", mockToken, mockFormData);
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
      await request("api/legal-entities/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableCurrentMeterReadingsError);

      if (error instanceof UnprocessableCurrentMeterReadingsError)
        expect(error.message).toBe(`422 ${errorMessage}`);
    }
  });

  it(`throws UnprocessableReportNineError if the response status is 422
      and "report №9" is invalid`, async () => {
    const errorMessage =
      "The xlsx table headers do not match the headers from report №9.";

    server.use(
      http.post("api/private-not-transferred/", () => {
        return HttpResponse.json(
          {
            file: "reportNineFile",
            message: errorMessage,
          },
          { status: 422 },
        );
      }),
    );

    try {
      await request("api/private-not-transferred/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableReportNineError);

      if (error instanceof UnprocessableReportNineError)
        expect(error.message).toBe(`422 ${errorMessage}`);
    }
  });

  it(`throws UnprocessableOneZoneMetersError if the response status is 422
    and "oneZoneMetersFile" is invalid`, async () => {
    const errorMessage =
      "The xlsx table must have column A with the serial numbers of the meters.";

    server.use(
      http.post("api/one-zone-meters/", () => {
        return HttpResponse.json(
          {
            file: "oneZoneMetersFile",
            message: errorMessage,
          },
          { status: 422 },
        );
      }),
    );

    try {
      await request("api/one-zone-meters/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableOneZoneMetersError);

      if (error instanceof UnprocessableOneZoneMetersError)
        expect(error.message).toBe(`422 ${errorMessage}`);
    }
  });

  it("throws an error if the response is not ok", async () => {
    server.use(
      http.post("api/odpy/", () => {
        return HttpResponse.json("Internal Server Error", { status: 500 });
      }),
    );

    try {
      await request("api/odpy/", mockToken, mockFormData);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      if (error instanceof Error)
        expect(error.message).toBe("500 Internal Server Error");
    }
  });
});
