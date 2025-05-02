import {
  AuthError,
  UnprocessableCurrentMeterReadingsError,
  UnprocessableMeterReadingsError,
  UnprocessablePiramidaFileError,
  UnprocessableReportNineError,
  UnprocessableSimsFileError,
} from "../../utils/customErrors";

import { z } from "zod";

const response422Schema = z.object({
  file: z.enum([
    "simsFile",
    "piramidaFile",
    "meterReadings",
    "currentMeterReadings",
    "reportNineFile",
  ]),
  message: z.string().min(1),
});

type Url =
  | "api/odpy/"
  | "api/vip/"
  | "api/legal-entities/"
  | "api/matritca/"
  | "api/microgeneration/"
  | "api/private-not-transferred/";

export default async function request(
  url: Url,
  token: string,
  formData: FormData,
) {
  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if ([401, 403].includes(response.status)) {
    throw new AuthError(`${response.status} ${await response.json()}`);
  }

  if (response.status === 422) {
    const response422 = response422Schema.safeParse(await response.json());

    if (!response422.success)
      throw new Error("Invalid server response for status code 422.");

    switch (response422.data.file) {
      case "simsFile":
        throw new UnprocessableSimsFileError(`422 ${response422.data.message}`);
      case "piramidaFile":
        throw new UnprocessablePiramidaFileError(
          `422 ${response422.data.message}`,
        );
      case "meterReadings":
        throw new UnprocessableMeterReadingsError(
          `422 ${response422.data.message}`,
        );
      case "currentMeterReadings":
        throw new UnprocessableCurrentMeterReadingsError(
          `422 ${response422.data.message}`,
        );
      case "reportNineFile":
        throw new UnprocessableReportNineError(
          `422 ${response422.data.message}`,
        );
    }
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.json()}`);
  }

  const blob = await response.blob();

  return blob;
}
