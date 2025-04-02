import type { LoginFormValues } from "src/types";
import { AuthError } from "../utils/customErrors";
import tokenSchema from "../validation/accessToken";

export default async function loginRequest(values: LoginFormValues) {
  const response = await fetch("api/login", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify(values),
  });

  if (response.status === 401) {
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
