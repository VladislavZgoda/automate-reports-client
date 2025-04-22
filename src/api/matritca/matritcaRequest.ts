import { AuthError, UnprocessableEntityError } from "../../utils/customErrors";

export default async function matritcaRequest(
  url: "api/matritca/" | "api/microgeneration/",
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
    throw new UnprocessableEntityError(`422 ${await response.json()}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.json()}`);
  }

  const blob = await response.blob();

  return blob;
}
