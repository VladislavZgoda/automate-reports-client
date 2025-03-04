import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import AuthProvider from "./providers/authProvider";
import ProtectedRoute from "./routes/protectedRoute";
import NotFound from "./pages/404";
import Layout from "./layout/Layout";
import PersistLogin from "./routes/persistLogin";
import Home from "./pages/Home";
import MatritcaExportPage from "./pages/MatritcaExportPage";
import Odpy from "./pages/Odpy";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/matritca-export" element={<MatritcaExportPage />} />
              <Route path="/odpy" element={<Odpy />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
