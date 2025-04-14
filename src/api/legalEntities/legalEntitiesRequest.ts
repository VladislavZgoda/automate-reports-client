import {
  AuthError,
  UnprocessableCurrentMeterReadingsError,
  UnprocessableMeterReadingsError,
} from "../../utils/customErrors";

import { response422LegalSchema } from "../../validation/response422";

export default async function legalEntitiesRequest(
  token: string,
  formData: FormData,
) {
  const response = await fetch("api/legal-entities/", {
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
    const response422 = response422LegalSchema.safeParse(await response.json());

    if (!response422.success)
      throw new Error("Invalid server response for status code 422.");

    if (response422.data.file === "meterReadings") {
      throw new UnprocessableMeterReadingsError(
        `422 ${response422.data.message}`,
      );
    } else if (response422.data.file === "currentMeterReadings") {
      throw new UnprocessableCurrentMeterReadingsError(
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
