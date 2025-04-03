import { AuthError } from "../utils/customErrors";

export default async function logoutRequest(accessToken: string) {
  const response = await fetch("api/logout", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "same-origin",
    method: "POST",
  });

  if ([401, 403].includes(response.status)) {
    throw new AuthError(`${response.status} ${await response.json()}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.json()}`);
  }
}
