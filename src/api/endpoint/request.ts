import {
  AuthError,
  UnprocessablePiramidaFileError,
  UnprocessableSimsFileError,
} from "../../utils/customErrors";

import { response422Schema } from "../../validation/response422";

export default async function request(
  url: "api/odpy/" | "api/vip/",
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

    if (response422.data.file === "simsFile") {
      throw new UnprocessableSimsFileError(`422 ${response422.data.message}`);
    } else if (response422.data.file === "piramidaFile") {
      throw new UnprocessablePiramidaFileError(
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
