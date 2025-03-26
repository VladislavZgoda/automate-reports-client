import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import LoginPage from "./pages/login/Login";
import MatritcaExportPage from "./pages/matritcaExport/MatritcaExport";
import Odpy from "./pages/odpy/Odpy";
import AuthProvider from "./providers/authProvider";
import ThemeProvider from "./providers/themeProvider";
import PersistLogin from "./routes/persistLogin";
import ProtectedRoute from "./routes/protectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route
                  path="/matritca-export"
                  element={<MatritcaExportPage />}
                />
                <Route path="/odpy" element={<Odpy />} />
              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
