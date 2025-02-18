import { use } from "react";
import AuthContext from "../context/authContext";

export default function useAuth() {
  return use(AuthContext);
}
