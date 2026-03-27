import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        {/* Redirect root to login for now of you don't have a dashboard */}
        <Route path="/" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}