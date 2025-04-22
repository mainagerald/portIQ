import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/layout/Layout";
import Home from "./pages/Home";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import MarketDashboard from "./pages/MarketDashboard";
import StockDetail from "./pages/StockDetail";
import { RootState } from "@/redux/store";

// Protected route component - only for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} 
          newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            
            {/* Protected routes */}
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="portfolio" element={<ProtectedRoute><div>Portfolio Page (Coming Soon)</div></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><div>Settings Page (Coming Soon)</div></ProtectedRoute>} />
            
            {/* Market routes */}
            <Route path="market" element={<MarketDashboard />} />
            <Route path="stock/:symbol" element={<StockDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
