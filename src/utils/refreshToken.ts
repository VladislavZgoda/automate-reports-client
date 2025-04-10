import { jwtDecode } from "jwt-decode";
import refreshTokenRequest from "../api/auth/refersh/refreshToken";

export default async function refreshToken(
  token: string,
  setToken: (token: string) => void,
) {
  const decoded = jwtDecode(token);

  if (!decoded.exp) {
    throw new Error("There is something wrong with JWT token.");
  }

  const currentTime = Math.round(Date.now() / 1000);
  const isExpired = decoded.exp <= currentTime + 120;

  if (isExpired) {
    const newToken = await refreshTokenRequest();

    setToken(newToken);

    return newToken;
  } else {
    return token;
  }
}
