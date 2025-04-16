import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import LegalEntities from "./pages/legalEntities/LegalEntities";
import LoginPage from "./pages/login/Login";
import MatritcaExport from "./pages/matritcaExport/MatritcaExport";
import Odpy from "./pages/odpy/Odpy";
import VIP from "./pages/vip/VIP";
import ThemeProvider from "./providers/themeProvider";
import PersistLogin from "./routes/persistLogin";
import ProtectedRoute from "./routes/protectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/matritca-export" element={<MatritcaExport />} />
              <Route path="/odpy" element={<Odpy />} />
              <Route path="/legal-entities" element={<LegalEntities />} />
              <Route path="/vip" element={<VIP />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
