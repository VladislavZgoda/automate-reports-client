import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";
import type { LoginFormValues } from "./types";

type LoginResponse = {
  accessToken: string | undefined;
};

function App() {
  const [accessToken, setAccessToken] = useState("");

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await fetch(import.meta.env.VITE_LOGIN_API, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const token = (await response.json()) as LoginResponse;

      if (!token.accessToken) {
        throw new Error("400 Bad Request");
      }

      setAccessToken(token.accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1 className="text-3xl font-bold underline">Hello World!</h1>
          </>
        }
      />
      <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
    </Routes>
  );
}

export default App;
