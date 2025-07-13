import { Routes, Route, Navigate } from "react-router-dom";
import StaffDashboard from "../../page/Staff/StaffDashboard/StaffDashboard";
import Accounts from "../../page/Staff/Account/Accounts";
import RevenueDashboard from "../../page/Staff/Revenue/RevenueDashboard";
import ServiceDashboard from "../../page/Staff/ServiceDashboard/ServiceDashboard";
import AppointmentDashboard from "../../page/Staff/AppointmentDashboard/AppointmentDashboard";
const StaffRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="/dashboard" element={<StaffDashboard />} />
      <Route path="/account" element={<Accounts />} />
      <Route path="/revenue" element={<RevenueDashboard />} />
      <Route path="/service" element={<ServiceDashboard />} />
      <Route path="/appointment" element={<AppointmentDashboard />} />
    </Routes>
  );
};

export default StaffRoute;
