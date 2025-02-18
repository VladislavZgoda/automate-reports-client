import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import AuthProvider from "./providers/authProvider";
import ProtectedRoute from "./routes/protectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <h1 className="text-3xl font-bold underline">Hello World!</h1>
              </>
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
