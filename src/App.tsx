import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import AuthProvider from "./providers/authProvider";
import ProtectedRoute from "./routes/protectedRoute";
import NotFound from "./pages/404";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-3xl font-bold underline">Hello World!</h1>
              </>
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
