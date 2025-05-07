import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import LegalEntities from "./pages/legalEntities/LegalEntities";
import LoginPage from "./pages/login/Login";
import MatritcaExport from "./pages/matritcaExport/MatritcaExport";
import Microgeneration from "./pages/microgeneration/Microgeneration";
import PrivateNotTransferred from "./pages/notTransferred/NotTransferred";
import Odpy from "./pages/odpy/Odpy";
import OneZoneMeters from "./pages/oneZoneMeters/OneZoneMeters";
import Vip from "./pages/vip/Vip";
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
              <Route path="/vip" element={<Vip />} />
              <Route path="/microgeneration" element={<Microgeneration />} />
              <Route
                path="/private-not-transferred"
                element={<PrivateNotTransferred />}
              />
              <Route path="/one-zone-meters" element={<OneZoneMeters />} />
            </Route>
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
