import type { LoginResponse } from "src/types";
import { AuthError } from "../utils/customErrors";

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

  const token = (await response.json()) as LoginResponse;

  return token.accessToken;
}
