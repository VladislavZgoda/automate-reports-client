import { Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";

function App() {
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
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
