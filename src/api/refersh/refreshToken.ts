import { AuthError } from "../../utils/customErrors";
import tokenSchema from "../../validation/accessToken";

export default async function refreshTokenRequest() {
  const response = await fetch("/api/refresh", {
    credentials: "same-origin",
    method: "GET",
  });

  if ([401, 403].includes(response.status)) {
    throw new AuthError(`${response.status} ${await response.json()}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.json()}`);
  }

  const accessToken = tokenSchema.safeParse(await response.json());

  if (!accessToken.success)
    throw new Error("Response does not contain access token.");

  return accessToken.data.accessToken;
}
