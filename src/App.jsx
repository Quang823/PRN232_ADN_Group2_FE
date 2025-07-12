import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/Login/LoginPage";
import RegisterPage from "./page/Register/RegisterPage";
import ClientRoute from "./routes/Client/ClientRoute";
import ClientLayout from "./routes/Client/ClientLayout";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import { ToastContainer } from "react-toastify";
import StaffLayout from "./routes/Staff/StaffLayout";
import StaffRoute from "./routes/Staff/StaffRoute";
import DepositFailPage from "./page/Client/Payment/DepositFailPage";
import DepositSuccessPage from "./page/Client/Payment/DepositSuccessPage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999, pointerEvents: "none" }}
        />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/payment-success" element={<DepositSuccessPage />} />
          <Route path="/payment-fail" element={<DepositFailPage />} />
          <Route
            path="/*"
            element={
              <ClientLayout>
                <ClientRoute />
              </ClientLayout>
            }
          />
          <Route
            path="/staff/*"
            element={
              <StaffLayout>
                <StaffRoute />
              </StaffLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
