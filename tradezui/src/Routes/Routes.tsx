import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
// import ProtectedRoute from "./ProtectedRoute";
// import HomePage from "../Pages/HomePage"; // Uncomment and implement as you migrate HomePage

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Example protected route: replace HomePage with your actual home/dashboard component */}
      {/* <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} /> */}
    </Routes>
  );
};

export default AppRoutes;
